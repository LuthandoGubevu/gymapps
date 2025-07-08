
"use client";

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useGyms } from '@/hooks/use-gyms';
import { getDistance } from '@/lib/geolocation';
import { useToast } from '@/hooks/use-toast';

const GYM_PROXIMITY_METERS = 100; // Increased radius for better detection

interface PresenceContextType {
  isCheckingIn: boolean;
  manualCheckIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  currentGymId: string | null;
}

const PresenceContext = createContext<PresenceContextType>({
  isCheckingIn: false,
  manualCheckIn: async () => {},
  checkOut: async () => {},
  currentGymId: null,
});

export const usePresence = () => useContext(PresenceContext);

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { gyms } = useGyms();
  const { toast } = useToast();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentGymId, setCurrentGymId] = useState<string | null>(null);

  const updatePresence = useCallback(async (gymId: string | null) => {
    if (!user) return;
    
    const presenceRef = doc(db, 'userPresence', user.uid);
    try {
      if (gymId) {
        await setDoc(presenceRef, {
          userId: user.uid,
          gymId: gymId,
          isActive: true,
          lastSeen: serverTimestamp(),
        }, { merge: true });
        setCurrentGymId(gymId);
      } else {
        await setDoc(presenceRef, { isActive: false }, { merge: true });
        setCurrentGymId(null);
      }
    } catch (error) {
        console.error("Failed to update presence:", error);
    }
  }, [user]);

  const findNearbyGym = useCallback((coords: GeolocationCoordinates): string | null => {
    if (!gyms || gyms.length === 0) return null;

    let closestGym: { id: string; distance: number } | null = null;

    for (const gym of gyms) {
      if (gym.latitude && gym.longitude) {
        const distance = getDistance(coords.latitude, coords.longitude, gym.latitude, gym.longitude);
        if (distance <= GYM_PROXIMITY_METERS) {
          if (!closestGym || distance < closestGym.distance) {
            closestGym = { id: gym.id, distance };
          }
        }
      }
    }
    return closestGym?.id ?? null;
  }, [gyms]);

  // Automatic presence update logic
  useEffect(() => {
    if (!user || !user.autoPresenceEnabled || !navigator.geolocation) {
      // If user logs out or disables auto-presence, ensure they are checked out
      if (currentGymId) {
        updatePresence(null);
      }
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const nearbyGymId = findNearbyGym(position.coords);
      // Only update if the status changes to avoid unnecessary writes
      if (nearbyGymId !== currentGymId) {
        updatePresence(nearbyGymId);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn(`Geolocation error: ${error.message}`);
      // If there's an error, check the user out to be safe
      updatePresence(null);
    };

    // Initial check
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    
    // Watch for changes
    const watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000,
    });
    
    return () => navigator.geolocation.clearWatch(watcherId);

  }, [user, user?.autoPresenceEnabled, findNearbyGym, updatePresence, currentGymId]);
  
  const manualCheckIn = useCallback(async () => {
    setIsCheckingIn(true);
    if (!navigator.geolocation) {
      toast({ variant: 'destructive', title: 'Geolocation not supported' });
      setIsCheckingIn(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nearbyGymId = findNearbyGym(position.coords);
        if (nearbyGymId) {
          await updatePresence(nearbyGymId);
          const gymName = gyms.find(g => g.id === nearbyGymId)?.gymName;
          toast({ title: 'Checked In!', description: `Welcome to MetroGym ${gymName}` });
        } else {
          toast({ variant: 'destructive', title: 'No Gym Nearby', description: `Could not find a gym within ${GYM_PROXIMITY_METERS} meters.` });
        }
        setIsCheckingIn(false);
      },
      () => {
        toast({ variant: 'destructive', title: 'Could not get location', description: 'Please ensure location services are enabled.' });
        setIsCheckingIn(false);
      },
      { enableHighAccuracy: true }
    );
  }, [findNearbyGym, updatePresence, toast, gyms]);

  const checkOut = useCallback(async () => {
    await updatePresence(null);
  }, [updatePresence]);

  const value = {
    isCheckingIn,
    manualCheckIn,
    checkOut,
    currentGymId,
  };

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
};

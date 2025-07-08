
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

// Returns occupancy for a single gym
export function useGymOccupancy(gymId: string | null) {
  const [occupancy, setOccupancy] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gymId) {
      setOccupancy(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const presenceQuery = query(
      collection(db, 'userPresence'),
      where('gymId', '==', gymId),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(presenceQuery, (snapshot) => {
      const fiveMinutesAgo = Date.now() - FIVE_MINUTES_IN_MS;
      let activeCount = 0;
      snapshot.forEach((doc) => {
        const presence = doc.data();
        if (presence.lastSeen && presence.lastSeen.toMillis() > fiveMinutesAgo) {
          activeCount++;
        }
      });
      setOccupancy(activeCount);
      setIsLoading(false);
    }, (error) => {
      console.error(`Error fetching occupancy for gym ${gymId}:`, error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [gymId]);

  return { occupancy, isLoading };
}

// Returns occupancy data for all gyms, for use in admin panel
export function useAllGymsOccupancy() {
  const [occupancyData, setOccupancyData] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const presenceQuery = query(
      collection(db, 'userPresence'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(presenceQuery, (snapshot) => {
      const fiveMinutesAgo = Date.now() - FIVE_MINUTES_IN_MS;
      const counts: Record<string, number> = {};
      
      snapshot.forEach((doc) => {
        const presence = doc.data();
        if (!presence.gymId) return;
        
        // Initialize gym count if it doesn't exist
        if (!counts[presence.gymId]) {
          counts[presence.gymId] = 0;
        }

        if (presence.lastSeen && presence.lastSeen.toMillis() > fiveMinutesAgo) {
          counts[presence.gymId]++;
        }
      });
      setOccupancyData(counts);
      setIsLoading(false);
    }, (error) => {
      console.error(`Error fetching all gyms occupancy:`, error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { occupancyData, isLoading };
}

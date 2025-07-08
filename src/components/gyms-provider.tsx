
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gym } from '@/lib/types';

interface GymsContextType {
  gyms: Gym[];
  isLoading: boolean;
}

export const GymsContext = createContext<GymsContextType>({ gyms: [], isLoading: true });

export const GymsProvider = ({ children }: { children: ReactNode }) => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gymsCollectionRef = collection(db, 'gyms');
    const q = query(gymsCollectionRef, orderBy('gymName', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gymsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gym));
      setGyms(gymsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching gyms:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GymsContext.Provider value={{ gyms, isLoading }}>
      {children}
    </GymsContext.Provider>
  );
};

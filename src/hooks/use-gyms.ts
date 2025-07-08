
"use client";
import { useContext } from 'react';
import { GymsContext } from '@/components/gyms-provider';

export const useGyms = () => {
  const context = useContext(GymsContext);
  if (context === undefined) {
    throw new Error('useGyms must be used within a GymsProvider');
  }
  return context;
};

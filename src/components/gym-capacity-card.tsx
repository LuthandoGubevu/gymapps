"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';

export function GymCapacityCard() {
  const [currentVisitors, setCurrentVisitors] = useState(0);

  useEffect(() => {
    // On client-side, randomize to simulate live data and avoid hydration mismatch
    setCurrentVisitors(Math.floor(Math.random() * 150) + 10);
  }, []);
  
  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Gym Crowd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="flex items-baseline justify-center gap-2">
                <p className="text-6xl font-bold tracking-tighter">
                  {currentVisitors > 0 ? currentVisitors : '--'}
                </p>
                <p className="text-base text-muted-foreground self-end pb-1">members</p>
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground text-center">
                Mock data — live tracking coming soon!
            </p>
        </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for now
const MAX_CAPACITY = 100;

export function GymCapacityCard() {
  const [currentVisitors, setCurrentVisitors] = useState(54); // Default to a static value for SSR

  useEffect(() => {
    // On client-side, randomize the value to make it feel "live" and avoid hydration mismatch
    setCurrentVisitors(Math.floor(Math.random() * MAX_CAPACITY));
  }, []);

  const percentage = (currentVisitors / MAX_CAPACITY) * 100;

  const getStatusText = () => {
    if (percentage > 80) return "Very Busy";
    if (percentage > 50) return "Moderate";
    return "Not Busy";
  };
  
  const getStatusColor = () => {
    if (percentage > 80) return "text-destructive";
    if (percentage > 50) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = () => {
    if (percentage > 80) return "!bg-destructive";
    if (percentage > 50) return "!bg-yellow-400";
    return "bg-primary";
  };

  return (
    <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Gym Crowd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{currentVisitors}</div>
                <div className="text-sm text-muted-foreground">/ {MAX_CAPACITY} people</div>
            </div>
             <p className={cn("text-xs font-semibold", getStatusColor())}>
                {getStatusText()} ({percentage.toFixed(0)}% full)
            </p>
            <Progress value={percentage} className="mt-4 h-2" indicatorClassName={getProgressColor()} />
            <p className="mt-2 text-xs italic text-muted-foreground">
                Mock data — live tracking coming soon!
            </p>
        </CardContent>
    </Card>
  );
}

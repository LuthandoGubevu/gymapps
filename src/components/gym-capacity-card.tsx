
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { useGymOccupancy } from "@/hooks/use-gym-occupancy";
import { usePresence } from "@/components/presence-provider";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function GymCapacityCard() {
  const { user } = useAuth();
  const { occupancy, isLoading } = useGymOccupancy(user?.primaryGym ?? null);
  const { manualCheckIn, isCheckingIn } = usePresence();
  
  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Gym Crowd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4 flex-grow">
            <div className="flex items-baseline justify-center gap-2">
                <p className="text-6xl font-bold tracking-tighter">
                  {isLoading ? <Skeleton className="h-16 w-24" /> : occupancy}
                </p>
                <p className="text-base text-muted-foreground self-end pb-1">members</p>
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground text-center">
                {user?.primaryGym ? "Live count at your primary gym." : "Set your primary gym to see live data."}
            </p>
        </CardContent>
        {user && !user.autoPresenceEnabled && user.primaryGym && (
            <CardFooter>
              <Button className="w-full" onClick={manualCheckIn} disabled={isCheckingIn}>
                {isCheckingIn ? "Checking In..." : "Manual Check-in"}
              </Button>
            </CardFooter>
        )}
    </Card>
  );
}

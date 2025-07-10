
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Loader2 } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { useGymOccupancy } from "@/hooks/use-gym-occupancy";
import { usePresence } from "@/components/presence-provider";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function GymCapacityCard() {
  const { user } = useAuth();
  const { occupancy, isLoading } = useGymOccupancy(user?.primaryGym ?? null);
  const { manualCheckIn, isCheckingIn } = usePresence();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAutoPresenceChange = async (checked: boolean) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { autoPresenceEnabled: checked });
      toast({
        title: "Preference Updated",
        description: `Automatic check-in has been ${checked ? 'enabled' : 'disabled'}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your preference. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Gym Crowd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4 flex-grow">
            <div className="flex items-baseline justify-center gap-2">
                <div className="text-6xl font-bold tracking-tighter">
                  {isLoading ? <Skeleton className="h-16 w-24" /> : occupancy}
                </div>
                <p className="text-base text-muted-foreground self-end pb-1">members</p>
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground text-center">
                {user?.primaryGym ? "Live count at your primary gym." : "Set your primary gym to see live data."}
            </p>
        </CardContent>
        {user && user.primaryGym && (
            <CardFooter className="flex flex-col gap-4">
              {!user.autoPresenceEnabled && (
                <Button className="w-full" onClick={manualCheckIn} disabled={isCheckingIn}>
                  {isCheckingIn ? "Checking In..." : "Manual Check-in"}
                </Button>
              )}
              <div className="flex items-center space-x-2 text-center text-sm">
                <Switch 
                  id="auto-presence" 
                  checked={user.autoPresenceEnabled}
                  onCheckedChange={handleAutoPresenceChange}
                  disabled={isUpdating}
                />
                <Label htmlFor="auto-presence" className="text-muted-foreground">
                  {isUpdating ? <Loader2 className="animate-spin" /> : 'Auto Check-in'}
                </Label>
              </div>
            </CardFooter>
        )}
    </Card>
  );
}

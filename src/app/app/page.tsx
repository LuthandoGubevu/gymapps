"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, HeartPulse } from "lucide-react";
import Image from "next/image";
import { GymCapacityCard } from "@/components/gym-capacity-card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || "Champion"}!</h1>
        <p className="text-muted-foreground">Ready to crush your goals today?</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GymCapacityCard />
        <Card className="shadow-md border-l-4 border-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Next Workout</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Full Body Strength</div>
            <p className="text-xs text-muted-foreground">Scheduled for today at 5:00 PM</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 5 Workouts</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground">You're on fire!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Class Schedule</CardTitle>
            <CardDescription>Check out this week's featured classes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-4">
                <Image src="https://placehold.co/600x400.png" alt="Yoga class" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="yoga stretching" />
                <h3 className="font-semibold text-lg">Sunrise Yoga</h3>
                <p className="text-muted-foreground text-sm">Find your balance and start your day with intention. Suitable for all levels.</p>
            </div>
            <div className="flex flex-col space-y-4">
                <Image src="https://placehold.co/600x400.png" alt="HIIT class" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="gym workout" />
                <h3 className="font-semibold text-lg">HIIT Power Hour</h3>
                <p className="text-muted-foreground text-sm">A high-intensity interval training session to maximize calorie burn and build strength.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

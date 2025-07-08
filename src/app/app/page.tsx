"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GymCapacityCard } from "@/components/gym-capacity-card";
import { RankProgressCard } from "@/components/rank-progress-card";
import { Trophy, Award, Medal, Star, Flame, Zap, Check } from "lucide-react";

const mockPrs = [
  { exercise: 'Bench Press', weight: '100 kg', date: '2024-07-15' },
  { exercise: 'Squat', weight: '140 kg', date: '2024-07-10' },
  { exercise: 'Deadlift', weight: '180 kg', date: '2024-07-12' },
];

const mockAchievements = [
  { id: 1, name: 'First 5 Visits', icon: Star, description: 'Completed your first 5 workouts.', achieved: true },
  { id: 2, name: 'Month Challenger', icon: Medal, description: 'Visited 12 times in a month.', achieved: true },
  { id: 3, name: 'Early Bird', icon: Flame, description: 'Completed 10 morning workouts.', achieved: false },
  { id: 4, name: 'HIIT Expert', icon: Zap, description: 'Attended 5 HIIT classes.', achieved: true },
  { id: 5, name: 'Consistent Kilo', icon: Trophy, description: 'Lifted over 10,000kg in a month.', achieved: true },
  { id: 6, name: 'New PR!', icon: Award, description: 'Set a new personal record.', achieved: true },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Welcome back, {user?.displayName || "Champion"}!</h1>
        <p className="text-muted-foreground">Ready to crush your goals today?</p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <RankProgressCard />
        <GymCapacityCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/>Personal Records</CardTitle>
                <CardDescription>Your all-time best lifts. Keep pushing!</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPrs.map(pr => (
                    <TableRow key={pr.exercise}>
                      <TableCell className="font-medium">{pr.exercise}</TableCell>
                      <TableCell>{pr.weight}</TableCell>
                      <TableCell className="text-right">{pr.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="text-primary"/>Achievements</CardTitle>
                <CardDescription>Milestones you've unlocked.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-3">
              {mockAchievements.slice(0, 6).map(ach => (
                <div key={ach.id} className="flex flex-col items-center text-center gap-2" title={ach.description}>
                   <div className="relative">
                      <ach.icon className={`size-10 ${ach.achieved ? 'text-primary' : 'text-muted-foreground/50'}`} />
                      {ach.achieved && <Check className="absolute -bottom-1 -right-1 size-5 rounded-full bg-green-500 text-white p-0.5" />}
                   </div>
                   <p className={`text-xs ${ach.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>{ach.name}</p>
                </div>
              ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

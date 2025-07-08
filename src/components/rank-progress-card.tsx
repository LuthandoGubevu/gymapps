"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, ShieldCheck, Gem, Rocket, Crown, Calendar, Clock, Repeat } from "lucide-react";
import React from "react";

const ranks = [
  { name: "Rookie", minVisits: 0, icon: Gem, color: "text-green-400" },
  { name: "Regular", minVisits: 5, icon: Rocket, color: "text-blue-400" },
  { name: "Dedicated", minVisits: 11, icon: ShieldCheck, color: "text-purple-400" },
  { name: "Beast Mode", minVisits: 16, icon: Flame, color: "text-orange-400" },
  { name: "Champion", minVisits: 25, icon: Crown, color: "text-primary" },
];

// Mock data
const userStats = {
  visitsThisMonth: 12,
  avgDurationMinutes: 55,
  currentStreak: 4,
};

export function RankProgressCard() {
  const currentRankIndex = ranks.slice().reverse().findIndex(r => userStats.visitsThisMonth >= r.minVisits);
  const currentRank = ranks[ranks.length - 1 - currentRankIndex];
  const nextRank = ranks[ranks.length - currentRankIndex];

  const progressToNextRank = nextRank
    ? ((userStats.visitsThisMonth - currentRank.minVisits) / (nextRank.minVisits - currentRank.minVisits)) * 100
    : 100;

  const visitsNeeded = nextRank ? nextRank.minVisits - userStats.visitsThisMonth : 0;
  
  const RankIcon = currentRank.icon;

  return (
    <Card className="shadow-lg lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Rank</span>
          <Badge variant="outline" className={`border-0 ${currentRank.color} bg-opacity-20 bg-current`}>
            <RankIcon className={`mr-2 size-4 ${currentRank.color}`} />
            {currentRank.name}
          </Badge>
        </CardTitle>
        <CardDescription>Your monthly progress and stats.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-muted-foreground">
                {nextRank ? `${visitsNeeded} visit${visitsNeeded === 1 ? '' : 's'} to reach ${nextRank.name}` : "You're at the top!"}
             </p>
             <p className="text-sm font-bold text-primary">{Math.floor(progressToNextRank)}%</p>
          </div>
          <Progress value={progressToNextRank} indicatorClassName="bg-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
            <Calendar className="mb-2 size-6 text-primary" />
            <p className="text-2xl font-bold">{userStats.visitsThisMonth}</p>
            <p className="text-xs text-muted-foreground">Visits this month</p>
          </div>
           <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
            <Clock className="mb-2 size-6 text-primary" />
            <p className="text-2xl font-bold">{userStats.avgDurationMinutes}<span className="text-base text-muted-foreground">m</span></p>
            <p className="text-xs text-muted-foreground">Avg. Duration</p>
          </div>
           <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
            <Repeat className="mb-2 size-6 text-primary" />
            <p className="text-2xl font-bold">{userStats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

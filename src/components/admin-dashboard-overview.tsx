
"use client"

import { useEffect, useState, useMemo } from "react"
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Users, MapPin, UserPlus, UsersRound } from "lucide-react"
import { useAllGymsOccupancy } from "@/hooks/use-gym-occupancy"
import { useGyms } from "@/hooks/use-gyms"
import { Skeleton } from "./ui/skeleton"

const chartConfig = {
  current: {
    label: "Current Members",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function AdminDashboardOverview() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [newMembersThisWeek, setNewMembersThisWeek] = useState(0);
  const [isLoadingNewMembers, setIsLoadingNewMembers] = useState(true);

  const { gyms, isLoading: gymsLoading } = useGyms();
  const { occupancyData, isLoading: occupancyLoading } = useAllGymsOccupancy();

  const chartData = useMemo(() => {
    if (gymsLoading || gyms.length === 0 || occupancyLoading) return [];
    
    // Shorten long gym names for chart display
    const formattedGyms = gyms.map(gym => ({
      ...gym,
      displayName: gym.gymName.replace('MetroGym', '').trim(),
    }));

    const liveData = formattedGyms.map(gym => ({
      name: gym.displayName,
      current: occupancyData[gym.id] || 0,
    })).sort((a,b) => b.current - a.current);

    return liveData;
  }, [gyms, occupancyData, gymsLoading, occupancyLoading]);

  const busiestLocation = useMemo(() => {
    if (!chartData || chartData.length === 0) return { name: 'N/A', active: 0 };
    // The chart data is already sorted, so the first item is the busiest
    const busiestGym = gyms.find(g => g.gymName.includes(chartData[0].name))
    return { name: busiestGym?.gymName || chartData[0].name, active: chartData[0].current };
  }, [chartData, gyms]);
  
  const totalVisitorsToday = useMemo(() => {
    if(!chartData) return 0;
    return chartData.reduce((sum, gym) => sum + gym.current, 0);
  }, [chartData]);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        setTotalUsers(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching total users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchNewMembers = async () => {
      setIsLoadingNewMembers(true);
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("createdAt", ">=", oneWeekAgoTimestamp));
        
        const querySnapshot = await getDocs(q);
        setNewMembersThisWeek(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching new members:", error);
      } finally {
        setIsLoadingNewMembers(false);
      }
    };

    fetchTotalUsers();
    fetchNewMembers();
  }, []);

  const isLoading = gymsLoading || occupancyLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Live Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalVisitorsToday.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busiest Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold truncate">{busiestLocation.name}</div>}
             {isLoading ? <Skeleton className="h-4 w-full mt-1" /> : <p className="text-xs text-muted-foreground">{busiestLocation.active} members currently active</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members This Week</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingNewMembers ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">+{newMembersThisWeek}</div>}
            <p className="text-xs text-muted-foreground">Keep up the growth!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">All-time registered members.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Live Capacity by Gym</CardTitle>
          <CardDescription className="break-words">A real-time overview of member presence at each location.</CardDescription>
        </CardHeader>
        <CardContent className="pl-0 pr-2 sm:pl-2">
          {isLoading && chartData.length === 0 ? <Skeleton className="h-[300px] w-full" /> : 
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                  <BarChart 
                      accessibilityLayer
                      data={chartData}
                      layout="vertical"
                      margin={{
                          top: 5,
                          right: 10,
                          left: -10, // Adjust left margin for mobile
                          bottom: 0,
                      }}
                  >
                      <YAxis 
                          dataKey="name" 
                          type="category"
                          stroke="hsl(var(--muted-foreground))" 
                          tickLine={false} 
                          axisLine={false} 
                          width={80} // Give a bit more space
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} // Smaller font size for mobile
                          interval={0} // Ensure all labels are shown
                      />
                      <XAxis 
                          dataKey="current"
                          type="number"
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip 
                          cursor={false} 
                          content={<ChartTooltipContent indicator="dot" />} 
                      />
                      <Bar 
                          dataKey="current" 
                          fill="var(--color-current)" 
                          radius={[0, 4, 4, 0]} 
                          layout="vertical"
                      />
                  </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          }
        </CardContent>
      </Card>
    </div>
  )
}

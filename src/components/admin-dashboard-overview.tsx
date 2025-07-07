"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Users, MapPin, UserPlus } from "lucide-react"

const mockAnalytics = {
  totalVisitorsToday: 1204,
  busiestLocation: { name: 'Amalinda', active: 175 },
  newMembersThisWeek: 87,
  gymCapacity: [
    { name: 'Mdantsane', current: 45 },
    { name: 'Quigney', current: 98 },
    { name: 'Amalinda', current: 175 },
    { name: 'Oxford', current: 78 },
  ],
};

const chartConfig = {
  current: {
    label: "Current Members",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function AdminDashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalVisitorsToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busiest Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.busiestLocation.name}</div>
            <p className="text-xs text-muted-foreground">{mockAnalytics.busiestLocation.active} members currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members This Week</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockAnalytics.newMembersThisWeek}</div>
            <p className="text-xs text-muted-foreground">Keep up the growth!</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Live Capacity by Gym</CardTitle>
          <CardDescription>A real-time overview of member presence at each location.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
                <BarChart 
                    accessibilityLayer
                    data={mockAnalytics.gymCapacity}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
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
                        radius={[4, 4, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

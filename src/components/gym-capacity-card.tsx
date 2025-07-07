"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

const MAX_CAPACITY = 200;

export function GymCapacityCard() {
  const [currentVisitors, setCurrentVisitors] = useState(127);

  useEffect(() => {
    // On client-side, randomize to simulate live data and avoid hydration mismatch
    setCurrentVisitors(Math.floor(Math.random() * (MAX_CAPACITY * 0.9)));
  }, []);

  const percentage = Math.round((currentVisitors / MAX_CAPACITY) * 100);

  const chartData = [
    { name: 'capacity', value: percentage, fill: 'hsl(var(--primary))' },
  ];

  const getStatusColor = () => {
    if (percentage > 80) return "text-destructive";
    if (percentage > 50) return "text-yellow-400";
    return "text-green-400";
  };
  
  return (
    <Card className="col-span-1 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Gym Crowd</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="relative flex flex-col items-center justify-center p-0 pt-4">
            <div className="h-[120px] w-[120px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer>
                        <RadialBarChart
                            data={chartData}
                            innerRadius="80%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={-270}
                            barSize={10}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                            <RadialBar
                                background={{ fill: 'hsl(var(--muted))' }}
                                dataKey="value"
                                cornerRadius={5}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-4xl font-bold">{currentVisitors}</p>
                <p className="text-xs text-muted-foreground">/ {MAX_CAPACITY}</p>
                <p className={`mt-1 text-sm font-semibold ${getStatusColor()}`}>
                    {percentage}% Full
                </p>
            </div>
            <p className="mt-2 px-6 pb-6 text-xs italic text-muted-foreground text-center">
                Mock data — live tracking coming soon!
            </p>
        </CardContent>
    </Card>
  );
}

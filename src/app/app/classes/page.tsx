"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locations } from "@/lib/class-schedule";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Day } from "@/lib/class-schedule";

const dayMapping: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getToday = (): Day => {
    const dayIndex = new Date().getDay(); // Sunday - 0, Monday - 1...
    // Adjust to make Monday = 0, Tuesday = 1, ..., Sunday = 6
    const adjustedIndex = (dayIndex + 6) % 7;
    // Default to Monday for weekends as there are no weekend classes
    return dayMapping[adjustedIndex] || 'Monday';
};


export default function ClassesPage() {
    const [today, setToday] = useState<Day | null>(null);

    useEffect(() => {
        setToday(getToday());
    }, []);


    if (!today) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Book a Class</h1>
                    <p className="text-muted-foreground">Loading available locations...</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Book a Class</h1>
                <p className="text-muted-foreground">Select a location to see the class schedule.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {locations.map((location) => {
                    const classesToday = location.schedule.filter(c => c.day === today).length;
                    return (
                        <Card key={location.id} className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="text-primary" />
                                    {location.name}
                                </CardTitle>
                                <CardDescription>{location.address}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-4" />
                                    <span>
                                        {classesToday > 0 
                                            ? `${classesToday} class${classesToday > 1 ? 'es' : ''} available today`
                                            : "No classes scheduled today"
                                        }
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/app/classes/${location.id}`} className="w-full">
                                    <Button className="w-full font-bold">
                                        View Schedule
                                        <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

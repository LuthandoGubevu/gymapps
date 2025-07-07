"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trainerLocations } from "@/lib/trainer-schedule";
import { MapPin, Users, ArrowRight } from "lucide-react";

export default function TrainersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Book a Personal Trainer</h1>
                <p className="text-muted-foreground">Select a location to see available trainers.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {trainerLocations.map((location) => {
                    const trainersAvailable = location.trainers.length;
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
                                    <Users className="size-4" />
                                    <span>
                                        {trainersAvailable > 0
                                            ? `${trainersAvailable} trainer${trainersAvailable > 1 ? 's' : ''} available`
                                            : "No trainers available"
                                        }
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/app/trainers/${location.id}`} className="w-full">
                                    <Button className="w-full font-bold">
                                        View Trainers
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

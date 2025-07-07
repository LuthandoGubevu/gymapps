"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locations } from "@/lib/class-schedule";
import { MapPin, ArrowRight, MessageSquare } from "lucide-react";

export default function ChatLocationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Group Chat</h1>
                <p className="text-muted-foreground">Select a location to join the conversation.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {locations.map((location) => (
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
                                <MessageSquare className="size-4" />
                                <span>Community chat for members</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/app/chat/${location.id}`} className="w-full">
                                <Button className="w-full font-bold">
                                    Open Chat
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

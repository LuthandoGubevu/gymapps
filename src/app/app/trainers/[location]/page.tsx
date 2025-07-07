"use client";

import { useState, useMemo, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { 
  trainerLocations, 
  getAvailableDaysForLocation, 
  getAvailableTimesForLocation, 
  Trainer, 
  Specialty 
} from '@/lib/trainer-schedule';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, UserCheck } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const specialtyColorMap: Record<Specialty, string> = {
  'Strength': 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
  'HIIT': 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
  'Cardio': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  'Boxing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  'Body Con': 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  'Spinning': 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
  'Step': 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
};

const SpecialtyBadge = ({ name }: { name: Specialty }) => (
  <Badge variant="outline" className={cn("font-semibold", specialtyColorMap[name])}>
    {name}
  </Badge>
);

export default function LocationTrainersPage({ params: { location: locationId } }: { params: { location: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const location = useMemo(() => trainerLocations.find(l => l.id === locationId), [locationId]);

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [isBooking, setIsBooking] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && user && user.primaryGym !== locationId) {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You can only view trainers for your primary gym.",
        });
        router.push(`/app/trainers/${user.primaryGym}`);
    }
  }, [user, authLoading, locationId, router, toast]);

  const availableDays = useMemo(() => {
    if (!location) return [];
    return getAvailableDaysForLocation(location.id);
  }, [location]);

  const availableTimes = useMemo(() => {
    if (!location) return [];
    return getAvailableTimesForLocation(location.id);
  }, [location]);

  const filteredTrainers = useMemo(() => {
    if (!location) return [];
    if (selectedDay === 'all' || selectedTime === 'all') {
      return location.trainers;
    }
    return location.trainers.filter(trainer => {
        const dayAvailability = trainer.availability[selectedDay as keyof typeof trainer.availability];
        return dayAvailability && dayAvailability.includes(selectedTime);
    });
  }, [location, selectedDay, selectedTime]);

  const handleBooking = async (trainer: Trainer) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You need to be logged in to book a trainer." });
      return;
    }
    if (selectedDay === 'all' || selectedTime === 'all') {
      toast({ variant: "destructive", title: "Selection Missing", description: "Please select a day and time to book." });
      return;
    }
    setIsBooking(trainer.id);
    try {
      await addDoc(collection(db, "trainerBookings"), {
        userId: user.uid,
        userName: user.displayName || "Unknown User",
        userEmail: user.email,
        gymId: locationId,
        gymName: location?.name,
        trainerId: trainer.id,
        trainerName: trainer.name,
        day: selectedDay,
        time: selectedTime,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast({
        title: "✅ Booking Requested",
        description: `Your request for ${trainer.name} on ${selectedDay} at ${selectedTime} has been sent.`,
      });
    } catch (error) {
      console.error("Error booking trainer:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was a problem requesting your booking. Please try again.",
      });
    } finally {
      setIsBooking(null);
    }
  };

  if (authLoading || (!user && !location)) {
      return <div>Loading...</div>
  }

  if (!location) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Trainers at {location.name}</h1>
        <p className="text-muted-foreground">Book a session with one of our expert trainers.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter Trainers</CardTitle>
          <CardDescription>Find a trainer for your preferred day and time.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block" htmlFor="day-select">Day of the week</label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger id="day-select">
                <CalendarIcon className="mr-2 size-4" />
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {availableDays.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block" htmlFor="time-select">Time slot</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time-select">
                <Clock className="mr-2 size-4" />
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                {availableTimes.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map(trainer => (
            <Card key={trainer.id} className="shadow-md hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center">
                 <Image src={trainer.avatarUrl} alt={trainer.name} width={100} height={100} className="rounded-full border-4 border-primary/50" data-ai-hint="portrait person" />
                 <CardTitle className="pt-4">{trainer.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-sm text-muted-foreground mb-4">Specialties</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {trainer.specialties.map(specialty => (
                        <SpecialtyBadge key={specialty} name={specialty} />
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                 <Button 
                   className="w-full font-bold" 
                   onClick={() => handleBooking(trainer)} 
                   disabled={selectedDay === 'all' || selectedTime === 'all' || isBooking === trainer.id}
                  >
                    <UserCheck className="mr-2 size-4"/>
                    {isBooking === trainer.id ? 'Requesting...' : 'Requesting...'}
                 </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="h-48 flex items-center justify-center">
                <p className="text-muted-foreground">
                    {selectedDay === 'all' || selectedTime === 'all' 
                        ? 'Please select a day and time to see available trainers.'
                        : 'No trainers available for this selection. Try another time or day.'
                    }
                </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

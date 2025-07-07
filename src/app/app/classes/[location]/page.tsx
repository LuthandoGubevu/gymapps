"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { locations, ClassInfo, ClassName } from '@/lib/class-schedule';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, Dumbbell } from 'lucide-react';

const classColorMap: Record<ClassName, string> = {
  'HIIT': 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
  'Spinning': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  'Spinn': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  'Body Con': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  'Box': 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
  'Step': 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  'Small Group PT': 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
  'Instructor Decides': 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30',
  'Only for the Brave': 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
  '': 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30',
};

const ClassBadge = ({ name }: { name: ClassName }) => {
  if (!name) return null;
  return (
    <Badge variant="outline" className={cn("font-semibold", classColorMap[name])}>
      {name}
    </Badge>
  );
};

export default function LocationClassesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const locationId = params.location as string;
  
  const location = useMemo(() => locations.find(l => l.id === locationId), [locationId]);

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');

  useEffect(() => {
    // Redirect user if they try to access a page for a different gym
    if (!authLoading && user && user.primaryGym !== locationId) {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You can only view classes for your primary gym.",
        });
        router.push(`/app/classes/${user.primaryGym}`);
    }
  }, [user, authLoading, locationId, router, toast]);
  
  const availableDays = useMemo(() => {
    if (!location) return [];
    return [...new Set(location.schedule.map(c => c.day))];
  }, [location]);

  const availableTimes = useMemo(() => {
    if (!location) return [];
    const times = location.schedule.map(c => c.time);
    return [...new Set(times)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [location]);

  const filteredClasses = useMemo(() => {
    if (!location) return [];
    return location.schedule.filter(c => 
      (selectedDay === 'all' || c.day === selectedDay) &&
      (selectedTime === 'all' || c.time === selectedTime)
    );
  }, [location, selectedDay, selectedTime]);

  const handleBooking = (cls: ClassInfo) => {
    toast({
      title: "✅ Class Booked!",
      description: `Successfully booked ${cls.name} on ${cls.day} at ${cls.time}.`,
    });
  };

  if (authLoading || (!user && !location)) {
      return <div>Loading...</div> // Or a proper skeleton loader
  }

  if (!location) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Class Schedule: {location.name}</h1>
        <p className="text-muted-foreground">Book your spot in one of our classes.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter Classes</CardTitle>
          <CardDescription>Find the perfect class for your schedule.</CardDescription>
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
      
      <Card className="shadow-lg">
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead><Dumbbell className="inline-block mr-2 size-4"/>Class</TableHead>
                <TableHead><CalendarIcon className="inline-block mr-2 size-4"/>Day</TableHead>
                <TableHead><Clock className="inline-block mr-2 size-4"/>Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                        <ClassBadge name={cls.name} />
                    </TableCell>
                    <TableCell>{cls.day}</TableCell>
                    <TableCell>{cls.time}</TableCell>
                    <TableCell className="text-right">
                        <Button onClick={() => handleBooking(cls)} size="sm" disabled={!cls.name || cls.name === "Instructor Decides"}>
                        Book Now
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No classes match your selection. Try a different filter.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </Card>
    </div>
  );
}

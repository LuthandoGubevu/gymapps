"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe, MapPin, Loader2, Users, Clock, Tag, Music, Disc, Calendar as CalendarIcon, Announce } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';

const manageGymsFormSchema = z.object({
  gymName: z.string().min(3, { message: "Gym name must be at least 3 characters." }),
  address: z.string().min(10, { message: "Address seems too short." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  crowdCount: z.coerce.number().int().nonnegative().optional(),
  waitTime: z.string().optional(),
  thresholdLow: z.coerce.number().int().nonnegative(),
  thresholdModerate: z.coerce.number().int().nonnegative(),
  thresholdPacked: z.coerce.number().int().nonnegative(),
  promoTags: z.string().optional(),
  musicGenres: z.string().optional(),
  djInfo: z.string().optional(),
  announcement: z.string().optional(),
  promoExpiry: z.date().optional(),
});

export function ManageGymsForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<z.infer<typeof manageGymsFormSchema>>({
    resolver: zodResolver(manageGymsFormSchema),
    defaultValues: {
      gymName: "",
      address: "",
      imageUrl: "",
      latitude: 0,
      longitude: 0,
      crowdCount: 0,
      waitTime: "",
      thresholdLow: 20,
      thresholdModerate: 50,
      thresholdPacked: 80,
      promoTags: "",
      musicGenres: "",
      djInfo: "",
      announcement: "",
    },
  });

  const handleUseCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          toast({ title: "Success", description: "Location fetched successfully." });
          setIsGettingLocation(false);
        },
        (error) => {
          toast({ variant: "destructive", title: "Error", description: `Could not get location: ${error.message}` });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({ variant: "destructive", title: "Error", description: "Geolocation is not supported by this browser." });
      setIsGettingLocation(false);
    }
  };

  async function onSubmit(values: z.infer<typeof manageGymsFormSchema>) {
    setIsSubmitting(true);
    // Here you would typically send the data to your backend/Firestore
    console.log("Adding new gym:", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "✅ Gym Added",
      description: `${values.gymName} has been successfully added.`,
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Manage Gyms</CardTitle>
        <CardDescription>Add a new gym location to the MetroGym network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="text-primary"/>Basic Gym Info</h3>
              <FormField
                control={form.control}
                name="gymName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gym Name</FormLabel>
                    <FormControl><Input placeholder="MetroGym Downtown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="123 Fitness Ave, Gymtown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/gym.jpg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

            {/* Geolocation Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="text-primary"/>Location (Geolocation)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isGettingLocation}>
                        {isGettingLocation ? <Loader2 className="animate-spin" /> : "Use Current Location"}
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder="34.0522" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder="-118.2437" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <CardDescription>A map with a draggable marker could be integrated here with a maps API.</CardDescription>
            </div>

            <Separator />
            
            {/* Crowd & Capacity Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="text-primary"/>Crowd & Capacity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="crowdCount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Crowd Count</FormLabel>
                            <FormControl><Input type="number" placeholder="55" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="waitTime"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated Wait Time</FormLabel>
                            <FormControl><Input placeholder="e.g., 5 mins for squat rack" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div>
                  <FormLabel>Crowd Status Thresholds</FormLabel>
                  <FormDescription>Set the number of people for each status.</FormDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <FormField control={form.control} name="thresholdLow" render={({ field }) => (<FormItem><FormLabel className="text-xs text-green-400">Low</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="thresholdModerate" render={({ field }) => (<FormItem><FormLabel className="text-xs text-yellow-400">Moderate</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="thresholdPacked" render={({ field }) => (<FormItem><FormLabel className="text-xs text-red-400">Packed</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  </div>
                </div>
            </div>

            <Separator />

            {/* Promotions Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Tag className="text-primary"/>Promotions (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="promoTags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="Live DJ, Protein Shake Special" {...field} /></FormControl><FormDescription>Comma-separated tags.</FormDescription></FormItem>)} />
                    <FormField control={form.control} name="musicGenres" render={({ field }) => (<FormItem><FormLabel>Music Genres</FormLabel><FormControl><Input placeholder="House, Hip-Hop" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="djInfo" render={({ field }) => (<FormItem><FormLabel>DJ Info</FormLabel><FormControl><Input placeholder="DJ Spinfast" {...field} /></FormControl></FormItem>)} />
                    <FormField
                        control={form.control}
                        name="promoExpiry"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Promotion Expiry Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="announcement"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>General Announcement</FormLabel>
                        <FormControl><Textarea placeholder="Special announcement for this gym..." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Add Gym
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

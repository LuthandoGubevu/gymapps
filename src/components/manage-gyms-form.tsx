"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { Gym, GymFormData, manageGymsFormSchema } from '@/lib/types';

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe, MapPin, Loader2, Users, Clock, Tag, Plus, Trash2, Edit, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

const getStatus = (count: number, low: number, moderate: number) => {
    if (count <= low) return { label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (count <= moderate) return { label: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'Packed', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
}

function GymFormDialog({ isOpen, onOpenChange, onSubmit, isSubmitting, gym }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GymFormData) => void;
    isSubmitting: boolean;
    gym: Gym | null;
}) {
    const { toast } = useToast();
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const form = useForm<GymFormData>({
        resolver: zodResolver(manageGymsFormSchema),
        defaultValues: {
            gymName: "", address: "", imageUrl: "",
            latitude: 0, longitude: 0, crowdCount: 0,
            waitTime: "", thresholdLow: 20, thresholdModerate: 50,
            thresholdPacked: 80, promotionTags: "", workoutFocusAreas: "",
            trainerOrGuestInfo: "", generalGymNotice: "", offerExpiryDate: undefined,
        },
    });

    useEffect(() => {
        if (gym) {
            form.reset({
                ...gym,
                offerExpiryDate: gym.offerExpiryDate ? gym.offerExpiryDate.toDate() : undefined
            });
        } else {
            form.reset({
                gymName: "", address: "", imageUrl: "",
                latitude: 0, longitude: 0, crowdCount: 0,
                waitTime: "", thresholdLow: 20, thresholdModerate: 50,
                thresholdPacked: 80, promotionTags: "", workoutFocusAreas: "",
                trainerOrGuestInfo: "", generalGymNotice: "", offerExpiryDate: undefined,
            });
        }
    }, [gym, form]);

    const handleUseCurrentLocation = () => {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                form.setValue('latitude', position.coords.latitude);
                form.setValue('longitude', position.coords.longitude);
                toast({ title: "Success", description: "Location fetched." });
                setIsGettingLocation(false);
            },
            () => {
                toast({ variant: "destructive", title: "Error", description: "Could not get location." });
                setIsGettingLocation(false);
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{gym ? 'Edit Gym' : 'Add New Gym'}</DialogTitle>
                    <DialogDescription>
                        {gym ? 'Update the details for this gym location.' : 'Add a new location to the MetroGym network.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pr-2">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="text-primary"/>Basic Info</h3>
                            <FormField control={form.control} name="gymName" render={({ field }) => (<FormItem><FormLabel>Gym Name</FormLabel><FormControl><Input placeholder="MetroGym Downtown" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Fitness Ave, Gymtown" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="text-primary"/>Geolocation</h3><Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} disabled={isGettingLocation}>{isGettingLocation ? <Loader2 className="animate-spin" /> : "Use Current Location"}</Button></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="latitude" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" placeholder="34.0522" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="longitude" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" placeholder="-118.2437" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="text-primary"/>Crowd & Capacity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="crowdCount" render={({ field }) => (<FormItem><FormLabel>Current Crowd Count</FormLabel><FormControl><Input type="number" placeholder="55" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="waitTime" render={({ field }) => (<FormItem><FormLabel>Estimated Wait Time</FormLabel><FormControl><Input placeholder="e.g., 5 mins" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <div>
                                <FormLabel>Crowd Status Thresholds</FormLabel><FormDescription>Set member count for each status.</FormDescription>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                    <FormField control={form.control} name="thresholdLow" render={({ field }) => (<FormItem><FormLabel className="text-xs text-green-400">Not Busy</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="thresholdModerate" render={({ field }) => (<FormItem><FormLabel className="text-xs text-yellow-400">Moderate</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="thresholdPacked" render={({ field }) => (<FormItem><FormLabel className="text-xs text-red-400">Packed</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center gap-2"><Tag className="text-primary"/>Promotions</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <FormField control={form.control} name="promotionTags" render={({ field }) => (<FormItem><FormLabel>Promotion Tags</FormLabel><FormControl><Input placeholder="e.g., Free Protein Shake, Referral Bonus" {...field} /></FormControl><FormDescription>Comma-separated.</FormDescription></FormItem>)} />
                                 <FormField control={form.control} name="workoutFocusAreas" render={({ field }) => (<FormItem><FormLabel>Workout Focus Areas</FormLabel><FormControl><Input placeholder="e.g., Cardio, Strength Training, HIIT" {...field} /></FormControl></FormItem>)} />
                                 <FormField control={form.control} name="trainerOrGuestInfo" render={({ field }) => (<FormItem><FormLabel>Trainer or Guest Info</FormLabel><FormControl><Input placeholder="e.g., Session with Coach Sipho" {...field} /></FormControl></FormItem>)} />
                                 <FormField control={form.control} name="offerExpiryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Offer Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<Clock className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)} />
                             </div>
                             <FormField control={form.control} name="generalGymNotice" render={({ field }) => (<FormItem><FormLabel>General Gym Notice</FormLabel><FormControl><Textarea placeholder="e.g., Renovations at Midrand Gym" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}><X className="mr-2"/>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 animate-spin" />}{gym ? 'Save Changes' : 'Add Gym'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function ManageGymsForm() {
    const { toast } = useToast();
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingGym, setEditingGym] = useState<Gym | null>(null);
    const [deletingGym, setDeletingGym] = useState<Gym | null>(null);

    useEffect(() => {
        const gymsCollectionRef = collection(db, 'gyms');
        const unsubscribe = onSnapshot(gymsCollectionRef, (snapshot) => {
            const gymsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gym));
            setGyms(gymsData.sort((a,b) => a.gymName.localeCompare(b.gymName)));
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching gyms:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch gym data.' });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [toast]);

    const handleAddNew = () => {
        setEditingGym(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (gym: Gym) => {
        setEditingGym(gym);
        setIsDialogOpen(true);
    };
    
    const handleDelete = (gym: Gym) => {
        setDeletingGym(gym);
    };

    const handleConfirmDelete = async () => {
        if (!deletingGym) return;
        try {
            await deleteDoc(doc(db, 'gyms', deletingGym.id));
            toast({ title: '✅ Success', description: `${deletingGym.gymName} has been deleted.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete gym.' });
        } finally {
            setDeletingGym(null);
        }
    };
    
    const handleFormSubmit = async (values: GymFormData) => {
        setIsSubmitting(true);
        const dataPayload: Omit<Gym, 'id' | 'createdAt' | 'classSchedule' | 'trainers'> & { offerExpiryDate: Timestamp | null } = {
            ...values,
            offerExpiryDate: values.offerExpiryDate ? Timestamp.fromDate(values.offerExpiryDate) : null,
        };

        try {
            if (editingGym) {
                await updateDoc(doc(db, 'gyms', editingGym.id), dataPayload as any);
                toast({ title: '✅ Gym Updated', description: `${values.gymName} has been updated.` });
            } else {
                const fullPayload = {
                    ...dataPayload,
                    classSchedule: [],
                    trainers: [],
                    createdAt: serverTimestamp()
                };
                await addDoc(collection(db, 'gyms'), fullPayload);
                toast({ title: '✅ Gym Added', description: `${values.gymName} has been added.` });
            }
            setIsDialogOpen(false);
            setEditingGym(null);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save gym details.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Gym Locations</h2>
                    <p className="text-muted-foreground">View, edit, or add new gym locations.</p>
                </div>
                <Button onClick={handleAddNew}><Plus className="mr-2"/> Add New Gym</Button>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
                </div>
            ) : gyms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map(gym => {
                        const crowdStatus = getStatus(gym.crowdCount ?? 0, gym.thresholdLow, gym.thresholdModerate);
                        return (
                            <Card key={gym.id} className="flex flex-col">
                                <CardHeader>
                                    {gym.imageUrl && (
                                    <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg bg-muted">
                                        <Image src={gym.imageUrl} alt={gym.gymName} layout="fill" objectFit="cover" data-ai-hint="gym interior" />
                                    </div>
                                    )}
                                    <CardTitle>{gym.gymName}</CardTitle>
                                    <CardDescription>{gym.address}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                     <div className="flex items-center gap-4 text-sm">
                                        <Badge variant="outline" className={cn('font-semibold', crowdStatus.color)}>{crowdStatus.label}</Badge>
                                        <div className="flex items-center gap-1 text-muted-foreground"><Users className="size-4"/><span>{gym.crowdCount ?? 0} members</span></div>
                                     </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button variant="outline" className="w-full" onClick={() => handleEdit(gym)}><Edit className="mr-2"/>Edit</Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(gym)}><Trash2/></Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 border-dashed border-2 rounded-2xl">
                    <h3 className="text-lg font-semibold">No Gyms Found</h3>
                    <p className="text-muted-foreground">Click "Add New Gym" to get started.</p>
                </div>
            )}
            
            <GymFormDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                gym={editingGym}
            />

            <AlertDialog open={!!deletingGym} onOpenChange={(open) => !open && setDeletingGym(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the "{deletingGym?.gymName}" location. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingGym(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/80 text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

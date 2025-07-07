"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { collection, query, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { locations } from "@/lib/class-schedule";
import { AdminDashboardOverview } from "@/components/admin-dashboard-overview";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CalendarCheck, UserCheck, MessageSquare, Loader2 } from "lucide-react";

type BookingStatus = 'pending' | 'accepted' | 'declined';

interface ClassBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  gymId: string;
  gymName: string;
  classId: string;
  className: string;
  classDay: string;
  classTime: string;
  status: BookingStatus;
  createdAt: Timestamp;
}

const statusVariantMap: Record<BookingStatus, "default" | "secondary" | "destructive"> = {
  pending: "default",
  accepted: "secondary",
  declined: "destructive",
};

const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <Badge variant={statusVariantMap[status]} className="capitalize">
    {status}
  </Badge>
);

function ClassBookingsManager() {
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "classBookings"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ClassBooking));
      setBookings(bookingsData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching class bookings: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch bookings." });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    try {
      const bookingRef = doc(db, "classBookings", id);
      await updateDoc(bookingRef, { status });
      toast({ title: "Success", description: `Booking has been ${status}.` });
    } catch (error) {
      console.error(`Error updating booking ${id} to ${status}:`, error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update booking status." });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => 
      (locationFilter === 'all' || booking.gymId === locationFilter) &&
      (statusFilter === 'all' || booking.status === statusFilter)
    );
  }, [bookings, locationFilter, statusFilter]);
  
  return (
     <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck/>Class Booking Requests</CardTitle>
          <CardDescription>View and manage all class booking requests from members across all locations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex flex-wrap gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
           </div>
           <div className="overflow-x-auto">
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading bookings...</TableCell></TableRow>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.userName}</div>
                          <div className="text-sm text-muted-foreground">{booking.userEmail}</div>
                        </TableCell>
                        <TableCell>{booking.className}</TableCell>
                        <TableCell>{booking.gymName}</TableCell>
                        <TableCell>{booking.classDay}, {booking.classTime}</TableCell>
                        <TableCell><StatusBadge status={booking.status} /></TableCell>
                        <TableCell className="text-right">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id, 'accepted')} disabled={updatingId === booking.id}>
                                {updatingId === booking.id ? <Loader2 className="animate-spin" /> : 'Accept'}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(booking.id, 'declined')} disabled={updatingId === booking.id}>
                                {updatingId === booking.id ? <Loader2 className="animate-spin" /> : 'Decline'}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center">No bookings found for the selected filters.</TableCell></TableRow>
                  )}
                </TableBody>
             </Table>
           </div>
        </CardContent>
      </Card>
  );
}


export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/app');
        }
    }, [user, loading, router]);

    if (loading || user?.role !== 'admin') {
        return (
             <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-muted-foreground">Verifying permissions...</p>
                </div>
             </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
                    <ShieldCheck className="text-primary size-8" />
                    Admin Panel
                </h1>
                <p className="text-muted-foreground">Welcome, Administrator. Manage all gym operations from here.</p>
            </div>
            
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="class-bookings">Class Bookings</TabsTrigger>
                <TabsTrigger value="trainer-bookings">Trainer Bookings</TabsTrigger>
                <TabsTrigger value="chat-moderation">Chat Moderation</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="mt-4">
                 <AdminDashboardOverview />
              </TabsContent>
              <TabsContent value="class-bookings" className="mt-4">
                <ClassBookingsManager />
              </TabsContent>
              <TabsContent value="trainer-bookings" className="mt-4">
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck/>Trainer Booking Requests</CardTitle></CardHeader>
                    <CardContent><p>Trainer booking management interface is coming soon.</p></CardContent>
                 </Card>
              </TabsContent>
              <TabsContent value="chat-moderation" className="mt-4">
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare/>Group Chat Moderation</CardTitle></CardHeader>
                    <CardContent><p>Chat moderation tools are coming soon.</p></CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
        </div>
    );
}

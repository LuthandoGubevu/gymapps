"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/app'); // or show an unauthorized page
        }
    }, [user, loading, router]);

    if (loading || user?.role !== 'admin') {
        return (
             <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-muted-foreground">Verifying permissions...</p>
                </div>
             </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ShieldCheck className="text-primary size-8" />
                    Admin Panel
                </h1>
                <p className="text-muted-foreground">Welcome, Administrator.</p>
            </div>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Overview of the gym's digital infrastructure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>All systems are operational.</p>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage gym members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>User management interface coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}

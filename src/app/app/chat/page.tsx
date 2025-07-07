"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatRedirectPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.primaryGym) {
            router.push(`/app/chat/${user.primaryGym}`);
        }
    }, [user, loading, router]);

    if (loading) {
         return (
             <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-muted-foreground">Redirecting to your gym's chat...</p>
                </div>
             </div>
        );
    }
    
    if (!user?.primaryGym) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Group Chat</h1>
                    <p className="text-muted-foreground">Please complete your profile to access the chat.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Primary Gym Not Set</CardTitle>
                        <CardDescription>
                           You need to set your primary gym location in your profile before you can join a group chat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Please visit your profile page to update your information.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return null;
}

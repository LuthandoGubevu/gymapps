"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Shield, LogOut, Dumbbell, CalendarDays, Users, MessageSquare } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  const hasPrimaryGym = !!user?.primaryGym;

  const menuItems = [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/app/profile", label: "Profile", icon: User, disabled: false },
    { 
      href: hasPrimaryGym ? `/app/classes/${user.primaryGym}` : "/app/classes", 
      label: "Classes", 
      icon: CalendarDays,
      disabled: !hasPrimaryGym,
      tooltip: !hasPrimaryGym ? "Set your primary gym in Profile" : "View Classes"
    },
    { 
      href: hasPrimaryGym ? `/app/trainers/${user.primaryGym}` : "/app/trainers", 
      label: "Trainers", 
      icon: Users,
      disabled: !hasPrimaryGym,
      tooltip: !hasPrimaryGym ? "Set your primary gym in Profile" : "View Trainers"
    },
    { 
      href: hasPrimaryGym ? `/app/chat/${user.primaryGym}` : "/app/chat", 
      label: "Gym Chat", 
      icon: MessageSquare,
      disabled: !hasPrimaryGym,
      tooltip: !hasPrimaryGym ? "Set your primary gym in Profile" : "Join Gym Chat"
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ href: "/app/admin", label: "Admin Panel", icon: Shield, disabled: false });
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Dumbbell className="size-8 text-primary" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">MetroGym</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                isActive={!item.disabled && pathname.startsWith(item.href)}
                onClick={() => !item.disabled && router.push(item.href)}
                tooltip={item.tooltip || item.label}
                disabled={item.disabled}
                aria-disabled={item.disabled}
              >
                  <item.icon />
                  <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col items-start p-2 group-data-[collapsible=icon]:hidden">
                <p className="font-semibold text-sm">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}

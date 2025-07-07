"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, serverTimestamp } from 'firebase/firestore';
import { locations } from '@/lib/class-schedule';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
  };
  text: string;
  timestamp: Timestamp | null;
}

const formatTimestamp = (timestamp: Timestamp | null) => {
  if (!timestamp) return '';
  return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatPage({ params: { location: locationId } }: { params: { location: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const location = locations.find(l => l.id === locationId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect user if they try to access a chat for a different gym
    if (!authLoading && user && user.primaryGym !== locationId) {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You can only access the chat for your primary gym.",
        });
        router.push(`/app/chat/${user.primaryGym}`);
        return;
    }

    if (!location) return;

    const messagesColRef = collection(db, 'chats', location.id, 'messages');
    const q = query(messagesColRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(fetchedMessages);
      setIsFetching(false);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch messages.",
        });
        setIsFetching(false);
    });

    return () => unsubscribe();
  }, [location, toast, authLoading, user, locationId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    setIsLoading(true);
    const messagesColRef = collection(db, 'chats', locationId, 'messages');
    try {
      await addDoc(messagesColRef, {
        text: newMessage,
        sender: {
          id: user.uid,
          name: user.username || user.displayName || 'Anonymous',
        },
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Send Error',
        description: 'Could not send your message. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!user && !location)) {
      return <div>Loading...</div> // Or a proper skeleton loader
  }

  if (!location) {
    notFound();
  }
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] flex-col">
       <div className="mb-4">
        <h1 className="text-3xl font-bold mt-2">MetroGym {location.name} Group Chat</h1>
      </div>

      <Card className="flex flex-1 flex-col shadow-lg">
        <CardContent className="flex flex-1 flex-col p-4 md:p-6">
          <div className="flex-1 space-y-4 overflow-y-auto pr-4">
            {isFetching ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            ) : messages.length > 0 ? (
                messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn('flex items-end gap-2', {
                            'justify-end': msg.sender.id === user?.uid,
                        })}
                        >
                        {msg.sender.id !== user?.uid && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn('max-w-xs rounded-2xl p-3 md:max-w-md', {
                            'bg-primary text-primary-foreground rounded-br-none': msg.sender.id === user?.uid,
                            'bg-muted rounded-bl-none': msg.sender.id !== user?.uid,
                            })}
                        >
                            <p className="text-sm font-bold">{msg.sender.id === user?.uid ? 'You' : msg.sender.name}</p>
                            <p className="text-sm">{msg.text}</p>
                            <p className="mt-1 text-xs opacity-70 text-right">{formatTimestamp(msg.timestamp)}</p>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t pt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || newMessage.trim() === ''}>
              <Send className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

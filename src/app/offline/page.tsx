import { WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <WifiOff className="size-6 text-primary" />
                    You are Offline
                </CardTitle>
                <CardDescription>
                    It seems you've lost your internet connection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Please check your network and try again. Cached content may still be available.
                </p>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

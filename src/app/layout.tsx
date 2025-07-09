
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { BackgroundWrapper } from '@/components/background-wrapper';
import { GymsProvider } from '@/components/gyms-provider';
import { PresenceProvider } from '@/components/presence-provider';

export const metadata: Metadata = {
  title: 'MetroGym Rebuild',
  description: 'Next-generation fitness platform',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FACC15" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <BackgroundWrapper>
            <AuthProvider>
              <GymsProvider>
                <PresenceProvider>
                  {children}
                  <Toaster />
                </PresenceProvider>
              </GymsProvider>
            </AuthProvider>
        </BackgroundWrapper>
      </body>
    </html>
  );
}


import { Logo } from "@/components/logo";
import { InstallPrompt } from "@/components/install-prompt";
import Head from "next/head";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Head>
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex justify-center">
                        <Logo />
                    </div>
                    {children}
                </div>
                <InstallPrompt />
            </main>
        </>
    );
}

import type {Metadata} from 'next';
import { Nunito, Syncopate } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Motorsports Schedule Tracker',
  description: 'Your ultimate guide to the race weekend.',
};

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})
 
const syncopate = Syncopate({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syncopate',
  weight: ['400', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${syncopate.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

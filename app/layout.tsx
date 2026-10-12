import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Task Manager",
  description:
    "Task manager con vista Kanban, matrice di Eisenhower e calendario"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

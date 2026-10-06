import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kivnexo — Complete Tasks. Earn Rewards.",
    template: "%s | Kivnexo",
  },
  description:
    "Kivnexo is a rewards platform where users can discover eligible tasks and offers, complete them, and earn rewards.",
  keywords: [
    "Kivnexo",
    "earn rewards",
    "online tasks",
    "reward platform",
    "earn online",
  ],
  authors: [{ name: "Kivnexo" }],
  creator: "Kivnexo",
  metadataBase: new URL("http://localhost:3000"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
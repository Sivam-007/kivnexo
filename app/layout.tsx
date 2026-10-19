
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
  metadataBase: new URL("https://kivnexo.vercel.app"),
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
  robots: {
    index: true,
    follow: true,
  },
other: {
  "offerzono-verification": "18e84e6ec38a398567f359fd6e2f29b4",
  "offerwall-verification": "6ad638651c3d199193d19f2a",
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8385982240534796"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}


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
  
  applicationName: "Kivnexo",
  appleWebApp: {
    capable: true,
    title: "Kivnexo",
    statusBarStyle: "default",
  },

  robots: {
    index: true,
    follow: true,
  },

    verification: {
    google: "340kURZRr6GlzTJ747K1jQWzUfGJ3xgD1yCoM95aplQ",
  },
    category: "rewards",
other: {
  "offerzono-verification": "18e84e6ec38a398567f359fd6e2f29b4",
  "offerwall-verification": "6ad638651c3d199193d19f2a",
  "clickaine-site-verification":
    "a3380bb9e7c6220f8044d3238214d05b38590eede1250f11ef540092d6a0765046e3a4be818be95b6e0f1ff24c7a1c4349031e64edf4306dc2ba3c1e8d7ccb3d",
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

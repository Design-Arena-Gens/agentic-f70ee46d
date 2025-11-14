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
  title: "Neuro Pulse Survey Studio",
  description:
    "Стильный конструктор опросов с аналитикой и выдачей контента после прохождения",
  metadataBase: new URL("https://agentic-f70ee46d.vercel.app"),
  openGraph: {
    title: "Neuro Pulse Survey Studio",
    description:
      "Стильный конструктор опросов с аналитикой и выдачей контента после прохождения",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="gradient-orb" style={{ top: "8%", left: "10%" }} />
          <div className="gradient-orb orb-2" style={{ bottom: "6%", right: "12%" }} />
          <div className="gradient-orb orb-3" style={{ top: "40%", right: "35%" }} />
          <div className="absolute inset-0 animate-grid opacity-40" />
        </div>
        <div className="noise-overlay" />
        <div className="relative flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}

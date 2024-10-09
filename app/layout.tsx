import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Room } from "./(liveblocks)/Room";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Design Forge",
  description: "A figma clone built with nextjs and liveblocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //todo change the bg and add clerk so certain routes i.e canvas page is protected oh and design a logo too
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono bg-primary-black`}
      >
        <Room>
        {children}
        </Room>
       </body>
    </html>
  );
}

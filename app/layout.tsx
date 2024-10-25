import type { Metadata } from "next";
import { ClerkProvider} from '@clerk/nextjs'
 import "./globals.css";
 import { dark } from "@clerk/themes"

import { Room } from "./(liveblocks)/Room";
 

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
           <head>
  <link rel="icon" href="/design-forge-logo.png"   type="image/svg+xml" />
        </head>

      <body
        className={`antialiased font-mono bg-primary-black`}
      >
<ClerkProvider
appearance={{
  baseTheme:dark,
  variables:{colorPrimary:'#3371FF',
    fontSize:'16px'
  }
}}
>



        <Room>
        {children}
        </Room>
   
   
</ClerkProvider>
       </body>
    </html>
  );
}

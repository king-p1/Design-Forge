"use client";

import { ReactNode } from "react";
 
import { LiveMap } from "@liveblocks/client"


import { ClientSideSuspense } from "@liveblocks/react";

import { RoomProvider } from "@/liveblocks.config";

import Loader from "@/components/Loader";

export function Room({ children }: { children: ReactNode }) {
  return (
     
      <RoomProvider id="my-room"
      initialPresence={{
        cursor:null,cursorColor:null,editingText:null
      }}
      initialStorage={{
        canvasObjects:new LiveMap()
      }}
      >
        <ClientSideSuspense fallback={<Loader/>}>
        {() => children}
         </ClientSideSuspense>
      </RoomProvider>
   );
}
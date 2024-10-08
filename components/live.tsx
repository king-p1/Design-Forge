/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyPresence, useOthers } from "@/liveblocks.config"
import { LiveCursors } from "./liveblocks-cursor/live-cursor"
import { useCallback } from "react"

export const Live = () => {

    const others = useOthers()

    const [{cursor}, updateMyPresence] = useMyPresence() as any


    const handlePointerMove = useCallback((e:React.PointerEvent) =>{
e.preventDefault()

const x = e.clientX - e.currentTarget.getBoundingClientRect().x
const y = e.clientY - e.currentTarget.getBoundingClientRect().y

updateMyPresence({
    cursor: {x,y}
})

    },[])

    const handlePointerLeave = useCallback((e:React.PointerEvent) =>{
e.preventDefault()

updateMyPresence({
    cursor: null , message:null
})

    },[])

    const handlePointerDown = useCallback((e:React.PointerEvent) =>{
 
updateMyPresence({
    cursor: null , message:null
})

    },[])

  return (
    <div
    onPointerMove={handlePointerMove}
    onPointerLeave={handlePointerLeave}
    onPointerDown={handlePointerDown}
    className="flex h-screen justify-center items-center text-center border-2 border-white"
        >
<h1 className="font-lg text-cyan-300">hi</h1>

        <LiveCursors others={others}/>
    </div>
  )
}

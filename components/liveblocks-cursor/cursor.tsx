import CursorSVG from '@/public/assets/CursorSVG'
import React from 'react'

type Props = {
    color:string
    x:string
    y:string
    message?:string
}

export const Cursor = ({color,x,y,message}:Props) => {
  return (
<div className="pointer-events-none absolute top-0 left-0"
style={{
    transform : `translateX(${x}px) translateY(${y}px) `
}}
>

<CursorSVG 
color={color}
/>

{message && (
    <div className=" absolute left-2 top-5 rounded-2xl px-4 py-2"
    style={{
        backgroundColor:color,borderRadius: 20
    }}
    >

    <p className='text-white whitespace-nowrap text-sm leading-relaxed'>{message}</p>
    </div>
)}

</div>
)
}

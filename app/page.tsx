"use client"
import { LeftSideBar } from '@/components/left-sidebar'
import { Live } from '@/components/live'
import { RightSideBar } from '@/components/right-sidebar'
import React, { useEffect, useRef,useState } from 'react'
import   {fabric} from 'fabric'; 
 import { handleCanvasMouseDown, handleResize, initializeFabric } from '@/lib/canvas'
import Navbar from '@/components/navbar'
import { ActiveElement } from '@/types/type'
 const Home = () => {

   console.log(fabric)
 
const canvasRef = useRef<HTMLCanvasElement>(null)
const fabricRef = useRef<fabric.Canvas | null>(null)
const isDrawing = useRef(false)
const shapeRef = useRef<fabric.Object |null>(null)
const selectedShapeRef = useRef<string |null>('circle')

const [activeElement, setActiveElement] = useState<ActiveElement>({
   name:'',value:'',icon:''
})

const handleActiveElement = (elem:ActiveElement) =>{
setActiveElement(elem)

selectedShapeRef.current = elem?.value as string
}


useEffect(()=>{
const canvas = initializeFabric({canvasRef,fabricRef})

canvas.on('mouse:down', (options) => {
   handleCanvasMouseDown({
      options,canvas,isDrawing,shapeRef,selectedShapeRef
   })
})

window.addEventListener('resize',()=>{
   handleResize({fabricRef})
})
},[])


  return (
   <main className='overflow-hidden h-screen' >
<Navbar
activeElement={activeElement}
handleActiveElement={handleActiveElement}
/>

<section className="flex h-full flex-row">
<LeftSideBar/>
<Live canvasRef={canvasRef}/>
<RightSideBar/>
</section>
   </main>
   )
}

export default Home
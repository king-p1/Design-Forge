"use client"
 import { Live } from '@/components/live'
import { RightSideBar } from '@/components/right-sidebar'
import React, { useEffect, useRef,useState } from 'react'
import   {fabric} from 'fabric'; 
 import { handleCanvasMouseMove, handleCanvasMouseDown, handleResize, initializeFabric,handleCanvasMouseUp, renderCanvas, handleCanvasObjectModified } from '@/lib/canvas'
import Navbar from '@/components/navbar'
import { ActiveElement } from '@/types/type'
import { LeftSidebar } from '@/components/left-sidebar';
import { useMutation, useStorage } from '@/liveblocks.config';
 const Home = () => {

const canvasRef = useRef<HTMLCanvasElement>(null)
const fabricRef = useRef<fabric.Canvas | null>(null)
const isDrawing = useRef(false)
const shapeRef = useRef<fabric.Object |null>(null)
const selectedShapeRef = useRef<string |null>('circle')
const activeObjectRef = useRef<fabric.Object |null>(null)

const canvasObjects = useStorage((root)=> root.canvasObjects)

const syncShapeInStorage = useMutation(({storage},object)=>{
if(!object) return

const {objectId} = object
const shapeData = object.toJSON()
shapeData.objectId = objectId

const canvasObjects = storage.get('canvasObjects')

canvasObjects.set(objectId,shapeData)

},[])

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

canvas.on('mouse:move', (options) => {
   handleCanvasMouseMove({
      options,canvas,isDrawing,shapeRef,selectedShapeRef,syncShapeInStorage
   })
})

canvas.on('mouse:up', (options) => {
   handleCanvasMouseUp({
      canvas,isDrawing,shapeRef,selectedShapeRef,syncShapeInStorage,setActiveElement,activeObjectRef
   })
})

canvas.on('object:modified', (options) => {
   handleCanvasObjectModified({
      options,syncShapeInStorage
   })
})

window.addEventListener("resize", () => {
   handleResize({
     canvas: fabricRef.current,
   });
 });


},[])

useEffect(()=>{
renderCanvas({
   fabricRef,canvasObjects,activeObjectRef
})
},[canvasObjects])

  return (
   <main className='overflow-hidden h-screen' >
<Navbar
activeElement={activeElement}
handleActiveElement={handleActiveElement}
/>

<section className="flex h-full flex-row">
<LeftSidebar/>
<Live canvasRef={canvasRef}/>
<RightSideBar/>
</section>
   </main>
   )
}

export default Home
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBroadcastEvent, useEventListener, useMyPresence } from "@/liveblocks.config";
import { LiveCursors } from "./liveblocks-cursor/live-cursor";
import { useCallback, useEffect, useState } from "react";
import { CursorChat } from "./liveblocks-cursor/cursor-chat";
import { CursorMode, CursorState, Reaction } from "@/types/type";
import ReactionSelector from "./liveblocks-reaction/reaction-button";
import FlyingReaction from "./liveblocks-reaction/flying-reaction";
import useInterval from "@/hooks/useInterval";
import { Comments } from "./liveblock-comments/comments";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from "@/constants";


type Props ={
  canvasRef: React.MutableRefObject<HTMLCanvasElement |null>
  undo: ()=> void
  redo: ()=> void
}

export const Live = ({canvasRef,undo,redo}:Props) => {
 
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  
  
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const broadcast = useBroadcastEvent()

  
  const [{ cursor }, updateMyPresence] = useMyPresence() 

 

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    if(cursor === null || cursorState.mode !== CursorMode.ReactionSelector){

      
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
      
      updateMyPresence({
        cursor: { x, y },
      });
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // get the cursor position in the canvas
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });

      // if cursor is in reaction mode, set isPressed to true
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  }, [cursorState.mode, setCursorState]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
         setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

const setReaction = useCallback((reaction:string)=>{
  setCursorState({mode: CursorMode.Reaction, reaction, isPressed:false})
},[])

useInterval(() => {
  setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
}, 1000);

useInterval(()=>{
  if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: cursor.x, y: cursor.y },
          value: cursorState.reaction,
          timestamp: Date.now(),
        },
      ])
    );

    broadcast({
      x:cursor.x,
      y:cursor.y,
      value: cursorState.reaction,

    })
  }
},75)

useEventListener((eventDatum)=>{
  const e = eventDatum.event 

  setReactions((reactions) =>  reactions.concat([
      {
        point: { x: e.x, y: e.y },
        value: e.value,
        timestamp: Date.now(),
      },
    ]))
  
  })
  
  const handleContextMenuClick = useCallback((key:string)=>{
switch(key){
case 'Chat':
setCursorState({
  mode:CursorMode.Chat,
  previousMessage:null,
  message:''
})
break

case 'Reactions':
setCursorState({mode:CursorMode.ReactionSelector})
break

case 'Redo':
redo()
break

case 'Undo':
  undo()
  break


break

default:
  break

}
  },[])

  return (
    <ContextMenu>
  

    <ContextMenuTrigger
    id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyUp={(e)=> e.stopPropagation()} //solves the e character bug
      className="relative flex h-screen flex-1 w-full justify-center items-center "
    >
<canvas
ref={canvasRef}
/>

      {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}


      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
        setReaction={setReaction}
        />
      )}

      <LiveCursors  />

<Comments/>

     </ContextMenuTrigger>
     <ContextMenuContent className="right-menu-content" >
      {shortcuts.map((item)=>(
        // todo fine tune this hover
        <ContextMenuItem key={item.key} onClick={()=>{handleContextMenuClick(item.name)}} className="flex gap-3 hover:bg-primary-grey-200 hover:rounded-md">
          <p> {item.name} </p>
        <p className="text-xs text-primary-grey-400">{item.shortcut}</p>
        
        </ContextMenuItem>
        
      ))}
   
  </ContextMenuContent>
      </ContextMenu>
  );
};

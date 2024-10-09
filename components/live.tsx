/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config";
import { LiveCursors } from "./liveblocks-cursor/live-cursor";
import { useCallback, useEffect, useState } from "react";
import { CursorChat } from "./liveblocks-cursor/cursor-chat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import ReactionSelector from "./liveblocks-reaction/reaction-button";
import FlyingReaction from "./liveblocks-reaction/flying-reaction";
import useInterval from "@/hooks/useInterval";

type Props ={
  canvasRef: React.MutableRefObject<HTMLCanvasElement |null>
}

export const Live = ({canvasRef}:Props) => {
  const others = useOthers();

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  
  
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const broadcast = useBroadcastEvent()

  
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

 

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
  const e = eventDatum.event as ReactionEvent

  setReactions((reactions) =>  reactions.concat([
      {
        point: { x: e.x, y: e.y },
        value: e.value,
        timestamp: Date.now(),
      },
    ]))
  
  })
  

  return (
    <div
    id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="flex h-screen w-full justify-center items-center text-center"
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

      <LiveCursors others={others} />
    </div>
  );
};

import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";
import React from "react";

export const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({message : e.target.value})

    setCursorState({
        mode:CursorMode.Chat,
        previousMessage:null,
        message:e.target.value
    })
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){

        setCursorState({
            mode:CursorMode.Chat,
            previousMessage:cursorState.message,
            message:""
        })
    }else if (e.key === "Escape") {
        setCursorState({
            mode:CursorMode.Hidden
        })
    }
  };

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px) `,
      }}
      onKeyUp={(e)=> e.stopPropagation()} //solves the e character bug
    >
      {cursorState.mode === CursorMode.Chat && (
      <>
        <CursorSVG color="#000" />

        <div className="absolute left-2 top-5 bg-blue-600 px-4 text-sm  py-2 leading-relaxed text-white rounded-2xl">
          {cursorState.previousMessage && (
            <div className="text-sm text-gray-200">
              {cursorState.previousMessage}
            </div>
          )}

          <input
            className="z-10 w-60 bg-transparent text-white placeholder-slate-200 outline-none border-none"
            autoFocus={true}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={cursorState.previousMessage ? '' : 'Enter your message'}
            value={cursorState.message}
            maxLength={55}
/>
        </div>
      </>
        )}  
    </div>
  );
};

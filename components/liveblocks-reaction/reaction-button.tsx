import React from "react";
import {Flame} from 'lucide-react'
type Props = {
  setReaction: (reaction: string) => void;
};


//todo try and see if the reactions will work with svgs

export default function ReactionSelector({ setReaction }: Props) {
  return (
    <div
      className="absolute bottom-64 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2"
     
      onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction={<Flame color="red" />} onSelect={setReaction} />
      <ReactionButton reaction="😍" onSelect={setReaction} />
      <ReactionButton reaction="👀" onSelect={setReaction} />
      <ReactionButton reaction="😱" onSelect={setReaction} />
      <ReactionButton reaction="🙁" onSelect={setReaction} />
    </div>
  );
}

function ReactionButton({
  reaction,
  onSelect,
}: {
  reaction: any ;
  onSelect: (reaction: any) => void;
}) {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onPointerDown={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  );
}
 
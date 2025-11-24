import { ViewTransition } from "react";

import { CheckersPiece as CheckersPieceType } from "@/game/checkers-game";
import { cn } from "@/lib/utils";

export interface CheckersPieceProps {
  piece: CheckersPieceType;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export function CheckersPiece({ piece, onClick }: CheckersPieceProps) {
  return (
    <ViewTransition>
      <div
        className={cn(
          "absolute inset-2 top-[calc(anchor(top)+8px)] right-[calc(anchor(right)+8px)] bottom-[calc(anchor(bottom)+8px)] left-[calc(anchor(left)+8px)] flex cursor-pointer items-center justify-center rounded-full border-2",
          piece.color === "black"
            ? "border-white bg-black hover:bg-yellow-400/20"
            : "border-black bg-white hover:bg-yellow-400/20",
        )}
        onClick={onClick}
        style={{
          positionAnchor: `--pos-${piece.position}`,
        }}
      >
        {piece.isKing && (
          <span className="text-2xl font-bold text-yellow-400 select-none">
            ♔
          </span>
        )}
        <span className="absolute right-1 bottom-1 text-xs text-red-500/50 select-none">
          {piece.id}
        </span>
      </div>
    </ViewTransition>
  );
}

"use client";

import { ViewTransition } from "react";

import { CheckersPiece as CheckersPieceType } from "@/game/checkers-game";
import { cn } from "@/lib/utils";

export interface CheckersPieceProps {
  piece: CheckersPieceType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function CheckersPiece({ piece, onClick }: CheckersPieceProps) {
  return (
    <ViewTransition>
      <button
        className={cn(
          "absolute inset-2 top-[calc(anchor(top)+8px)] right-[calc(anchor(right)+8px)] bottom-[calc(anchor(bottom)+8px)] left-[calc(anchor(left)+8px)] flex cursor-pointer items-center justify-center rounded-full border-2",
          piece.color === "black"
            ? "border-white bg-black shadow-red-500 hover:shadow-2xl"
            : "border-black bg-white hover:border-red-900",
        )}
        onClick={onClick}
        style={{
          positionAnchor: `--pos-${piece.position}`,
        }}
        aria-label={`${piece.color} piece, ${piece.isKing ? "king" : "man"}, id ${piece.id}, position ${piece.position}`}
      >
        {piece.isKing && (
          <span className="text-2xl font-bold text-yellow-400 select-none">
            ♔
          </span>
        )}
      </button>
    </ViewTransition>
  );
}

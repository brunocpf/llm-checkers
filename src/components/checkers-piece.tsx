"use client";

import { ViewTransition } from "react";

import { CheckersPiece as CheckersPieceType } from "@/game/checkers-game";
import { AI_PLAYER_COLOR } from "@/game/state";
import { cn } from "@/lib/utils";

export interface CheckersPieceProps {
  piece: CheckersPieceType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isSelected?: boolean;
  isActivePlayer?: boolean;
}

export function CheckersPiece({
  piece,
  onClick,
  isSelected = false,
  isActivePlayer = false,
}: CheckersPieceProps) {
  return (
    <ViewTransition>
      <button
        className={cn(
          "@container absolute inset-1 top-[calc(anchor(top)+8px)] right-[calc(anchor(right)+8px)] bottom-[calc(anchor(bottom)+8px)] left-[calc(anchor(left)+8px)] aspect-square translate-y-0 scale-100 transform-gpu rounded-full border-2 shadow-lg transition-transform duration-200 ease-out will-change-[transform,box-shadow] focus-visible:outline-none",
          piece.color === "black"
            ? "border-slate-100/70 bg-linear-to-br from-slate-950 via-slate-900 to-slate-700 text-slate-100"
            : "border-amber-700/70 bg-linear-to-br from-amber-50 via-amber-100 to-amber-300 text-amber-900",
          isSelected
            ? "shadow-[0_12px_30px_-10px_var(--color-cyan-300)] ring-4 ring-cyan-300/70"
            : "hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_24px_-12px_var(--color-black)]",
          isActivePlayer && piece.color !== AI_PLAYER_COLOR
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-85",
        )}
        onClick={onClick}
        style={{
          positionAnchor: `--pos-${piece.position}`,
        }}
        disabled={!isActivePlayer || piece.color === AI_PLAYER_COLOR}
        aria-pressed={isSelected}
        aria-label={`${piece.color} piece, ${piece.isKing ? "king" : "man"}, id ${piece.id}, position ${piece.position}`}
      >
        {piece.isKing ? (
          <span className="text-xs font-bold drop-shadow select-none @[30px]:text-2xl">
            ♔
          </span>
        ) : (
          <span className="text-xs font-semibold opacity-70 select-none @[30px]:text-lg">
            ●
          </span>
        )}
      </button>
    </ViewTransition>
  );
}

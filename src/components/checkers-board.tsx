"use client";

import { useState } from "react";

import { CheckersPiece } from "@/components/checkers-piece";
import { useCheckersGame } from "@/context/checkers-game-context";
import { cn } from "@/lib/utils";

export function CheckersBoard() {
  const { rows, columns, pieces, movePiece, getValidMoves } = useCheckersGame();
  const [selectedPieceId, setSelectedPieceId] = useState<number>();
  const highlightedPositions = selectedPieceId
    ? getValidMoves(selectedPieceId)
    : [];

  return (
    <>
      <div
        className="grid h-full w-full grid-cols-[repeat(var(--checkers-columns,1),minmax(0,1fr))] grid-rows-[repeat(var(--checkers-rows,1),minmax(0,1fr))] gap-0.5 bg-black p-0.5"
        style={{
          ["--checkers-rows" as keyof React.CSSProperties]: rows,
          ["--checkers-columns" as keyof React.CSSProperties]: columns,
        }}
      >
        {[...Array(rows * columns).keys()].map((index) => {
          const row = Math.floor(index / columns);
          const col = index % columns;
          const isDarkSquare = (row + col) % 2 === 1;
          const squarePosition = isDarkSquare
            ? Math.floor(index / 2) + 1
            : null;

          return (
            <div
              key={index}
              className={cn(
                "relative border-2 border-gray-200 hover:bg-yellow-400/20",
                isDarkSquare ? "bg-gray-800" : "bg-gray-200",
                highlightedPositions
                  .map((pos) => pos.to)
                  .includes(squarePosition || -1) && "bg-yellow-400/40",
              )}
              style={{
                anchorName: squarePosition
                  ? `--pos-${squarePosition}`
                  : undefined,
              }}
              onClick={() => {
                if (!squarePosition) return;
                if (selectedPieceId) {
                  movePiece(selectedPieceId, squarePosition);
                  setSelectedPieceId(undefined);
                }
              }}
            >
              <span className="absolute top-1 left-1 text-xs text-white/50 select-none">
                {squarePosition}
              </span>
            </div>
          );
        })}
      </div>
      {pieces.map((piece) => (
        <CheckersPiece
          piece={piece}
          key={piece.id}
          onClick={() => setSelectedPieceId(piece.id)}
        />
      ))}
    </>
  );
}

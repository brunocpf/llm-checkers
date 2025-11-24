"use client";

import { useState } from "react";

import { useCheckersGame } from "@/context/checkers-game-context";
import { getValidMoves } from "@/game/logic";
import { CheckersPieceId } from "@/game/types";
import { cn } from "@/lib/utils";

export default function CheckersBoard() {
  const { rows, columns, board, movePiece } = useCheckersGame();
  const [selectedPieceId, setSelectedPieceId] = useState<CheckersPieceId>();
  const pieces = Object.values(board);
  const highlightedPositions = selectedPieceId
    ? getValidMoves(selectedPieceId, board, rows, columns)
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
                  .map((pos) => pos.targetPosition)
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
        <div
          key={piece.id}
          className={cn(
            "absolute inset-2 top-[calc(anchor(top)+8px)] right-[calc(anchor(right)+8px)] bottom-[calc(anchor(bottom)+8px)] left-[calc(anchor(left)+8px)] flex cursor-pointer items-center justify-center rounded-full border-2 transition-all",
            piece.color === "black"
              ? "border-white bg-black hover:bg-yellow-400/20"
              : "border-black bg-white hover:bg-yellow-400/20",
          )}
          onClick={() => {
            setSelectedPieceId(piece.id);
          }}
          style={{
            positionAnchor: `--pos-${piece.position}`,
          }}
        >
          {piece.isKing && (
            <span className="text-2xl font-bold text-yellow-400 select-none">
              ♔
            </span>
          )}
        </div>
      ))}
    </>
  );
}

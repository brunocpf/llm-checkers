"use client";

import { useState } from "react";

import { CheckersPiece } from "@/components/checkers-piece";
import { useCheckersGame } from "@/context/checkers-game-context";
import { cn } from "@/lib/utils";

export function CheckersBoard() {
  const { rows, columns, pieces, currentPlayer, movePiece, getValidMoves } =
    useCheckersGame();

  const [selectedPieceId, setSelectedPieceId] = useState<number>();
  const highlightedPositions = selectedPieceId
    ? getValidMoves(selectedPieceId)
    : [];
  const selectedPiecePosition = pieces.find(
    (piece) => piece.id === selectedPieceId,
  )?.position;

  return (
    <div className="aspect-square w-full max-w-120 min-w-80">
      <div
        className="grid h-full w-full grid-cols-[repeat(var(--checkers-columns,1),minmax(0,1fr))] grid-rows-[repeat(var(--checkers-rows,1),minmax(0,1fr))] gap-1 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-1 shadow-2xl shadow-black/50"
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
          const highlight = highlightedPositions.find(
            (pos) => pos.to === squarePosition,
          );

          return (
            <div
              key={index}
              className={cn(
                "relative rounded-md border transition-colors duration-150",
                isDarkSquare
                  ? "border-slate-800 bg-linear-to-br from-slate-700 to-slate-800"
                  : "border-slate-300/40 bg-linear-to-br from-slate-200 to-slate-100",
                squarePosition &&
                  selectedPiecePosition === squarePosition &&
                  "ring-2 ring-cyan-300/80",
                highlight &&
                  (highlight.isCapture
                    ? "shadow-inner ring-4 shadow-rose-900/30 ring-rose-400/70"
                    : "ring-2 ring-amber-300/80"),
                highlight &&
                  "after:absolute after:inset-2 after:rounded-md after:bg-amber-200/20 after:content-['']",
              )}
              style={{
                anchorName: squarePosition
                  ? `--pos-${squarePosition}`
                  : undefined,
              }}
              onClick={() => {
                if (!squarePosition) return;
                if (selectedPieceId && highlight) {
                  movePiece(selectedPieceId, squarePosition);
                  setSelectedPieceId(undefined);
                }
              }}
            >
              <span className="pointer-events-none absolute top-1 left-1 text-[10px] font-semibold text-white/40 select-none">
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
          isSelected={piece.id === selectedPieceId}
          isActivePlayer={currentPlayer === piece.color}
          onClick={() => {
            if (currentPlayer !== piece.color) return;
            setSelectedPieceId(piece.id);
          }}
        />
      ))}
    </div>
  );
}

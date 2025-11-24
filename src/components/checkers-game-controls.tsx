"use client";

import { useState } from "react";

import { useCheckersGame } from "@/context/checkers-game-context";
import { decideMove } from "@/server-functions/ai";

export default function CheckersGameControls() {
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const {
    status,
    currentPlayer,
    captured,
    startGame,
    movePiece,
    getState,
    getGameResult,
  } = useCheckersGame({
    onTurnStart: (currentPlayer) => {
      const result = getGameResult();

      if (result && status === "in-progress") {
        switch (result) {
          case "draw":
            alert("The game ended in a draw!");
            break;
          case "winner:black":
            alert("Black wins!");
            break;
          case "winner:white":
            alert("White wins!");
            break;
        }

        startGame();
        return;
      }

      if (currentPlayer === "black") return;
      setAiIsThinking(true);
      decideMove(getState()).then((move) => {
        if (move) {
          const { pieceId, to } = move;
          movePiece(pieceId, to);
        }
        setAiIsThinking(false);
      });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-950/90 via-slate-900/70 to-slate-900/40 p-4 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs tracking-[0.15em] text-slate-400 uppercase select-none">
            Status
          </span>
          <span className="text-base font-semibold">
            {status === "idle" && "Waiting to start"}
            {status === "in-progress" && "Game in progress"}
          </span>
        </div>
        <button
          className="cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-lime-400 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition-[transform,translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-lime-400/50 active:translate-y-0"
          onClick={() => startGame(8, 8)}
        >
          Start New Game
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 shadow-inner shadow-black/30">
          <div className="text-xs tracking-widest text-slate-400 uppercase">
            Current Player
          </div>
          <div className="mt-1 inline-flex items-center gap-3 text-lg font-semibold">
            {status === "idle" ? (
              "-"
            ) : currentPlayer === "black" ? (
              <>
                <span className="h-3 w-3 rounded-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-700 text-slate-100 ring-2 ring-slate-100/70" />
                Black
              </>
            ) : (
              <>
                <span className="h-3 w-3 rounded-full bg-linear-to-br from-amber-50 via-amber-100 to-amber-300 text-amber-900 ring-2 ring-amber-700/70" />
                White
              </>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 shadow-inner shadow-black/30 sm:col-span-1">
          <div className="text-xs tracking-widest text-slate-400 uppercase select-none">
            Captured Pieces
          </div>
          <div className="mt-2 flex items-center gap-3 font-mono text-sm font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">
              <span className="h-3 w-3 rounded-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-700 text-slate-100 ring-2 ring-slate-100/70" />
              Black: {status === "idle" ? "-" : captured.black.length}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">
              <span className="h-3 w-3 rounded-full bg-linear-to-br from-amber-50 via-amber-100 to-amber-300 text-amber-900 ring-2 ring-amber-700/70" />
              White: {status === "idle" ? "-" : captured.white.length}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 text-sm text-slate-200 shadow-inner shadow-black/30">
        {aiIsThinking
          ? "AI is evaluating the board…"
          : status !== "idle"
            ? "Select a piece to see valid moves."
            : 'Press "Start New Game" to begin a new match.'}
      </div>
    </div>
  );
}

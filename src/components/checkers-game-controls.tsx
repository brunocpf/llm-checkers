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
    <div className="flex flex-col items-center justify-center py-2">
      <div className="mb-4 flex justify-center">
        <button
          className="cursor-pointer rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 active:bg-green-800"
          onClick={() => startGame(8, 8)}
        >
          Start New Game
        </button>
      </div>

      {status === "idle" ? (
        <p className="my-4 text-lg">Game is not started.</p>
      ) : status === "in-progress" ? (
        <p className="my-4 text-lg">
          {currentPlayer === "black" && "Current Player: Black"}
          {currentPlayer === "white" && "Current Player: White"}
        </p>
      ) : null}

      <p className="my-4 text-lg">
        {aiIsThinking
          ? "AI is thinking..."
          : status !== "idle"
            ? "Make a move"
            : "-"}
      </p>

      <p className="text-lg">
        Black: {status === "idle" ? "-" : captured.black.length} | White:{" "}
        {status === "idle" ? "-" : captured.white.length}
      </p>
    </div>
  );
}

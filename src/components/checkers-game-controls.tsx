"use client";

import { useCheckersGame } from "@/context/checkers-game-context";

export default function CheckersGameControls() {
  const { status, currentPlayer, captured, startGame } = useCheckersGame();

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

      <p className="text-lg">
        Black: {captured.black.length} | White: {captured.white.length}
      </p>
    </div>
  );
}

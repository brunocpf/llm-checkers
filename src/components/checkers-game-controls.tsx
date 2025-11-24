"use client";

import { useCheckersGame } from "@/context/checkers-game-context";

export default function CheckersGameControls() {
  const {
    startNewGame,
    currentPlayer,
    capturedPieces: score,
  } = useCheckersGame();

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="mb-4 flex justify-center">
        <button
          className="cursor-pointer rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 active:bg-green-800"
          onClick={startNewGame}
        >
          Start New Game
        </button>
      </div>

      <p className="my-4 text-lg">
        {currentPlayer === "none" && "Click Start New Game to begin."}
        {currentPlayer === "black" && "Current Player: Black"}
        {currentPlayer === "white" && "Current Player: White"}
      </p>

      <p className="text-lg">
        Black: {score.black.length} | White: {score.white.length}
      </p>
    </div>
  );
}

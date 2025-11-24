import { CheckersBoard } from "@/components/checkers-board";
import { CheckersGameProvider } from "@/context/checkers-game-context";

import CheckersGameControls from "./checkers-game-controls";

export function CheckersGame() {
  return (
    <CheckersGameProvider>
      <div className="grid w-full place-items-center p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">Checkers Game</h1>
        <CheckersGameControls />
        <div className="aspect-square w-full max-w-120 min-w-80">
          <CheckersBoard />
        </div>
      </div>
    </CheckersGameProvider>
  );
}

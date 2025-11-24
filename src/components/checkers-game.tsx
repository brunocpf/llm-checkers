import { CheckersBoard } from "@/components/checkers-board";
import { CheckersGameProvider } from "@/context/checkers-game-context";

import CheckersGameControls from "./checkers-game-controls";

export function CheckersGame() {
  return (
    <CheckersGameProvider>
      <div className="grid w-full place-items-center gap-4 p-4">
        <CheckersGameControls />
        <CheckersBoard />
      </div>
    </CheckersGameProvider>
  );
}

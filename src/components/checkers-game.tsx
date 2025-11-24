import CheckersBoard from "@/components/checkers-board";
import { CheckersGameProvider } from "@/context/checkers-game-context";

import CheckersGameControls from "./checkers-game-controls";

export default function CheckersGame() {
  return (
    <CheckersGameProvider>
      <div>
        <h1 className="mb-4 text-center text-2xl font-bold">Checkers Game</h1>
        <CheckersGameControls />
        <div className="aspect-square w-120">
          <CheckersBoard />
        </div>
      </div>
    </CheckersGameProvider>
  );
}

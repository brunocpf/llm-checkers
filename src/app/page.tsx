import { CheckersGame } from "@/components/checkers-game";

export default function Home() {
  return (
    <div className="grid h-screen place-items-center">
      <CheckersGame />
    </div>
  );
}

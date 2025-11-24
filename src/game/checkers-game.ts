export type CheckersGameStatus = "idle" | "in-progress" | "finished";

export type CheckersPlayerColor = "black" | "white";

export type CheckersPiece = {
  id: number;
  color: CheckersPlayerColor;
  isKing: boolean;
  position: number;
};

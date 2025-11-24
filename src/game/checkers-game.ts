export type CheckersGameStatus = "idle" | "in-progress" | "finished";

export type CheckersPlayerColor = "black" | "white";

export type CheckersPiece = {
  id: number;
  color: CheckersPlayerColor;
  isKing: boolean;
  position: number;
};

export type CheckersMove = {
  pieceId: number;
  to: number;
  isPromotion: boolean;
  isCapture: boolean;
  canCaptureAgain: boolean;
};

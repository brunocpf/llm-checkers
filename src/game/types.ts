export type CheckersPlayerColor = "black" | "white";

export type CheckersPieceId = `${"b" | "w"}${number}`;

type CheckersPieceBase = {
  id: CheckersPieceId;
  isKing: boolean;
  position: number;
};

type WhiteCheckersPiece = CheckersPieceBase & {
  id: `w${number}`;
  color: "white";
};

type BlackCheckersPiece = CheckersPieceBase & {
  id: `b${number}`;
  color: "black";
};

export type CheckersPiece = WhiteCheckersPiece | BlackCheckersPiece;

export interface CheckersBoard {
  [key: CheckersPieceId]: CheckersPiece;
}

export type MoveResultBase = {
  sourcePosition: number;
  targetPosition: number;
};

export type ValidMoveProps = {
  isPromotion: boolean;
} & ({ type: "move" } | { type: "capture"; capturePieceId: CheckersPieceId });

export type MoveResult = MoveResultBase &
  (ValidMoveProps | { type: "invalid" });

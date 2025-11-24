import { Bitboard, BitboardPiece } from "@/game/bitboard";
import {
  CheckersGameStatus,
  CheckersPlayerColor,
} from "@/game/checkers-game";

export type CheckersGameState = Readonly<{
  status: CheckersGameStatus;
  rows: number;
  columns: number;
  board: Bitboard;
  currentPlayer: CheckersPlayerColor;
  captured: Record<CheckersPlayerColor, BitboardPiece[]>;
}>;

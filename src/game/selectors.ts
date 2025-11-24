import { decodePiece, findPieceById, getValidMoves } from "@/game/bitboard";
import { CheckersPiece } from "@/game/checkers-game";
import { CheckersGameState } from "@/game/state";

export function selectPieces(state: CheckersGameState): CheckersPiece[] {
  const pieces = [...state.board]
    .map((value, index) => {
      const decoded = decodePiece(value);

      return {
        id: decoded.id,
        color: decoded.color,
        isKing: decoded.isKing,
        position: index,
      };
    })
    .filter((piece) => piece.id !== 0)
    .sort((a, b) => a.id - b.id);
  return pieces;
}

export function selectValidMoves(
  state: CheckersGameState,
  pieceId: number,
): { to: number; isCapture: boolean; isPromotion: boolean }[] {
  const piece = findPieceById(state.board, pieceId);

  if (!piece) {
    return [];
  }

  const validMoves = getValidMoves(
    state.board,
    piece,
    state.rows,
    state.columns,
  );

  return validMoves.map((move) => ({
    to: move.to,
    isCapture: move.isValid && move.isCapture,
    isPromotion: move.isValid && move.isPromotion,
  }));
}

export function selectCapturedPieces(state: CheckersGameState): {
  black: CheckersPiece[];
  white: CheckersPiece[];
} {
  const capturedPieces = {
    black: [] as CheckersPiece[],
    white: [] as CheckersPiece[],
  };

  for (const pieceValue of state.captured.black) {
    const decoded = decodePiece(pieceValue);
    capturedPieces.black.push({
      id: decoded.id,
      color: decoded.color,
      isKing: decoded.isKing,
      position: -1,
    });
  }

  for (const pieceValue of state.captured.white) {
    const decoded = decodePiece(pieceValue);
    capturedPieces.white.push({
      id: decoded.id,
      color: decoded.color,
      isKing: decoded.isKing,
      position: -1,
    });
  }

  return capturedPieces;
}

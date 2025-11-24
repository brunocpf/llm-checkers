import { CheckersGameAction } from "@/game/actions";
import {
  captureAndMovePiece,
  createEmptyBitboard,
  createInitialBitboard,
  decodePiece,
  findPieceById,
  movePiece,
  validateMove,
} from "@/game/bitboard";
import { CheckersPlayerColor } from "@/game/checkers-game";
import { CheckersGameState } from "@/game/state";

export const initialState: CheckersGameState = {
  status: "idle",
  rows: 8,
  columns: 8,
  board: createEmptyBitboard(8, 8),
  currentPlayer: "black",
  captured: {
    black: [],
    white: [],
  },
};

export function reducer(
  state: CheckersGameState,
  action: CheckersGameAction,
): CheckersGameState {
  switch (action.type) {
    case "start": {
      const rows = action.rows ?? state.rows;
      const columns = action.columns ?? state.columns;
      const board = createInitialBitboard(rows, columns);

      return {
        status: "in-progress",
        rows,
        columns,
        board,
        currentPlayer: "black",
        captured: {
          black: [],
          white: [],
        },
      };
    }
    case "move": {
      if (state.status !== "in-progress") {
        return state;
      }

      const piece = findPieceById(state.board, action.pieceId);

      if (!piece) {
        return state;
      }

      const move = validateMove(
        state.board,
        piece,
        action.to,
        state.rows,
        state.columns,
      );

      if (!move.isValid) {
        return state;
      }

      const newBoard = move.isCapture
        ? captureAndMovePiece(
            state.board,
            piece,
            action.to,
            move.capture,
            move.isPromotion,
          )
        : movePiece(state.board, piece, action.to, move.isPromotion);

      const nextPlayer: CheckersPlayerColor =
        state.currentPlayer === "black" ? "white" : "black";
      const decodedPiece = decodePiece(piece);

      const newCaptured = {
        ...state.captured,
        [decodedPiece.color]: [
          ...state.captured[decodedPiece.color],
          ...(move.isCapture ? [move.capture] : []),
        ],
      };

      const newState = {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        captured: newCaptured,
      };

      return newState;
    }
    case "reset": {
      return initialState;
    }
  }
}

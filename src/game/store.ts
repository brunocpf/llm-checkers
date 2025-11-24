import { CheckersGameAction } from "@/game/actions";
import {
  captureAndMovePiece,
  createEmptyBitboard,
  createInitialBitboard,
  decodePiece,
  findPieceById,
  getValidMoves,
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
  boardHistory: [],
  moveHistory: [],
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
        boardHistory: [board],
        moveHistory: [],
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

      const decodedPiece = decodePiece(piece);

      if (state.currentPlayer !== decodedPiece.color) {
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

      const previousMove = state.moveHistory[state.moveHistory.length - 1];

      if (
        previousMove?.canCaptureAgain &&
        previousMove.pieceId !== decodedPiece.id &&
        !move.isCapture
      ) {
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

      const canCaptureAgain = move.isCapture
        ? getValidMoves(newBoard, piece, state.rows, state.columns).some(
            (m) => m.isValid && m.isCapture,
          )
        : false;

      const nextPlayer: CheckersPlayerColor = canCaptureAgain
        ? state.currentPlayer
        : state.currentPlayer === "black"
          ? "white"
          : "black";

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
        boardHistory: [...state.boardHistory, newBoard],
        moveHistory: [
          ...state.moveHistory,
          {
            pieceId: action.pieceId,
            to: action.to,
            isPromotion: move.isPromotion,
            isCapture: move.isCapture,
            canCaptureAgain,
          },
        ],
      };

      return newState;
    }
    case "reset": {
      return initialState;
    }
  }
}

"use client";

import {
  createContext,
  startTransition,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
} from "react";

import {
  CheckersGameStatus,
  CheckersPiece,
  CheckersPlayerColor,
} from "@/game/checkers-game";
import {
  selectCapturedPieces,
  selectGameResult,
  selectPieces,
  selectValidMoves,
} from "@/game/selectors";
import { CheckersGameState } from "@/game/state";
import { initialState, reducer } from "@/game/store";

export interface CheckersGameContextType {
  rows: number;
  columns: number;
  status: CheckersGameStatus;
  currentPlayer: CheckersPlayerColor;
  pieces: CheckersPiece[];
  captured: {
    black: CheckersPiece[];
    white: CheckersPiece[];
  };
  startGame: (rows?: number, columns?: number) => void;
  movePiece: (pieceId: number, to: number) => void;
  resetGame: () => void;
  getValidMoves: (
    pieceId: number,
  ) => { to: number; isCapture: boolean; isPromotion: boolean }[];
  getGameResult: () => `winner:${CheckersPlayerColor}` | "draw" | null;
  getState: () => CheckersGameState;
}

export const CheckersGameContext = createContext<CheckersGameContextType>({
  rows: 8,
  columns: 8,
  status: "idle",
  pieces: [],
  currentPlayer: "black",
  captured: {
    black: [],
    white: [],
  },
  startGame: () => {},
  movePiece: () => {},
  resetGame: () => {},
  getValidMoves: () => [],
  getGameResult: () => null,
  getState: () => initialState,
});

export function CheckersGameProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const pieces = useMemo(() => selectPieces(state), [state]);
  const captured = useMemo(() => selectCapturedPieces(state), [state]);

  const startGame = useCallback(
    (rows?: number, columns?: number) => {
      startTransition(() => {
        dispatch({ type: "start", rows, columns });
      });
    },
    [dispatch],
  );

  const movePiece = useCallback(
    (pieceId: number, to: number) => {
      startTransition(() => {
        dispatch({ type: "move", pieceId, to });
      });
    },
    [dispatch],
  );

  const resetGame = useCallback(() => {
    startTransition(() => {
      dispatch({ type: "reset" });
    });
  }, [dispatch]);

  const getValidMoves = useCallback(
    (pieceId: number) => selectValidMoves(state, pieceId),
    [state],
  );

  const getGameResult = useCallback(() => selectGameResult(state), [state]);

  const getState = useCallback(() => state, [state]);

  return (
    <CheckersGameContext.Provider
      value={{
        rows: state.rows,
        columns: state.columns,
        status: state.status,
        currentPlayer: state.currentPlayer,
        captured,
        pieces,
        startGame,
        movePiece,
        resetGame,
        getValidMoves,
        getGameResult,
        getState,
      }}
    >
      {children}
    </CheckersGameContext.Provider>
  );
}

export interface UseCheckersGameOptions {
  onTurnStart?: (player: CheckersPlayerColor) => void;
}

export const useCheckersGame = (options?: UseCheckersGameOptions) => {
  const context = use(CheckersGameContext);
  const { onTurnStart } = options || {};

  const onTurnStartEvent = useEffectEvent((player: CheckersPlayerColor) =>
    onTurnStart?.(player),
  );

  useEffect(() => {
    onTurnStartEvent(context.currentPlayer);
  }, [context.currentPlayer]);

  return context;
};

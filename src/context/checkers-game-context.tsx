"use client";

import { createContext, use, useState } from "react";

import { findPieceById, validateMove } from "@/game/logic";
import {
  CheckersBoard,
  CheckersPiece,
  CheckersPieceId,
  CheckersPlayerColor,
  MoveResult,
} from "@/game/types";

export interface CheckersGameContextType {
  rows: number;
  columns: number;
  board: CheckersBoard;
  currentPlayer: CheckersPlayerColor | "none";
  capturedPieces: { [key in CheckersPlayerColor]: CheckersPieceId[] };
  startNewGame: () => void;
  movePiece: (pieceId: CheckersPieceId, targetPosition: number) => MoveResult;
}

export const CheckersGameContext = createContext<CheckersGameContextType>({
  rows: 8,
  columns: 8,
  board: {},
  currentPlayer: "none",
  capturedPieces: { black: [], white: [] },
  startNewGame: () => {},
  movePiece: () => ({
    sourcePosition: -1,
    targetPosition: -1,
    type: "invalid",
  }),
});

export function CheckersGameProvider({ children }: React.PropsWithChildren) {
  const [board, setBoard] = useState<CheckersBoard>({});
  const [currentPlayer, setCurrentPlayer] = useState<
    CheckersPlayerColor | "none"
  >("none");
  const [rows] = useState(8);
  const [columns] = useState(8);
  const [capturedPieces] = useState<{
    [key in CheckersPlayerColor]: CheckersPieceId[];
  }>({
    black: [],
    white: [],
  });

  function startNewGame() {
    const board: { [key: CheckersPieceId]: CheckersPiece } = {};
    const numberOfPiecesPerPlayer = (rows / 2 - 1) * (columns / 2);

    const initialPositions = {
      black: [...Array(numberOfPiecesPerPlayer).keys()].map((i) => i + 1),
      white: [...Array(numberOfPiecesPerPlayer).keys()].map(
        (i) => (rows * columns) / 2 - i,
      ),
    };

    for (let i = 0; i < numberOfPiecesPerPlayer; i++) {
      board[`b${i + 1}`] = {
        id: `b${i + 1}`,
        color: "black",
        isKing: false,
        position: initialPositions.black[i],
      };

      board[`w${i + 1}`] = {
        id: `w${i + 1}`,
        color: "white",
        isKing: false,
        position: initialPositions.white[i],
      };
    }

    setBoard(board);
    setCurrentPlayer("black");
  }

  function movePiece(
    pieceId: CheckersPieceId,
    targetPosition: number,
  ): MoveResult {
    const moveResult = validateMove(
      pieceId,
      targetPosition,
      board,
      rows,
      columns,
    );

    const canMove = moveResult.type !== "invalid";

    if (canMove) {
      setBoard((prevBoard) => ({
        ...prevBoard,
        [pieceId]: { ...prevBoard[pieceId], position: targetPosition },
      }));

      if (moveResult.type === "capture") {
        const capturedPiece = findPieceById(board, moveResult.capturePieceId);
        if (capturedPiece) {
          setBoard((prevBoard) => {
            const newBoard = { ...prevBoard };
            delete newBoard[moveResult.capturePieceId];
            return newBoard;
          });
          capturedPieces[currentPlayer as CheckersPlayerColor].push(
            moveResult.capturePieceId,
          );
        }
      }

      if (moveResult.isPromotion) {
        setBoard((prevBoard) => ({
          ...prevBoard,
          [pieceId]: {
            ...prevBoard[pieceId],
            isKing: true,
          },
        }));
      }

      setCurrentPlayer((prevPlayer) =>
        prevPlayer === "black" ? "white" : "black",
      );
    }

    return moveResult;
  }

  return (
    <CheckersGameContext.Provider
      value={{
        rows,
        columns,
        board,
        currentPlayer,
        capturedPieces,
        startNewGame,
        movePiece,
      }}
    >
      {children}
    </CheckersGameContext.Provider>
  );
}

export const useCheckersGame = () => use(CheckersGameContext);

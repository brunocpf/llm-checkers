import { CheckersBoard, CheckersPieceId, MoveResult } from "@/game/types";

export function getPlayableSquaresPerRow(columns: number) {
  return Math.floor(columns / 2);
}

export function getTotalPlayableSquares(rows: number, columns: number) {
  return getPlayableSquaresPerRow(columns) * rows;
}

export function getRowNumber(position: number, columns: number) {
  return Math.floor((position - 1) / getPlayableSquaresPerRow(columns)) + 1;
}

export function getPlayableSquareCoordinates(
  position: number,
  columns: number,
) {
  const playableSquaresPerRow = getPlayableSquaresPerRow(columns);
  const row = getRowNumber(position, columns);
  const positionInRow = (position - 1) % playableSquaresPerRow;
  const col = row % 2 === 1 ? 2 * (positionInRow + 1) : 2 * positionInRow + 1;

  return { row, col };
}

export function getPositionFromCoordinates(
  row: number,
  col: number,
  rows: number,
  columns: number,
) {
  if (
    row < 1 ||
    row > rows ||
    col < 1 ||
    col > columns ||
    (row + col) % 2 === 0
  ) {
    return null;
  }

  const playableSquaresPerRow = getPlayableSquaresPerRow(columns);
  const positionInRow =
    row % 2 === 1 ? Math.floor(col / 2) - 1 : Math.floor((col - 1) / 2);

  return (row - 1) * playableSquaresPerRow + positionInRow + 1;
}

export function getAdjacentPositions(
  position: number,
  rows: number,
  columns: number,
) {
  const adjacentPositions = new Set<number>();
  const playableSquaresPerRow = getPlayableSquaresPerRow(columns);
  const totalPlayableSquares = getTotalPlayableSquares(rows, columns);
  const row = getRowNumber(position, columns);
  const positionInRow = (position - 1) % playableSquaresPerRow;
  const col = row % 2 === 1 ? 2 * (positionInRow + 1) : 2 * positionInRow + 1;

  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ] as const;

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow < 1 ||
      newRow > rows ||
      newCol < 1 ||
      newCol > columns ||
      (newRow + newCol) % 2 === 0
    ) {
      continue;
    }

    const newPositionInRow =
      newRow % 2 === 1
        ? Math.floor(newCol / 2) - 1
        : Math.floor((newCol - 1) / 2);
    const newPosition =
      (newRow - 1) * playableSquaresPerRow + newPositionInRow + 1;

    if (newPosition >= 1 && newPosition <= totalPlayableSquares) {
      adjacentPositions.add(newPosition);
    }
  }

  return adjacentPositions;
}

export function findPieceById(board: CheckersBoard, id: CheckersPieceId) {
  if (!(id in board)) {
    return undefined;
  }

  return board[id];
}

export function findPieceByPosition(board: CheckersBoard, position: number) {
  return Object.values(board).find((piece) => piece.position === position);
}

export function isPromotionMove(
  pieceId: CheckersPieceId,
  targetPosition: number,
  board: CheckersBoard,
  rows: number,
  columns: number,
) {
  const piece = findPieceById(board, pieceId);

  if (!piece) {
    return false;
  }

  const targetRow = getRowNumber(targetPosition, columns);

  if (piece.color === "black" && targetRow === rows) {
    return true;
  }

  if (piece.color === "white" && targetRow === 1) {
    return true;
  }

  return false;
}

export function getAdjacentPositionsForPiece(
  pieceId: CheckersPieceId,
  board: CheckersBoard,
  rows: number,
  columns: number,
) {
  const piece = findPieceById(board, pieceId);

  if (!piece) {
    return new Set<number>();
  }

  const directions = piece.color === "black" ? [1] : [-1];

  if (piece.isKing) {
    directions.push(-directions[0]);
  }

  const adjacentPositions = getAdjacentPositions(piece.position, rows, columns);

  return new Set(
    Array.from(adjacentPositions).filter((pos) => {
      const rowDiff =
        getRowNumber(pos, columns) - getRowNumber(piece.position, columns);
      return directions.includes(rowDiff);
    }),
  );
}

export function getValidMoves(
  pieceId: CheckersPieceId,
  board: CheckersBoard,
  rows: number,
  columns: number,
): MoveResult[] {
  const piece = findPieceById(board, pieceId);

  if (!piece) {
    return [];
  }

  const validMoves: MoveResult[] = [];
  const pieceCoords = getPlayableSquareCoordinates(piece.position, columns);

  const adjacentPositionsForPiece = getAdjacentPositionsForPiece(
    pieceId,
    board,
    rows,
    columns,
  );

  for (const targetPosition of adjacentPositionsForPiece) {
    const occupiedPiece = findPieceByPosition(board, targetPosition);
    if (!occupiedPiece) {
      validMoves.push({
        sourcePosition: piece.position,
        targetPosition,
        type: "move",
        isPromotion: isPromotionMove(
          pieceId,
          targetPosition,
          board,
          rows,
          columns,
        ),
      });
    } else if (occupiedPiece.color !== piece.color) {
      const adjacentCoords = getPlayableSquareCoordinates(
        targetPosition,
        columns,
      );
      const rowDiff = adjacentCoords.row - pieceCoords.row;
      const colDiff = adjacentCoords.col - pieceCoords.col;

      const landingRow = adjacentCoords.row + rowDiff;
      const landingCol = adjacentCoords.col + colDiff;

      const landingPosition = getPositionFromCoordinates(
        landingRow,
        landingCol,
        rows,
        columns,
      );

      if (
        landingPosition &&
        !findPieceByPosition(board, landingPosition) &&
        !validMoves.some((move) => move.targetPosition === landingPosition)
      ) {
        validMoves.push({
          sourcePosition: piece.position,
          targetPosition: landingPosition,
          type: "capture",
          capturePieceId: occupiedPiece.id,
          isPromotion: isPromotionMove(
            pieceId,
            landingPosition,
            board,
            rows,
            columns,
          ),
        });
      }
    }
  }

  return validMoves;
}

export function validateMove(
  pieceId: CheckersPieceId,
  targetPosition: number,
  board: CheckersBoard,
  rows: number,
  columns: number,
): MoveResult {
  const piece = findPieceById(board, pieceId);

  if (!piece) {
    return {
      sourcePosition: -1,
      targetPosition,
      type: "invalid",
    };
  }

  const validMoves = getValidMoves(pieceId, board, rows, columns);
  const move = validMoves.find((mv) => mv.targetPosition === targetPosition);

  if (!move) {
    return {
      sourcePosition: piece.position,
      targetPosition,
      type: "invalid",
    };
  } else {
    return move;
  }
}

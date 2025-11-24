import {
  getAdjacentPositions,
  getPiecesPerPlayer,
  getPlayableSquareCoordinates,
  getPositionFromCoordinates,
  getRowNumber,
  getTotalPlayableSquares,
} from "@/game/checkers-board";
import { CheckersPlayerColor } from "@/game/checkers-game";

const COLOR_MASK = 1 << 0;
const KING_MASK = 1 << 1;
const ID_SHIFT = 2;

export type BitboardPiece = number;

export type Bitboard = Uint32Array;

type DecodedBitboardPiece = {
  id: number;
  color: CheckersPlayerColor;
  isKing: boolean;
};

export type BitboardMoveResultBase = {
  from: number;
  to: number;
};

export type BitboardValidMoveResult = {
  isPromotion: boolean;
} & (
  | { isValid: true; isCapture: false }
  | { isValid: true; isCapture: true; capture: BitboardPiece }
);

export type BitboardMoveResult = BitboardMoveResultBase &
  (BitboardValidMoveResult | { isValid: false });

export function encodePiece(
  id: number,
  color: CheckersPlayerColor,
  isKing: boolean,
): BitboardPiece {
  let piece = id << ID_SHIFT;
  piece |= color === "white" ? COLOR_MASK : 0;
  piece |= isKing ? KING_MASK : 0;
  return piece;
}

export function decodePiece(piece: BitboardPiece): DecodedBitboardPiece {
  const id = piece >> ID_SHIFT;
  const color: CheckersPlayerColor = piece & COLOR_MASK ? "white" : "black";
  const isKing = (piece & KING_MASK) !== 0;
  return { id, color, isKing };
}

export function createEmptyBitboard(rows: number, columns: number): Bitboard {
  const totalPlayableSquares = getTotalPlayableSquares(rows, columns);
  return new Uint32Array(1 + totalPlayableSquares);
}

export function cloneBitboard(bitboard: Bitboard): Bitboard {
  return new Uint32Array(bitboard);
}

export function setPiece(
  bitboard: Bitboard,
  square: number,
  value: BitboardPiece,
) {
  bitboard[square] = value;
}

export function withPiece(
  bitboard: Bitboard,
  square: number,
  value: BitboardPiece,
): Bitboard {
  const newBitboard = cloneBitboard(bitboard);
  setPiece(newBitboard, square, value);
  return newBitboard;
}

export function findPieceAtPosition(
  bitboard: Bitboard,
  at: number,
): BitboardPiece | undefined {
  return bitboard[at];
}

export function findPieceById(
  bitboard: Bitboard,
  pieceId: number,
): BitboardPiece | undefined {
  return bitboard.find((piece) => {
    const decoded = decodePiece(piece);
    return decoded.id === pieceId;
  });
}

export function getPiecePosition(bitboard: Bitboard, piece: BitboardPiece) {
  const index = bitboard.indexOf(piece);

  return index;
}

export function movePiece(
  bitboard: Bitboard,
  piece: BitboardPiece,
  to: number,
  promote = false,
): Bitboard {
  const decodedPiece = decodePiece(piece);
  const piecePosition = getPiecePosition(bitboard, piece);

  if (decodedPiece.id === 0 || piecePosition === -1) {
    return bitboard;
  }

  const newBitboard = withPiece(
    withPiece(bitboard, piecePosition, 0),
    to,
    encodePiece(
      decodedPiece.id,
      decodedPiece.color,
      promote ? true : decodedPiece.isKing,
    ),
  );

  return newBitboard;
}

export function captureAndMovePiece(
  bitboard: Bitboard,
  piece: BitboardPiece,
  to: number,
  captured: BitboardPiece,
  promote = false,
): Bitboard {
  const newBitboard = movePiece(bitboard, piece, to, promote);
  return withPiece(newBitboard, getPiecePosition(newBitboard, captured), 0);
}

export function createInitialBitboard(rows: number, columns: number): Bitboard {
  const bitboard = createEmptyBitboard(rows, columns);
  const totalPlayableSquares = getTotalPlayableSquares(rows, columns);
  const piecesPerPlayer = getPiecesPerPlayer(rows, columns);

  let pieceId = 1;

  for (let square = 1; square <= totalPlayableSquares; square++) {
    if (square <= piecesPerPlayer) {
      setPiece(bitboard, square, encodePiece(pieceId, "black", false));
      pieceId++;
    } else if (square > totalPlayableSquares - piecesPerPlayer) {
      setPiece(bitboard, square, encodePiece(pieceId, "white", false));
      pieceId++;
    }
  }

  return bitboard;
}

export function isPromotionMove(
  piece: BitboardPiece,
  to: number,
  rows: number,
  columns: number,
) {
  const decoded = decodePiece(piece);

  if (decoded.isKing) {
    return false;
  }

  const targetRow = getRowNumber(to, columns);

  if (decoded.color === "black" && targetRow === rows) {
    return true;
  }

  if (decoded.color === "white" && targetRow === 1) {
    return true;
  }

  return false;
}

export function getAdjacentPositionsForPiece(
  bitboard: Bitboard,
  piece: BitboardPiece,
  rows: number,
  columns: number,
) {
  const decoded = decodePiece(piece);
  const position = getPiecePosition(bitboard, piece);

  if (position === -1) {
    return new Set<number>();
  }

  const directions = decoded.color === "black" ? [1] : [-1];

  if (decoded.isKing) {
    directions.push(-directions[0]);
  }

  const adjacentPositions = Array.from(
    getAdjacentPositions(position, rows, columns),
  );

  const adjacentPositionsForDirections = adjacentPositions.filter((pos) => {
    const rowDiff =
      getRowNumber(pos, columns) - getRowNumber(position, columns);
    return directions.includes(rowDiff);
  });

  return new Set(adjacentPositionsForDirections);
}

export function getValidMoves(
  bitboard: Bitboard,
  piece: BitboardPiece,
  rows: number,
  columns: number,
): BitboardMoveResult[] {
  const validMoves: BitboardMoveResult[] = [];
  const position = getPiecePosition(bitboard, piece);

  if (position === -1) {
    return validMoves;
  }

  const adjacentPositions = getAdjacentPositionsForPiece(
    bitboard,
    piece,
    rows,
    columns,
  );

  const pieceCoords = getPlayableSquareCoordinates(position, columns);

  for (const adjPos of adjacentPositions) {
    const adjPiece = findPieceAtPosition(bitboard, adjPos);
    if (adjPiece === 0 || adjPiece === undefined) {
      validMoves.push({
        from: position,
        to: adjPos,
        isValid: true,
        isCapture: false,
        isPromotion: isPromotionMove(piece, adjPos, rows, columns),
      });
    } else {
      const decodedAdjPiece = decodePiece(adjPiece);
      const decodedPiece = decodePiece(piece);
      if (decodedAdjPiece.color !== decodedPiece.color) {
        const adjacentCoords = getPlayableSquareCoordinates(adjPos, columns);

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

        if (landingPosition !== null) {
          const landingPiece = findPieceAtPosition(bitboard, landingPosition);
          if (landingPiece === 0) {
            validMoves.push({
              from: position,
              to: landingPosition,
              isValid: true,
              isCapture: true,
              capture: adjPiece,
              isPromotion: isPromotionMove(
                piece,
                landingPosition,
                rows,
                columns,
              ),
            });
          }
        }
      }
    }
  }

  return validMoves;
}

export function validateMove(
  bitboard: Bitboard,
  piece: BitboardPiece,
  to: number,
  rows: number,
  columns: number,
): BitboardMoveResult {
  const piecePosition = getPiecePosition(bitboard, piece);
  const validMoves = getValidMoves(bitboard, piece, rows, columns);
  const move = validMoves.find((m) => m.to === to);

  if (move) {
    return move;
  } else {
    return { from: piecePosition, to, isValid: false };
  }
}

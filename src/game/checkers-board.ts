export function getPlayableSquaresPerRow(columns: number) {
  return Math.floor(columns / 2);
}

export function getTotalPlayableSquares(rows: number, columns: number) {
  return getPlayableSquaresPerRow(columns) * rows;
}

export function getPiecesPerPlayer(rows: number, columns: number) {
  return (rows / 2 - 1) * getPlayableSquaresPerRow(columns);
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

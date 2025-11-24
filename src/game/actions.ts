export function startAction(rows?: number, columns?: number) {
  return {
    type: "start",
    rows,
    columns,
  } as const;
}

export function moveAction(pieceId: number, to: number) {
  return {
    type: "move",
    pieceId,
    to,
  } as const;
}

export function resetAction() {
  return {
    type: "reset",
  } as const;
}

export type CheckersGameAction =
  | ReturnType<typeof startAction>
  | ReturnType<typeof moveAction>
  | ReturnType<typeof resetAction>;

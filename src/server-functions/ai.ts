"use server";

import { openai } from "@ai-sdk/openai";
import { generateText, Output, stepCountIs } from "ai";
import z from "zod";

import {
  selectCapturedPieces,
  selectPieces,
  selectValidMoves,
} from "@/game/selectors";
import { CheckersGameState } from "@/game/state";

const prompt = `You are a player in a checkers game.
  Given the game state, once you determine which player color you are, decide the best move to play.
  Use as many tools as needed to analyze the current state of the game and determine your move.

  You may play as offensively (attempt to capture pieces) or defensively (avoid getting your pieces captured) as you see fit.

  American checkers rules apply:
    - Pieces can only move diagonally on dark (playable) squares.
    - Regular pieces can only move forward (towards the opponent's side). Kings can move both forward and backward.
    - Capturing is mandatory. If a capture is available, you must take it.
    - Multiple/chain captures (using the same piece) are allowed in a single turn if possible (you will be prompted to make additional moves after each capture if applicable).
    - A piece is promoted to a king when it reaches the opponent's back row.

  The board information and pieces can be obtained using the provided tools. Always check if a move is valid before suggesting it.
  The position of each square on the board is represented as a single integer index, starting from 0 at the top-left playable square and increasing left to right, top to bottom, only counting playable squares.
  `;

export async function decideMove(state: CheckersGameState) {
  const result = await generateText({
    model: openai("gpt-4o"),
    prompt,
    experimental_output: Output.object({
      schema: z.object({
        pieceId: z.number().describe("The ID of the piece to move."),
        to: z
          .number()
          .min(0)
          .max(state.rows * state.columns - 1),
      }),
    }),
    tools: {
      getCurrentPlayerColor: {
        description: "Get the color of the current player (you).",
        inputSchema: z.object({}),
        outputSchema: z.enum(["black", "white"]),
        async execute() {
          console.log("Executed tool: getCurrentPlayerColor");
          return state.currentPlayer;
        },
      },
      getBoardInfo: {
        description:
          "Get information about the current board state, including piece positions and captured pieces.",
        inputSchema: z.object({}),
        outputSchema: z.object({
          rows: z.number().multipleOf(2),
          columns: z.number().multipleOf(2),
          pieces: z.array(
            z.object({
              id: z.number(),
              color: z.enum(["black", "white"]),
              isKing: z.boolean(),
              position: z.number(),
            }),
          ),
          captured: z.object({
            black: z.array(
              z.object({
                id: z.number().min(1).max(32),
                color: z.enum(["black", "white"]),
                isKing: z.boolean(),
                position: z.literal(-1),
              }),
            ),
            white: z.array(
              z.object({
                id: z.number().min(1).max(32),
                color: z.enum(["black", "white"]),
                isKing: z.boolean(),
                position: z.literal(-1),
              }),
            ),
          }),
        }),
        async execute() {
          console.log("Executed tool: getBoardInfo");
          return {
            rows: state.rows,
            columns: state.columns,
            pieces: selectPieces(state),
            captured: selectCapturedPieces(state),
          };
        },
      },
      getAllPieces: {
        description: "Get all pieces on the board with their positions.",
        inputSchema: z.object({}),
        outputSchema: z.array(
          z.object({
            id: z.number().min(1).max(32),
            color: z.enum(["black", "white"]),
            isKing: z.boolean(),
            position: z
              .number()
              .min(0)
              .max(state.rows * state.columns - 1),
          }),
        ),
        async execute() {
          console.log("Executed tool: getAllPieces");
          const pieces = selectPieces(state);
          return pieces;
        },
      },
      getValidMovesForPiece: {
        description: "Get all valid moves for a given piece ID.",
        inputSchema: z.object({
          pieceId: z.number(),
        }),
        outputSchema: z.array(
          z.object({
            to: z.number(),
            isCapture: z.boolean(),
            isPromotion: z.boolean(),
          }),
        ),
        async execute({ pieceId }) {
          console.log(
            "Executed tool: getValidMovesForPiece with pieceId",
            pieceId,
          );
          const moves = selectValidMoves(state, pieceId);
          return moves;
        },
      },
    },
    stopWhen: stepCountIs(10),
  });

  return result.experimental_output;
}

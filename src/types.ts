export type ViewState =
  | "splash"
  | "platform_selection"
  | "settings"
  | "game_selection"
  | "apple_game"
  | "crash_game"
  | "mines_game"
  | "info";

export type SelectedGame = "apple" | "crash" | "mines";

export type Platform = "bizbet" | "linebet_v1" | "linebet_v2";

export type Language = "en" | "ar";

export enum GameState {
  IDLE = "IDLE",
  ANALYZING = "ANALYZING",
  PREDICTED = "PREDICTED",
}

export interface PredictionResult {
  path: number[];
  confidence: number;
  analysis: string;
  id: string;
  timestamp: number;
  gridData?: boolean[][];
}

export interface AccessKey {
  key: string;
  expiresAt: number;
}

export const MULTIPLIERS = [
  { value: "1.23", label: "x1.23", goodCount: 4, badCount: 1 },
  { value: "1.54", label: "x1.54", goodCount: 4, badCount: 1 },
  { value: "1.94", label: "x1.94", goodCount: 4, badCount: 1 },
  { value: "2.41", label: "x2.41", goodCount: 4, badCount: 1 },
  { value: "4.02", label: "x4.02", goodCount: 3, badCount: 2 },
  { value: "6.71", label: "x6.71", goodCount: 3, badCount: 2 },
  { value: "11.18", label: "x11.18", goodCount: 3, badCount: 2 },
  { value: "27.97", label: "x27.97", goodCount: 2, badCount: 3 },
  { value: "69.93", label: "x69.93", goodCount: 2, badCount: 3 },
  { value: "349.68", label: "x349.68", goodCount: 1, badCount: 4 },
];

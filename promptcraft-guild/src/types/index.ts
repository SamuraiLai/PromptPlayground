export type CardType = 'mentor' | 'method' | 'modifier';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  content: string;
  tokenCost: number;
  icon?: string;
}

export interface SlotState {
  mentor: Card | null;
  method: Card | null;
  modifier: Card | null;
}

export interface GameState {
  phase: 'deal' | 'compose' | 'score' | 'reflection';
  hand: Card[];
  slots: SlotState;
  promptText: string;
  tokenLimit: number;
  tokenCount: number;
  timeRemaining: number;
  isTimerActive: boolean;
  level: number;
  streak: number;
  result: 'pending' | 'success' | 'failure';
  feedback: string;
  highlightedTokens: string[];
  suggestions: string[];
  cardLibrary: Card[];
  targetResponse: string;
  generatedResponse: string;
  matchScore: number;
}

export enum ActionType {
  DEAL_CARDS = 'DEAL_CARDS',
  DRAG_CARD = 'DRAG_CARD',
  UPDATE_PROMPT = 'UPDATE_PROMPT',
  START_TIMER = 'START_TIMER',
  TICK_TIMER = 'TICK_TIMER',
  SUBMIT_PROMPT = 'SUBMIT_PROMPT',
  SCORE_RESULT = 'SCORE_RESULT',
  NEXT_ROUND = 'NEXT_ROUND',
  RESET_GAME = 'RESET_GAME',
}

export type Action = 
  | { type: ActionType.DEAL_CARDS }
  | { type: ActionType.DRAG_CARD; payload: { card: Card; destination: keyof SlotState | 'hand' } }
  | { type: ActionType.UPDATE_PROMPT; payload: string }
  | { type: ActionType.START_TIMER }
  | { type: ActionType.TICK_TIMER }
  | { type: ActionType.SUBMIT_PROMPT }
  | { type: ActionType.SCORE_RESULT; payload: { result: 'success' | 'failure'; feedback: string; highlightedTokens: string[]; suggestions: string[] } }
  | { type: ActionType.NEXT_ROUND }
  | { type: ActionType.RESET_GAME }; 
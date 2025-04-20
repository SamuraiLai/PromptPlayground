import { Card } from '../types';

// A simple tokenizer function for the MVP
// In a real application, we would use a proper tokenizer library
export const calculateTokens = (text: string): number => {
  if (!text) return 0;
  
  // Simple word-based tokenization for the MVP
  // This is a simplified approach; real tokenizers are more complex
  const words = text.trim().split(/\s+/);
  return words.length;
};

export const calculateCardTokens = (cards: (Card | null)[]): number => {
  return cards
    .filter((card): card is Card => card !== null)
    .reduce((total, card) => total + card.tokenCost, 0);
};

export const calculateTotalTokens = (promptText: string, cards: (Card | null)[]): number => {
  const textTokens = calculateTokens(promptText);
  const cardTokens = calculateCardTokens(cards);
  return textTokens + cardTokens;
}; 
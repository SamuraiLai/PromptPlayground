import { useState } from 'react';
import { Card } from '../types';

interface EvaluationCriteria {
  clarity?: boolean;
  tone?: boolean;
  coherence?: boolean;
  constraints_met?: boolean;
}

interface EvaluationRequest {
  prompt: string;
  target_output?: string;
  mentor_type?: string;
  method_type?: string;
  modifiers?: string[];
  token_limit?: number;
  criteria?: EvaluationCriteria;
}

interface EvaluationResponse {
  score: number;
  feedback: string;
  reasoning: string;
  highlighted_tokens: string[];
  suggestions: string[];
  metrics: Record<string, number>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useEvaluate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResponse | null>(null);

  const evaluatePrompt = async (
    promptText: string,
    mentorCard: Card | null,
    methodCard: Card | null,
    modifierCards: (Card | null)[],
    tokenLimit: number = 150
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Filter out null cards and extract titles
      const modifiers = modifierCards
        .filter((card): card is Card => card !== null)
        .map(card => card.title);

      const requestData: EvaluationRequest = {
        prompt: promptText,
        mentor_type: mentorCard?.title,
        method_type: methodCard?.title,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
        token_limit: tokenLimit,
        criteria: {
          clarity: true,
          tone: true,
          coherence: true,
          constraints_met: true
        }
      };

      // In development, use the mock endpoint to avoid needing a running backend
      const endpoint = import.meta.env.DEV 
        ? `${API_URL}/api/evaluate/mock`
        : `${API_URL}/api/evaluate`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: EvaluationResponse = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error evaluating prompt:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    evaluatePrompt,
    isLoading,
    error,
    result,
  };
}; 
import { useState } from 'react';
import { Card } from '../types';

interface GenerateRequest {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
  mentor_type?: string;
  method_type?: string;
  modifiers?: string[];
}

interface GenerateResponse {
  output: string;
  token_count: number;
  generation_time: number;
  model_used: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useGenerate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GenerateResponse | null>(null);

  const generatePrompt = async (
    promptText: string,
    mentorCard: Card | null,
    methodCard: Card | null,
    modifierCards: (Card | null)[]
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Filter out null cards and extract titles
      const modifiers = modifierCards
        .filter((card): card is Card => card !== null)
        .map(card => card.title);

      const requestData: GenerateRequest = {
        prompt: promptText,
        mentor_type: mentorCard?.title,
        method_type: methodCard?.title,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
        temperature: 0.7,
        max_tokens: 256
      };

      // In development, use the mock endpoint to avoid needing a running backend
      const endpoint = import.meta.env.DEV 
        ? `${API_URL}/api/generate/mock`
        : `${API_URL}/api/generate`;

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

      const data: GenerateResponse = await response.json();
      setResponse(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error generating prompt:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePrompt,
    isLoading,
    error,
    response,
  };
}; 
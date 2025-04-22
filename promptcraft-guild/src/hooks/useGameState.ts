import { useReducer, useEffect, useCallback } from 'react';
import { GameState, Action, ActionType, SlotState, Card } from '../types';
import { getRandomCards, mentorCards, methodCards, modifierCards } from '../data/cards';
import { calculateTotalTokens } from '../utils/tokenCalculator';
import { useGenerate } from '../api/useGenerate';
import { useEvaluate } from '../api/useEvaluate';

// Sample target responses for the game
const targetResponses = [
  "The concept of recursive thinking involves a function calling itself until a specific condition is met. It's like Russian nesting dolls where each doll contains a smaller version of itself, until you reach the smallest one. In programming, this is used for problems that can be broken down into simpler versions of the same problem.",
  "Machine learning algorithms learn from data by identifying patterns. Think of them as students who study countless examples to understand a subject. For instance, to recognize cats, they analyze thousands of cat pictures, gradually improving their ability to distinguish cats from other animals.",
  "Object-oriented programming organizes code around 'objects' rather than functions. Imagine a car factory where each department focuses on a specific component—engine, transmission, etc. In OOP, each object has its own properties and behaviors, keeping related functionality bundled together."
];

const initialState: GameState = {
  phase: 'deal',
  hand: [],
  slots: {
    mentor: null,
    method: null,
    modifier: null
  },
  promptText: '',
  tokenLimit: 150,
  tokenCount: 0,
  timeRemaining: 45, // 45 seconds for compose phase
  isTimerActive: false,
  level: 1,
  streak: 0,
  result: 'pending',
  feedback: '',
  highlightedTokens: [],
  suggestions: [],
  cardLibrary: [...mentorCards, ...methodCards, ...modifierCards],
  targetResponse: targetResponses[0],
  generatedResponse: '',
  matchScore: 0
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ActionType.DEAL_CARDS: {
      // Select a random target response based on level
      const targetIndex = (state.level - 1) % targetResponses.length;
      const newTargetResponse = targetResponses[targetIndex];
      
      return {
        ...state,
        phase: 'deal',
        slots: {
          mentor: null,
          method: null,
          modifier: null
        },
        tokenCount: 0,
        promptText: '',
        result: 'pending',
        feedback: '',
        highlightedTokens: [],
        suggestions: [],
        targetResponse: newTargetResponse,
        generatedResponse: ''
      };
    }
    
    case ActionType.DRAG_CARD: {
      const { card, destination } = action.payload;
      
      // If card is dragged to hand, remove it from any slots
      if (destination === 'hand') {
        const updatedSlots: SlotState = { ...state.slots };
        let slotChanged = false;
        
        // Check each slot for the card
        Object.keys(updatedSlots).forEach((slotKey) => {
          const key = slotKey as keyof SlotState;
          if (updatedSlots[key]?.id === card.id) {
            updatedSlots[key] = null;
            slotChanged = true;
          }
        });
        
        // Only update if a slot actually changed
        if (slotChanged) {
          const slotCards = Object.values(updatedSlots);
          const newTokenCount = calculateTotalTokens(state.promptText, slotCards);
          
          return {
            ...state,
            slots: updatedSlots,
            tokenCount: newTokenCount,
            phase: state.phase === 'deal' ? 'compose' : state.phase
          };
        }
        
        // If not in a slot, no need to update
        return state;
      }
      
      // If card is dragged to a slot
      const slotKey = destination as keyof SlotState;
      
      // Check if the card type matches the slot type
      if (card.type !== slotKey) {
        return state; // Card type doesn't match slot type
      }
      
      // Create new slots with updated card
      const updatedSlots: SlotState = { ...state.slots, [slotKey]: card };
      
      // Calculate new token count
      const slotCards = Object.values(updatedSlots);
      const newTokenCount = calculateTotalTokens(state.promptText, slotCards);
      
      // If this is the first card placement, move to compose phase and start timer
      const newPhase = state.phase === 'deal' ? 'compose' : state.phase;
      const shouldStartTimer = state.phase === 'deal' && newPhase === 'compose';
      
      return {
        ...state,
        phase: newPhase,
        slots: updatedSlots,
        tokenCount: newTokenCount,
        isTimerActive: shouldStartTimer ? true : state.isTimerActive
      };
    }
    
    case ActionType.UPDATE_PROMPT: {
      const newPromptText = action.payload;
      const slotCards = Object.values(state.slots);
      const newTokenCount = calculateTotalTokens(newPromptText, slotCards);
      
      return {
        ...state,
        promptText: newPromptText,
        tokenCount: newTokenCount
      };
    }
    
    case ActionType.START_TIMER:
      return {
        ...state,
        isTimerActive: true
      };
    
    case ActionType.TICK_TIMER: {
      if (!state.isTimerActive || state.timeRemaining <= 0) {
        return {
          ...state,
          isTimerActive: false
        };
      }
      
      const newTimeRemaining = state.timeRemaining - 1;
      
      // If timer reaches 0, automatically submit
      if (newTimeRemaining <= 0) {
        return {
          ...state,
          timeRemaining: 0,
          isTimerActive: false,
          phase: 'score'
        };
      }
      
      return {
        ...state,
        timeRemaining: newTimeRemaining
      };
    }
    
    case ActionType.SUBMIT_PROMPT:
      return {
        ...state,
        phase: 'score',
        isTimerActive: false
      };
    
    case ActionType.SCORE_RESULT: {
      const { result, feedback, highlightedTokens, suggestions } = action.payload;
      return {
        ...state,
        phase: 'reflection',
        result,
        feedback,
        highlightedTokens,
        suggestions
      };
    }
    
    case ActionType.NEXT_ROUND: {
      let newStreak = state.streak;
      let newLevel = state.level;
      let newTokenLimit = state.tokenLimit;
      
      if (state.result === 'success') {
        newStreak += 1;
        
        // Increase level after 2 successful attempts
        if (newStreak >= 2) {
          newLevel += 1;
          newStreak = 0;
          newTokenLimit = Math.max(100, state.tokenLimit - 10); // Reduce token limit, but not below 100
        }
      } else {
        newStreak = 0;
      }
      
      return {
        ...state,
        phase: 'deal',
        streak: newStreak,
        level: newLevel,
        tokenLimit: newTokenLimit,
        timeRemaining: 45, // Reset timer
        result: 'pending'
      };
    }
    
    case ActionType.RESET_GAME:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { generatePrompt, isLoading: isGenerating } = useGenerate();
  const { evaluatePrompt, isLoading: isEvaluating } = useEvaluate();
  
  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (state.isTimerActive) {
      timerId = window.setInterval(() => {
        dispatch({ type: ActionType.TICK_TIMER });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [state.isTimerActive]);
  
  // Memoize functions to avoid recreation on each render
  const dealCards = useCallback(() => {
    dispatch({ type: ActionType.DEAL_CARDS });
  }, []);
  
  const dragCard = useCallback((card: Card, destination: keyof SlotState | 'hand') => {
    dispatch({ type: ActionType.DRAG_CARD, payload: { card, destination } });
  }, []);
  
  const updatePrompt = useCallback((text: string) => {
    dispatch({ type: ActionType.UPDATE_PROMPT, payload: text });
  }, []);
  
  const startTimer = useCallback(() => {
    dispatch({ type: ActionType.START_TIMER });
  }, []);
  
  const nextRound = useCallback(() => {
    dispatch({ type: ActionType.NEXT_ROUND });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: ActionType.RESET_GAME });
  }, []);
  
  // Scoring function that uses the APIs
  const scorePrompt = useCallback(async () => {
    try {
      // Extract card data for API calls
      const { mentor, method, modifier } = state.slots;
      const modifierCards = [modifier];
      
      // First, generate a response with the Mistral API
      const generationResult = await generatePrompt(
        state.promptText,
        mentor,
        method,
        modifierCards
      );
      
      if (!generationResult) {
        throw new Error("Failed to generate response");
      }
      
      // Now evaluate the prompt with the Prometheus API
      const evaluationResult = await evaluatePrompt(
        state.promptText,
        mentor,
        method,
        modifierCards,
        state.tokenLimit
      );
      
      if (!evaluationResult) {
        throw new Error("Failed to evaluate prompt");
      }
      
      // Determine success/failure based on the score
      const result = evaluationResult.score >= 0.6 ? 'success' : 'failure';
      
      // Dispatch the result
      dispatch({
        type: ActionType.SCORE_RESULT,
        payload: {
          result,
          feedback: evaluationResult.feedback,
          highlightedTokens: evaluationResult.highlighted_tokens,
          suggestions: evaluationResult.suggestions
        }
      });
    } catch (error) {
      console.error("Error in scorePrompt:", error);
      
      // Fallback to a basic success/failure if the API calls fail
      const isSuccess = Math.random() > 0.3; // 70% chance of success for demo
      
      const result = isSuccess ? 'success' : 'failure';
      const feedback = isSuccess
        ? "The Guide nods approvingly. 'Your prompt demonstrates mastery of the chosen method. Well crafted!'"
        : "The Guide raises an eyebrow. 'Your approach shows potential, but the constraints weren't fully addressed. Consider how your chosen Mentor would approach this differently.'";
      
      dispatch({
        type: ActionType.SCORE_RESULT,
        payload: {
          result,
          feedback,
          highlightedTokens: state.promptText.split(/\s+/).slice(0, 5),
          suggestions: [
            "Try using more specific examples",
            "Consider a different mental model for this problem",
            "Your mentor's voice could be more prominent"
          ]
        }
      });
    }
  }, [state.slots, state.promptText, state.tokenLimit, generatePrompt, evaluatePrompt]);
  
  const submitPrompt = useCallback(() => {
    dispatch({ type: ActionType.SUBMIT_PROMPT });
    scorePrompt();
  }, [scorePrompt]);
  
  return {
    state,
    dealCards,
    dragCard,
    updatePrompt,
    startTimer,
    submitPrompt,
    nextRound,
    resetGame,
    isProcessing: isGenerating || isEvaluating
  };
}; 
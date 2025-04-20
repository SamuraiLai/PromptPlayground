import logging
import time
import random
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class PrometheusEvaluator:
    """
    Mock implementation of the Prometheus 2 evaluator.
    In a production environment, this would be replaced with the actual model integration.
    """
    def __init__(self):
        logger.info("Initializing PrometheusEvaluator")
        self.model_name = "prometheus-2-mock"
        self.is_initialized = True
        logger.info(f"PrometheusEvaluator initialized, model: {self.model_name}")
    
    async def evaluate(
        self,
        prompt: str,
        target_output: Optional[str] = None,
        mentor_type: Optional[str] = None,
        method_type: Optional[str] = None,
        modifiers: Optional[List[str]] = None,
        token_limit: int = 150,
        criteria: Optional[Dict[str, bool]] = None
    ):
        """Evaluate a prompt based on the selected criteria"""
        logger.info(f"Evaluating prompt with Prometheus: {prompt[:30]}...")
        
        start_time = time.time()
        
        # Check if all required cards are present
        is_complete = all([mentor_type, method_type, modifiers])
        
        # Check token limit
        token_count = len(prompt.split())
        is_within_limit = token_count <= token_limit
        
        # Calculate base score
        base_score = 0.7
        if not is_complete:
            base_score -= 0.2
        if not is_within_limit:
            base_score -= (min(token_count - token_limit, token_limit) / token_limit) * 0.5
        
        # Add random variation to make it more realistic
        score = max(0.0, min(1.0, base_score + random.uniform(-0.1, 0.1)))
        
        # Generate feedback
        mentors_feedback = {
            "The Archivist": "Consider a more formal structure with clear citations of precedent.",
            "The Sage": "Deepen your connections across disciplines for more profound insights.",
            "The Guide": "Provide clearer pathways and examples to lead the reader.",
            "The Inventor": "Explore more unconventional perspectives and innovative solutions.",
            "The Storyteller": "Develop a stronger narrative arc to engage the reader."
        }
        
        methods_feedback = {
            "SCAMPER": "Apply more substitution and combination techniques.",
            "First Principles": "Break down your reasoning to more fundamental elements.",
            "Chain-of-Thought": "Make each logical step more explicit in your reasoning.",
            "SWOT Analysis": "Balance your analysis across all four SWOT quadrants.",
            "Socratic Method": "Deepen your questioning to stimulate critical thinking."
        }
        
        # Generate appropriate feedback
        if score > 0.8:
            feedback = "Your prompt shows excellent mastery of the selected constraints."
            if mentor_type in mentors_feedback:
                feedback += f" The voice of {mentor_type} comes through clearly."
            if method_type in methods_feedback:
                feedback += f" Your use of {method_type} is well-executed."
        elif score > 0.5:
            feedback = "Your prompt is satisfactory but could be improved."
            if mentor_type in mentors_feedback:
                feedback += f" {mentors_feedback[mentor_type]}"
            if method_type in methods_feedback:
                feedback += f" {methods_feedback[method_type]}"
        else:
            feedback = "Your prompt needs significant improvement to meet the constraints."
            if not is_complete:
                feedback += " Ensure all required elements are incorporated."
            if not is_within_limit:
                feedback += f" Your prompt exceeds the token limit by {token_count - token_limit} tokens."
        
        # Generate reasoning
        reasoning_elements = []
        
        if mentor_type:
            mentor_presence = random.uniform(0.4, 1.0)
            if mentor_presence > 0.7:
                reasoning_elements.append(f"The voice of {mentor_type} is evident in your writing style.")
            else:
                reasoning_elements.append(f"The voice of {mentor_type} could be strengthened.")
        
        if method_type:
            method_presence = random.uniform(0.4, 1.0)
            if method_presence > 0.7:
                reasoning_elements.append(f"You've effectively applied the {method_type} approach.")
            else:
                reasoning_elements.append(f"Your application of {method_type} could be more thorough.")
        
        if modifiers:
            for modifier in modifiers:
                modifier_presence = random.uniform(0.4, 1.0)
                if modifier_presence > 0.7:
                    reasoning_elements.append(f"You've successfully implemented the '{modifier}' constraint.")
                else:
                    reasoning_elements.append(f"The '{modifier}' constraint could be more fully addressed.")
        
        if not is_within_limit:
            reasoning_elements.append(f"Your prompt contains {token_count} tokens, exceeding the {token_limit} token limit.")
        
        reasoning = " ".join(reasoning_elements)
        
        # Generate highlighted tokens
        words = prompt.split()
        highlighted_tokens = []
        for i in range(min(5, len(words))):
            if random.random() > 0.7 and len(words[i]) > 3:
                highlighted_tokens.append(words[i])
        
        # Generate suggestions
        suggestions = []
        if score < 0.9:
            if mentor_type and random.random() > 0.5:
                suggestions.append(mentors_feedback[mentor_type] if mentor_type in mentors_feedback else "Consider the mentor's voice more carefully.")
            if method_type and random.random() > 0.5:
                suggestions.append(methods_feedback[method_type] if method_type in methods_feedback else "Apply the method more systematically.")
            if not is_within_limit:
                suggestions.append("Make your prompt more concise to fit within the token limit.")
        
        if not suggestions:
            suggestions = [
                "Try combining different mental models for a richer prompt.",
                "Consider exploring more complex constraints in your next attempt.",
                "Experiment with different writing styles to enhance your prompt."
            ]
        
        # Create metrics
        metrics = {
            "clarity": random.uniform(0.5, 1.0),
            "tone": random.uniform(0.5, 1.0) if mentor_type else random.uniform(0.3, 0.7),
            "coherence": random.uniform(0.5, 1.0) if method_type else random.uniform(0.3, 0.7),
            "constraint_adherence": 1.0 if is_within_limit else random.uniform(0.1, 0.5)
        }
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        logger.info(f"Evaluation completed in {elapsed_time:.2f}s. Score: {score:.2f}")
        
        return {
            "score": score,
            "feedback": feedback,
            "reasoning": reasoning,
            "highlighted_tokens": highlighted_tokens,
            "suggestions": suggestions,
            "metrics": metrics
        }

# Initialize the evaluator
evaluator = PrometheusEvaluator()

async def evaluate_prompt(
    prompt: str,
    target_output: Optional[str] = None,
    mentor_type: Optional[str] = None,
    method_type: Optional[str] = None,
    modifiers: Optional[List[str]] = None,
    token_limit: int = 150,
    criteria: Optional[Dict[str, bool]] = None
):
    """Wrapper function to evaluate a prompt using the Prometheus model"""
    return await evaluator.evaluate(
        prompt=prompt,
        target_output=target_output,
        mentor_type=mentor_type,
        method_type=method_type,
        modifiers=modifiers,
        token_limit=token_limit,
        criteria=criteria
    ) 
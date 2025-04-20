from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import time
import asyncio
from .models.eval_prometheus import evaluate_prompt

# Initialize logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Define models
class EvaluationCriteria(BaseModel):
    clarity: bool = True
    tone: bool = True
    coherence: bool = True
    constraints_met: bool = True

class EvaluationRequest(BaseModel):
    prompt: str
    target_output: Optional[str] = None
    mentor_type: Optional[str] = None
    method_type: Optional[str] = None
    modifiers: Optional[List[str]] = None
    token_limit: int = 150
    criteria: Optional[EvaluationCriteria] = None

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    reasoning: str
    highlighted_tokens: List[str] = []
    suggestions: List[str] = []
    metrics: Dict[str, float] = {}

# Evaluation endpoint
@router.post("/", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest, background_tasks: BackgroundTasks):
    """
    Evaluate a prompt based on selected criteria using Prometheus 2
    
    - prompt: The user's written prompt
    - target_output: The expected output format or style (optional)
    - mentor_type: The selected mentor card (e.g., "The Archivist")
    - method_type: The selected method card (e.g., "Chain-of-Thought")
    - modifiers: List of modifier constraints (e.g., ["Use Metaphor", "Token Limit"])
    - token_limit: Maximum tokens allowed (default: 150)
    - criteria: Evaluation criteria to focus on
    """
    logger.info(f"Received evaluation request for prompt: {request.prompt[:30]}...")
    
    try:
        # In a production environment, this would call the actual Prometheus model
        # For now, we'll use a mock implementation
        result = await evaluate_prompt(
            prompt=request.prompt,
            target_output=request.target_output,
            mentor_type=request.mentor_type,
            method_type=request.method_type,
            modifiers=request.modifiers,
            token_limit=request.token_limit,
            criteria=request.criteria.dict() if request.criteria else None
        )
        
        return result
    except Exception as e:
        logger.error(f"Error evaluating prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation error: {str(e)}")
    
# Mock evaluation endpoint for testing without model
@router.post("/mock", response_model=EvaluationResponse)
async def mock_evaluate(request: EvaluationRequest):
    """Mock evaluation endpoint for testing without the Prometheus model"""
    logger.info(f"Received mock evaluation request for prompt: {request.prompt[:30]}...")
    
    # Simulate processing time
    await asyncio.sleep(1.5)
    
    # Generate mock response based on input
    token_count = len(request.prompt.split())
    is_over_limit = token_count > request.token_limit
    has_mentor = request.mentor_type is not None
    has_method = request.method_type is not None
    
    # Calculate mock score
    base_score = 0.7  # Start with a decent score
    if is_over_limit:
        base_score -= 0.3
    if not has_mentor:
        base_score -= 0.2
    if not has_method:
        base_score -= 0.2
        
    # Clamp score between 0 and 1
    score = max(0.0, min(1.0, base_score))
    
    # Generate feedback based on score
    if score > 0.8:
        feedback = f"The Guide nods approvingly. 'Your prompt demonstrates mastery of the {request.method_type or 'chosen method'}. Well crafted!'"
        result = "success"
    elif score > 0.5:
        feedback = f"The Guide considers your work. 'There's potential in your approach using {request.method_type or 'this method'}, but it could be refined further.'"
        result = "success"
    else:
        feedback = f"The Guide raises an eyebrow. 'Your approach shows promise, but the constraints weren't fully addressed. Consider how your chosen {request.mentor_type or 'Mentor'} would approach this differently.'"
        result = "failure"
    
    # Create reasoning
    reasoning_points = []
    if is_over_limit:
        reasoning_points.append(f"The prompt exceeds the token limit ({token_count}/{request.token_limit})")
    if not has_mentor:
        reasoning_points.append("No mentor voice is evident in the prompt")
    if not has_method:
        reasoning_points.append("The prompt doesn't utilize the selected method effectively")
    
    if not reasoning_points:
        reasoning_points.append("The prompt meets the basic requirements")
        if request.mentor_type:
            reasoning_points.append(f"The voice of {request.mentor_type} comes through clearly")
        if request.method_type:
            reasoning_points.append(f"The {request.method_type} approach is well-executed")
            
    reasoning = ". ".join(reasoning_points) + "."
    
    # Generate suggestions
    suggestions = []
    if is_over_limit:
        suggestions.append("Try making your prompt more concise")
    if not has_mentor and request.mentor_type:
        suggestions.append(f"Incorporate more of {request.mentor_type}'s voice and perspective")
    if not has_method and request.method_type:
        suggestions.append(f"Apply the principles of {request.method_type} more explicitly")
    
    if not suggestions:
        suggestions.append("Consider exploring more complex constraints in your next attempt")
        suggestions.append("Try combining different mental models for a richer prompt")
        
    # Create highlighted tokens
    words = request.prompt.split()
    highlighted_tokens = [word for i, word in enumerate(words) if i % 5 == 0 and len(word) > 3][:5]
    
    # Create mock metrics
    metrics = {
        "clarity": 0.7 + (0.2 * score),
        "tone": 0.6 + (0.3 * score),
        "coherence": 0.8 * score,
        "constraint_adherence": 0.0 if is_over_limit else 0.9
    }
    
    return EvaluationResponse(
        score=score,
        feedback=feedback,
        reasoning=reasoning,
        highlighted_tokens=highlighted_tokens,
        suggestions=suggestions,
        metrics=metrics
    ) 
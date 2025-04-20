from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import asyncio
from .models.load_mistral import generate_response

# Initialize logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Define models
class GenerationRequest(BaseModel):
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 256
    mentor_type: Optional[str] = None
    method_type: Optional[str] = None
    modifiers: Optional[List[str]] = None

class GenerationResponse(BaseModel):
    output: str
    token_count: int
    generation_time: float = 0.0
    model_used: str = "mistral-7b-instruct"

# Generation endpoint
@router.post("/", response_model=GenerationResponse)
async def generate(request: GenerationRequest, background_tasks: BackgroundTasks):
    """
    Generate a response to a prompt using Mistral-7B
    
    - prompt: The user's written prompt
    - temperature: Controls randomness (0.0-1.0)
    - max_tokens: Maximum tokens to generate
    - mentor_type: The selected mentor card (e.g., "The Archivist")
    - method_type: The selected method card (e.g., "Chain-of-Thought")
    - modifiers: List of modifier constraints (e.g., ["Use Metaphor", "Token Limit"])
    """
    logger.info(f"Received generation request for prompt: {request.prompt[:30]}...")
    
    try:
        # In a production environment, this would call the actual Mistral model
        # For now, we'll use a mock implementation
        result = await generate_response(
            prompt=request.prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            mentor_type=request.mentor_type,
            method_type=request.method_type,
            modifiers=request.modifiers
        )
        
        return result
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")

# Mock generation endpoint for testing without model
@router.post("/mock", response_model=GenerationResponse)
async def mock_generate(request: GenerationRequest):
    """Mock generation endpoint for testing without the Mistral model"""
    logger.info(f"Received mock generation request for prompt: {request.prompt[:30]}...")
    
    # Simulate processing time
    await asyncio.sleep(2)
    
    # Generate mock response based on input
    mentor_styles = {
        "The Archivist": "In examining the historical context and precedent, we observe a pattern of logical progression that leads to a formal conclusion.",
        "The Sage": "Consider, if you will, the deeper implications. When we look beyond the surface, we find connections that transcend the obvious.",
        "The Guide": "Let me walk you through this step by step. First, we need to establish our goal, then identify the path forward.",
        "The Inventor": "What if we approach this from an entirely different angle? Let's reimagine the constraints as opportunities.",
        "The Storyteller": "Imagine a world where this problem has already been solved. What tale would we tell about how it happened?",
    }
    
    method_patterns = {
        "SCAMPER": "We could substitute X with Y, combine it with Z, adapt it by..., modify the core idea, put it to another use, eliminate the unnecessary, and reverse the traditional approach.",
        "First Principles": "Breaking this down to its fundamental truths: First, we know that... Second, it follows that... Therefore...",
        "Chain-of-Thought": "Let's reason through this sequentially. Initially, we observe... This leads us to consider... Which implies... Resulting in...",
        "SWOT Analysis": "Strengths: clear advantage in... Weaknesses: potential gaps in... Opportunities: emerging possibilities for... Threats: challenges from...",
        "Socratic Method": "What would happen if...? How does this relate to...? Why might this be the case? What evidence supports this conclusion?",
    }
    
    modifier_effects = {
        "Token Limit": "Concisely stated, the core concept is...",
        "Use Metaphor": "This is like a garden where ideas bloom with proper nurturing.",
        "Concrete Examples": "Consider these three examples: First, when Tesla designed the Model S... Second, when SpaceX developed reusable rockets... Third, when Apple created the iPhone...",
        "Data Driven": "According to recent studies, 78% of users prefer... The data shows a 42% increase in...",
        "Opposing Views": "Some argue that... However, others maintain that... A middle ground might be...",
    }
    
    # Build a response based on selected cards
    response_parts = []
    
    # Add mentor style if specified
    if request.mentor_type and request.mentor_type in mentor_styles:
        response_parts.append(mentor_styles[request.mentor_type])
    else:
        response_parts.append("Here's a thoughtful response to your query.")
    
    # Add method pattern if specified
    if request.method_type and request.method_type in method_patterns:
        response_parts.append(method_patterns[request.method_type])
    
    # Add modifier effects if specified
    if request.modifiers:
        for modifier in request.modifiers:
            if modifier in modifier_effects:
                response_parts.append(modifier_effects[modifier])
    
    # Add some content based on the prompt
    key_terms = [word for word in request.prompt.split() if len(word) > 4]
    if key_terms:
        sampled_terms = key_terms[:min(5, len(key_terms))]
        response_parts.append(f"Regarding {', '.join(sampled_terms)}, we should consider multiple perspectives.")
    
    # Add a conclusion
    response_parts.append("In conclusion, this approach offers a balanced perspective that addresses the core concerns while maintaining analytical rigor.")
    
    # Join all parts
    output = " ".join(response_parts)
    
    # Calculate token count (simple approximation)
    token_count = len(output.split())
    
    return GenerationResponse(
        output=output,
        token_count=token_count,
        generation_time=2.0,
        model_used="mistral-7b-instruct-mock"
    ) 
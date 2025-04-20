import { Card } from '../types';

export const mentorCards: Card[] = [
  {
    id: 'mentor-1',
    type: 'mentor',
    title: 'The Archivist',
    content: 'Formal and precise. Presents information with scholarly detachment and historical context.',
    tokenCost: 20,
    icon: 'BookOpenText'
  },
  {
    id: 'mentor-2',
    type: 'mentor',
    title: 'The Sage',
    content: 'Wise and contemplative. Presents ideas with depth, making connections across disciplines.',
    tokenCost: 25,
    icon: 'Lamp'
  },
  {
    id: 'mentor-3',
    type: 'mentor',
    title: 'The Guide',
    content: 'Supportive and instructive. Leads through concepts with clear pathways and examples.',
    tokenCost: 15,
    icon: 'Compass'
  },
  {
    id: 'mentor-4',
    type: 'mentor',
    title: 'The Inventor',
    content: 'Creative and unconventional. Approaches problems with fresh perspectives and innovative solutions.',
    tokenCost: 30,
    icon: 'Lightbulb'
  },
  {
    id: 'mentor-5',
    type: 'mentor',
    title: 'The Storyteller',
    content: 'Narrative-focused and engaging. Presents concepts through compelling stories and analogies.',
    tokenCost: 35,
    icon: 'BookOpen'
  }
];

export const methodCards: Card[] = [
  {
    id: 'method-1',
    type: 'method',
    title: 'SCAMPER',
    content: 'Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.',
    tokenCost: 15,
    icon: 'Recycle'
  },
  {
    id: 'method-2',
    type: 'method',
    title: 'First Principles',
    content: 'Break down complex problems into basic elements then reassemble from ground up.',
    tokenCost: 20,
    icon: 'AlignLeft'
  },
  {
    id: 'method-3',
    type: 'method',
    title: 'Chain-of-Thought',
    content: 'Walk through reasoning step by step, making each logical connection explicit.',
    tokenCost: 25,
    icon: 'Link'
  },
  {
    id: 'method-4',
    type: 'method',
    title: 'SWOT Analysis',
    content: 'Evaluate Strengths, Weaknesses, Opportunities, and Threats.',
    tokenCost: 20,
    icon: 'LayoutGrid'
  },
  {
    id: 'method-5',
    type: 'method',
    title: 'Socratic Method',
    content: 'Examine through progressive questioning to stimulate critical thinking.',
    tokenCost: 30,
    icon: 'HelpCircle'
  }
];

export const modifierCards: Card[] = [
  {
    id: 'modifier-1',
    type: 'modifier',
    title: 'Token Limit',
    content: 'Maximum 150 tokens allowed for the prompt.',
    tokenCost: 0,
    icon: 'Ruler'
  },
  {
    id: 'modifier-2',
    type: 'modifier',
    title: 'Use Metaphor',
    content: 'Include at least one extended metaphor in your response.',
    tokenCost: 10,
    icon: 'Sparkles'
  },
  {
    id: 'modifier-3',
    type: 'modifier',
    title: 'Concrete Examples',
    content: 'Provide at least 3 specific examples to illustrate your point.',
    tokenCost: 15,
    icon: 'ListTodo'
  },
  {
    id: 'modifier-4',
    type: 'modifier',
    title: 'Data Driven',
    content: 'Include numerical data or statistics to support your argument.',
    tokenCost: 15,
    icon: 'LineChart'
  },
  {
    id: 'modifier-5',
    type: 'modifier',
    title: 'Opposing Views',
    content: 'Present multiple perspectives on the topic.',
    tokenCost: 20,
    icon: 'Split'
  }
];

// Helper function to get random cards
export const getRandomCards = (): {mentors: Card[], methods: Card[], modifiers: Card[]} => {
  const getRandomItems = (array: Card[], count: number): Card[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  return {
    mentors: getRandomItems(mentorCards, 2),
    methods: getRandomItems(methodCards, 2),
    modifiers: getRandomItems(modifierCards, 1)
  };
}; 
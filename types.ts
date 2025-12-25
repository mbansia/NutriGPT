export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg
  goal: 'Weight Loss' | 'Maintenance' | 'Muscle Gain';
  allergies: string[];
  wellnessGoals: string[]; // e.g., 'Better Skin', 'Brain Health'
}

export interface Meal {
  id: string;
  name: string;
  timestamp: Date;
  imageUrl?: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  score: number; // 1-10
  vibeCheck: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isWidget?: boolean; // If true, render a special widget instead of plain text
  widgetType?: 'progress' | 'summary';
}

export type ViewState = 'dashboard' | 'plan' | 'shopping' | 'meals' | 'profile';

export interface ShoppingVerdict {
  score: number;
  verdict: 'GO' | 'STOP' | 'CAUTION';
  explanation: string;
}

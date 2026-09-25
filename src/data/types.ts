export interface Question {
  id: number;
  moduleId: string;
  moduleTitle: string;
  moduleNumber: number;
  scenario: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  distractorBreakdown: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  };
  urduSummary: string;
  corePrinciple: string;
  difficulty: 'Hard' | 'Extreme';
}

export interface ModuleInfo {
  id: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  keyTopics: string[];
}

export type ExamMode = 'all-100' | 'by-module' | 'quick-drill' | 'mistakes-review';

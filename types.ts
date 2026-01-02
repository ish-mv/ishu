
export enum Unit {
  UNIT_1 = "Unit I: INTRODUCTION TO ROBOTIC PROCESS AUTOMATION",
  UNIT_2 = "Unit II: AUTOMATION PROCESS ACTIVITIES",
  UNIT_3 = "Unit III: APP INTEGRATION, RECORDING AND SCRAPING",
  UNIT_4 = "Unit IV: EXCEPTION HANDLING AND CODE MANAGEMENT",
  UNIT_5 = "Unit V: DEPLOYMENT AND MAINTENANCE"
}

export interface Assessment {
  id: string;
  title: string;
  unit: Unit;
  description: string;
  scenario: string;
  task: string;
  learningObjectives: string[];
}

export interface CaseStudy {
  id: string;
  unit: Unit;
  title: string;
  challenge: string;
  solution: string;
  impact: string;
  industry: string;
}

export interface FeedbackResponse {
  score: number;
  criticalAnalysis: string;
  improvementAreas: string[];
  syllabusCorrelation: string;
}

export interface Slide {
  title: string;
  bullets: string[];
  diagramDescription: string;
  realTimeExample: string;
  explanation: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WebResource {
  title: string;
  description: string;
  url: string;
  unit: Unit;
  category: 'Documentation' | 'Article' | 'Case Study';
}

export interface LabActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  parameters: string[];
}

export interface LabScenario {
  id: string;
  unit: Unit;
  title: string;
  objective: string;
  task: string;
  requiredActivities: string[];
  successLogs: string[];
}

export interface UnitContent {
  unitId: string;
  slides: Slide[];
}

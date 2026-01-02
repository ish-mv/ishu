
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResponse, Slide, MCQ } from "../types";

export class GeminiService {
  async evaluateAssessment(
    unit: string,
    scenario: string,
    task: string,
    userAnswer: string
  ): Promise<FeedbackResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      As an expert RPA Professor for the CCS361 course, evaluate the following student response for a Critical Thinking Assessment.
      
      UNIT: ${unit}
      SCENARIO: ${scenario}
      TASK: ${task}
      STUDENT ANSWER: ${userAnswer}

      Provide your evaluation in JSON format with exactly these fields:
      - score: A number from 0-100 based on technical accuracy and critical depth.
      - criticalAnalysis: A paragraph summarizing their strengths and weaknesses in reasoning.
      - improvementAreas: An array of 3 specific technical suggestions based on the RPA syllabus.
      - syllabusCorrelation: A sentence explaining how their answer relates to the specific Unit concepts.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              criticalAnalysis: { type: Type.STRING },
              improvementAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              syllabusCorrelation: { type: Type.STRING }
            },
            required: ["score", "criticalAnalysis", "improvementAreas", "syllabusCorrelation"]
          }
        }
      });
      return JSON.parse(response.text || '{}') as FeedbackResponse;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to evaluate the assessment.");
    }
  }

  async generateSlides(unitTitle: string, syllabusItems: string): Promise<Slide[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Create a comprehensive, 50-slide Masterclass presentation for CCS361 - Robotic Process Automation.
      
      UNIT: ${unitTitle}
      SYLLABUS TOPICS: ${syllabusItems}

      INSTRUCTIONS:
      1. Generate EXACTLY 50 slides covering the topics above in exhaustive detail.
      2. Slides should move from History/Evolution to Core Concepts, Tool UI, Technical Implementation, Logic Flow, and Industry Case Studies.
      3. For EVERY slide, provide:
         - title: Professional academic title.
         - bullets: 3-5 high-value technical bullet points.
         - diagramDescription: A description of a flowchart, diagram, or UI screenshot that would accompany this slide.
         - realTimeExample: A specific business scenario where this concept is applied.
         - explanation: A pedagogical deep-dive for the lecturer's notes.

      Output ONLY a JSON object:
      {
        "slides": [...]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32000 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    diagramDescription: { type: Type.STRING },
                    realTimeExample: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["title", "bullets", "diagramDescription", "realTimeExample", "explanation"]
                }
              }
            },
            required: ["slides"]
          }
        }
      });
      const data = JSON.parse(response.text || '{"slides": []}');
      return data.slides;
    } catch (error) {
      console.error("Slide Generation Error:", error);
      return [];
    }
  }

  async generateUnitMCQs(unitTitle: string, syllabusItems: string): Promise<MCQ[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Generate a comprehensive 50-question MCQ set for CCS361 - RPA.
      UNIT: ${unitTitle}
      SYLLABUS: ${syllabusItems}
      Output ONLY a JSON object: { "questions": [...] }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["question", "options", "correctAnswer", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });
      const data = JSON.parse(response.text || '{"questions": []}');
      return data.questions;
    } catch (error) {
      console.error("MCQ Error:", error);
      return [];
    }
  }
}

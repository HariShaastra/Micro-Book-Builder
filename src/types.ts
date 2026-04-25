/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: string;
  title: string;
  content: string;
  summary?: string;
  isBookmarked: boolean;
  status: 'draft' | 'final';
  wordCount: number;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  notes?: string;
  coverImage?: string;
  chapters: Chapter[];
  createdAt: number;
  updatedAt: number;
  status: 'draft' | 'completed' | 'archived';
}

export type TemplateType = 'scratch' | 'memoir' | 'academic' | 'essay' | 'anthology' | 'research';

export interface Template {
  id: TemplateType;
  name: string;
  icon: string;
  description: string;
  structure: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'scratch',
    name: 'Start from Scratch',
    icon: 'FilePlus',
    description: 'A blank canvas for your next masterpiece.',
    structure: ['Chapter 1'],
  },
  {
    id: 'memoir',
    name: 'Memoir',
    icon: 'BookOpen',
    description: 'Structure your life events into a compelling timeline.',
    structure: ['Introduction: The Beginning', 'Early Years & Roots', 'The Turning Point', 'Challenges & Growth', 'Current Perspective', 'Looking Ahead'],
  },
  {
    id: 'academic',
    name: 'Academic Guide',
    icon: 'GraduationCap',
    description: 'Perfect for textbooks and technical guides.',
    structure: ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion', 'References'],
  },
  {
    id: 'essay',
    name: 'Essay Collection',
    icon: 'Library',
    description: 'Organize related essays into a cohesive volume.',
    structure: ['Preface', 'Essay One', 'Essay Two', 'Essay Three', 'Closing Thoughts'],
  },
  {
    id: 'anthology',
    name: 'Story Anthology',
    icon: 'PenTool',
    description: 'A collection of short stories or poems.',
    structure: ['Foreword', 'Story A', 'Story B', 'Story C', 'Story D', 'Afterword'],
  },
  {
    id: 'research',
    name: 'Research Notes',
    icon: 'Search',
    description: 'A system for organizing complex research data.',
    structure: ['Hypothesis', 'Data Collection', 'Observations', 'Analysis', 'Appendix'],
  },
];

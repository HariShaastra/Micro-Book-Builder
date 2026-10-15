/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DocumentStatus = 
  | 'idea' 
  | 'planning' 
  | 'draft' 
  | 'editing' 
  | 'in_progress' 
  | 'review' 
  | 'final' 
  | 'exported' 
  | 'published' 
  | 'archived';

export type BookType = 
  | 'novel'
  | 'children'
  | 'academic'
  | 'textbook'
  | 'workbook'
  | 'guide'
  | 'handbook'
  | 'research'
  | 'report'
  | 'portfolio'
  | 'biography'
  | 'autobiography'
  | 'poetry'
  | 'essay'
  | 'journal'
  | 'project'
  | 'book'
  | 'memoir'
  | 'article'
  | 'plan'
  | 'presentation'
  | 'creative'
  | 'professional'
  | 'scientific'
  | 'thesis'
  | 'notes'
  | 'event'
  | 'sop'
  | 'decision'
  | 'case_study'
  | 'whitepaper'
  | 'prd'
  | 'speech'
  | 'newsletter'
  | 'custom';

export type DocumentType = BookType;

export type CollaboratorRole = 'viewer' | 'commenter' | 'editor';

export interface Collaborator {
  email: string;
  role: CollaboratorRole;
  displayName?: string;
  addedAt?: number;
}

export interface ShareSettings {
  generalAccess: 'restricted' | 'anyone_with_link';
  permission: CollaboratorRole;
}

export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'subheading' 
  | 'quote' 
  | 'image' 
  | 'table' 
  | 'bullet_list' 
  | 'numbered_list' 
  | 'divider' 
  | 'callout' 
  | 'page_break' 
  | 'footnote';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // text or JSON string for tables
  meta?: {
    caption?: string;
    altText?: string;
    calloutType?: 'info' | 'warning' | 'tip' | 'quote';
    alignment?: 'left' | 'center' | 'right';
    headingLevel?: 1 | 2 | 3;
    imageUrl?: string;
    imageWidth?: number;
    tableRows?: string[][];
  };
}

export interface ChapterSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Chapter {
  id: string;
  bookId?: string;
  title: string;
  content: string; // Raw HTML / compiled text
  guidance?: string;
  summary?: string;
  isBookmarked: boolean;
  status: 'draft' | 'in_progress' | 'review' | 'final';
  wordCount: number;
  order: number;
  sections?: ChapterSection[];
  blocks?: ContentBlock[];
}

export interface Asset {
  id: string;
  bookId?: string;
  name: string;
  type: string;
  url: string;
  size: number;
  dateAdded?: number;
  usageCount?: number;
}

export type CoverStyleTemplate = 'minimal' | 'children' | 'academic' | 'fiction' | 'business' | 'report' | 'modern';

export interface CoverConfig {
  title?: string;
  subtitle?: string;
  author?: string;
  bgImage?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  styleTemplate?: CoverStyleTemplate;
  alignment?: 'left' | 'center' | 'right';
  borderStyle?: 'none' | 'simple' | 'ornate' | 'modern';
}

export interface FrontMatter {
  titlePage?: {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    author?: string;
    publisher?: string;
    year?: number;
  };
  copyright?: {
    enabled: boolean;
    text?: string;
    isbn?: string;
    edition?: string;
  };
  dedication?: {
    enabled: boolean;
    text?: string;
  };
  preface?: {
    enabled: boolean;
    title?: string;
    content?: string;
  };
  acknowledgements?: {
    enabled: boolean;
    content?: string;
  };
  aboutAuthor?: {
    enabled: boolean;
    bio?: string;
    location?: string;
  };
}

export interface ReferenceItem {
  id: string;
  type: 'book' | 'article' | 'website' | 'journal' | 'report' | 'other';
  author: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  accessDate?: string;
  notes?: string;
}

export interface BookNote {
  id: string;
  title: string;
  category: 'general' | 'chapter' | 'research' | 'character' | 'plot' | 'editing' | 'reference';
  content: string;
  chapterId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FictionCharacter {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Mentor' | 'Other';
  description: string;
  appearance?: string;
  relationships?: string;
  notes?: string;
  chapterIds?: string[];
}

export interface BookVersion {
  id: string;
  versionNumber: number;
  label?: string;
  timestamp: number;
  chapterCount: number;
  wordCount: number;
  dataSnapshot: {
    chapters: Chapter[];
    description: string;
  };
}

export type PageBorderStyle = 
  | 'none' 
  | 'classic-single' 
  | 'classic-double' 
  | 'oxford' 
  | 'ornate-corners' 
  | 'vintage-filigree' 
  | 'modern-accent' 
  | 'manuscript-frame';

export interface PageSettings {
  size: 'Trade 6x9' | 'A4' | 'A5' | 'Letter' | 'Custom' | 'Digest 5.5x8.5';
  margins: 'narrow' | 'normal' | 'wide';
  orientation: 'portrait' | 'landscape';
  headerText?: string;
  footerText?: string;
  showPageNumbers: boolean;
  chapterNumbering: boolean;
  borderStyle?: PageBorderStyle;
  borderColor?: string;
  fontFamily?: 'serif' | 'sans' | 'garamond' | 'playfair';
  lineSpacing?: '1.5' | '1.75' | '2.0';
  fontSize?: 'sm' | 'base' | 'lg';
}

export interface TOCSettings {
  enabled: boolean;
  style: 'classic' | 'minimal' | 'modern' | 'dots' | 'roman';
  showPageNumbers: boolean;
  showSubsections: boolean;
  title?: string;
  leaderChar?: '.' | '-' | 'none';
  chapterPrefix?: string;
}

export interface BookComment {
  id: string;
  chapterId?: string;
  authorName: string;
  authorEmail?: string;
  text: string;
  createdAt: number;
  resolved: boolean;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  type: BookType;
  blueprintId?: string;
  notes?: string;
  coverImage?: string;
  cover?: CoverConfig;
  tags: string[];
  isFavorite: boolean;
  status: DocumentStatus;
  authorName?: string;
  coAuthors?: string[];
  publisher?: string;
  language?: string;
  genre?: string;
  targetAudience?: string;
  edition?: string;
  copyrightYear?: number;
  isbn?: string;
  keywords?: string[];
  chapters: Chapter[];
  frontMatter?: FrontMatter;
  references?: ReferenceItem[];
  bookNotes?: BookNote[];
  characters?: FictionCharacter[];
  versions?: BookVersion[];
  pageSettings?: PageSettings;
  tocSettings?: TOCSettings;
  assets?: Asset[];
  createdAt: number;
  updatedAt: number;
  userId?: string;
  collaborators?: Collaborator[];
  collaboratorEmails?: string[];
  editorEmails?: string[];
  shareSettings?: ShareSettings;
  comments?: BookComment[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  bookIds: string[];
  notes?: string;
  status: 'active' | 'archived';
  createdAt: number;
  updatedAt: number;
  userId?: string;
}

export interface BlueprintSection {
  title: string;
  guidance: string;
}

export interface Blueprint {
  id: string;
  name: string;
  category: 'Fiction' | 'Children\'s' | 'Academic' | 'Educational' | 'Business' | 'Report' | 'Workbook' | 'Guide' | 'Portfolio' | 'Poetry' | 'Research' | 'Custom';
  icon: string;
  description: string;
  complexity: 'Light' | 'Standard' | 'Deep' | 'Comprehensive';
  estimatedWords: string;
  structure: BlueprintSection[];
}

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'scratch',
    name: 'Blank Book from Scratch',
    category: 'Custom',
    icon: 'FilePlus',
    description: 'A clean, boundless slate. Define your own chapters, sections, and structural fragments freely.',
    complexity: 'Light',
    estimatedWords: 'Variable',
    structure: [
      { title: 'Chapter 1: The Beginning', guidance: 'Begin writing your thoughts and opening themes freely.' }
    ],
  },
  {
    id: 'children',
    name: 'Children’s Illustrated Story',
    category: 'Children\'s',
    icon: 'Sparkles',
    description: 'A vibrant narrative structure tailored for young readers, moral lessons, and rich illustration beats.',
    complexity: 'Light',
    estimatedWords: '800 - 3,500 words',
    structure: [
      { title: 'Prologue: The River Awakes', guidance: 'Introduce the enchanting world, the young protagonist, and the setting.' },
      { title: 'Chapter 1: The First Departure', guidance: 'A curiosity or sudden change causes the hero to leave familiar ground.' },
      { title: 'Chapter 2: Companions on the Bank', guidance: 'Meeting eccentric friends and discovering an ancient riddle.' },
      { title: 'Chapter 3: The Gathering Storm', guidance: 'A test of courage, teamwork, and facing nature’s challenges.' },
      { title: 'Chapter 4: The Whispering Tree', guidance: 'Uncovering the hidden truth and solving the dilemma.' },
      { title: 'Chapter 5: Return to the Source', guidance: 'Reaching home with wisdom, renewed harmony, and celebration.' },
      { title: 'Author Note & Illustrated Map', guidance: 'Behind-the-scenes thoughts on real folklore and drawing suggestions.' }
    ],
  },
  {
    id: 'school_guide',
    name: 'Student Guide to Experiential Learning',
    category: 'Educational',
    icon: 'Compass',
    description: 'A comprehensive, practical field guide for school and college learners pursuing project-based inquiry.',
    complexity: 'Standard',
    estimatedWords: '4,000 - 10,000 words',
    structure: [
      { title: 'Orientation & Learning Charter', guidance: 'Foundations of experiential education and learner autonomy.' },
      { title: 'Module 1: The Spirit of Active Inquiry', guidance: 'Moving beyond rote memorisation into keen observation.' },
      { title: 'Module 2: Field Activity Frameworks', guidance: 'Step-by-step methodologies for local community research.' },
      { title: 'Module 3: Structured Reflection Logs', guidance: 'Framework for turning daily experiences into conceptual models.' },
      { title: 'Module 4: Building the Portfolio Artifact', guidance: 'How to curate evidence, photos, diagrams, and findings.' },
      { title: 'Module 5: Rubric & Self-Assessment', guidance: 'Evaluating personal growth and setting goals for future terms.' }
    ],
  },
  {
    id: 'teacher_handbook',
    name: 'Teacher Guide to Shaastra Edusystem',
    category: 'Educational',
    icon: 'GraduationCap',
    description: 'Instructional handbook for educators adopting constructive, experiential, and student-centered methods.',
    complexity: 'Deep',
    estimatedWords: '8,000 - 20,000 words',
    structure: [
      { title: 'Philosophical Grounding', guidance: 'The Shaastra vision: cultivating holistic curiosity and ethical intellect.' },
      { title: 'Classroom Architecture & Dynamics', guidance: 'Arranging collaborative spaces and fostering dialogue.' },
      { title: 'Designing Experiential Units', guidance: 'Template and workflow for creating multi-disciplinary learning arcs.' },
      { title: 'Continuous Diagnostic Assessment', guidance: 'Formative observation checklists over high-stakes testing.' },
      { title: 'Facilitating Student Portfolios', guidance: 'Mentoring pupils as they document their intellectual journeys.' },
      { title: 'Institutional Collaboration & Community', guidance: 'Engaging parents, local artisans, and scientists as guest guides.' }
    ],
  },
  {
    id: 'parent_guide',
    name: 'Parent Guide: Nurturing Inquisitive Minds',
    category: 'Guide',
    icon: 'HeartHandshake',
    description: 'Warm, actionable companion for parents supporting their child’s natural curiosity at home.',
    complexity: 'Standard',
    estimatedWords: '3,500 - 8,000 words',
    structure: [
      { title: 'Introduction: The Home as a Laboratory', guidance: 'Reimagining everyday domestic routines as creative sparks.' },
      { title: 'Cultivating Reading Rituals', guidance: 'How to build family reading habits without coercion or tests.' },
      { title: 'Balancing Digital Engagement & Nature', guidance: 'Guiding conscious technology use and encouraging outdoor play.' },
      { title: 'The Art of Answering Children\'s Questions', guidance: 'Fostering inquiry by wondering together rather than dictating.' },
      { title: 'Supporting Emotional Resilience', guidance: 'Handling academic pressures, peer comparisons, and setbacks.' },
      { title: 'Parent-School Collaboration', guidance: 'Building constructive, trusting partnerships with teachers.' }
    ],
  },
  {
    id: 'fiction_novel',
    name: 'Fiction Novel (Multi-Chapter Arc)',
    category: 'Fiction',
    icon: 'BookOpen',
    description: 'Full literary narrative blueprint with 3-act progression, character arcs, and atmospheric development.',
    complexity: 'Comprehensive',
    estimatedWords: '40,000 - 90,000 words',
    structure: [
      { title: 'Prologue: The Shadow Cast', guidance: 'An evocative glimpse into the catalytic mystery or historical seed.' },
      { title: 'Chapter 1: The Quiet Hill Town', guidance: 'Establish normal world, protagonist desires, and ominous signs.' },
      { title: 'Chapter 2: The Unwelcome Discovery', guidance: 'The inciting incident that disrupts normal routines.' },
      { title: 'Chapter 3: Crossing the Threshold', guidance: 'First commitment to investigate or venture outward.' },
      { title: 'Chapter 4: Complications & Whispers', guidance: 'Encountering resistance, conflicting testimonies, and secrets.' },
      { title: 'Chapter 5: The Midpoint Revelations', guidance: 'A surprising revelation that changes the nature of the stakes.' },
      { title: 'Chapter 6: The Longest Night', guidance: 'The darkest moment when all seems lost before resolution.' },
      { title: 'Chapter 7: The Confrontation', guidance: 'The climactic peak where truth and courage collide.' },
      { title: 'Epilogue: New Horizons', guidance: 'Resonance, lingering ripples, and the world irrevocably altered.' }
    ],
  },
  {
    id: 'academic_research',
    name: 'Academic Research & Policy Report',
    category: 'Research',
    icon: 'BarChart3',
    description: 'Rigorous empirical paper structure featuring literature review, field methodology, data, and citations.',
    complexity: 'Deep',
    estimatedWords: '6,000 - 18,000 words',
    structure: [
      { title: 'Abstract & Executive Summary', guidance: 'Core research question, methodology sample, key findings, policy impact.' },
      { title: 'Introduction & Context', guidance: 'Historical background, problem statement, and socioeconomic significance.' },
      { title: 'Literature Review & Theoretical Framework', guidance: 'Survey of prior discourse and gap this investigation addresses.' },
      { title: 'Methodology & Field Sampling', guidance: 'Quantitative metrics, interview protocols, geographical coverage.' },
      { title: 'Empirical Findings & Data Tables', guidance: 'Granular presentation of surveyed outcomes and correlation analyses.' },
      { title: 'Discussion & Societal Implications', guidance: 'Interpreting data in light of national development goals and equity.' },
      { title: 'Policy Recommendations & Roadmap', guidance: 'Concrete, phased actionable steps for government and institutions.' },
      { title: 'References & Citations', guidance: 'Comprehensive bibliographic documentation of consulted literature.' }
    ],
  },
  {
    id: 'student_workbook',
    name: 'Student Science & Inquiry Workbook',
    category: 'Workbook',
    icon: 'ClipboardList',
    description: 'Hands-on experiential worksheets, hypothesis logs, observation tables, and synthesis questions.',
    complexity: 'Standard',
    estimatedWords: '3,000 - 7,000 words',
    structure: [
      { title: 'Laboratory Safety & Inquiry Code', guidance: 'Ethical conduct, equipment handling, and safety guidelines.' },
      { title: 'Investigation 1: Flora Diversity Survey', guidance: 'Quadrat sampling, leaf vein classification, and soil data.' },
      { title: 'Investigation 2: Water Quality & Turbidity', guidance: 'Testing local catchment samples, recording pH and microorganisms.' },
      { title: 'Investigation 3: Simple Machines in Village Crafts', guidance: 'Analysing levers, pulleys, and friction in pottery and weaving.' },
      { title: 'Investigation 4: Solar Heat Retention', guidance: 'Comparing absorption in various materials and painting prototypes.' },
      { title: 'Capstone Reflection: Science in My Community', guidance: 'Connecting scientific observations to real civic improvements.' }
    ],
  },
  {
    id: 'nep_implementation',
    name: 'Institutional Implementation Framework (NEP)',
    category: 'Report',
    icon: 'Building2',
    description: 'Strategic governance whitepaper for university and school leaders adopting National Education frameworks.',
    complexity: 'Comprehensive',
    estimatedWords: '8,000 - 25,000 words',
    structure: [
      { title: 'Executive Mandate & Vision', guidance: 'Alignment with holistic, multi-disciplinary, and skill-based ideals.' },
      { title: 'Curricular Restructuring (5+3+3+4)', guidance: 'Phased transitions across foundational, preparatory, and middle years.' },
      { title: 'Vocational & Experiential Integration', guidance: 'Setting up craft internships, maker labs, and community field hours.' },
      { title: 'Multilingual & Indian Knowledge Systems', guidance: 'Incorporating regional languages, heritage sciences, and ethical lore.' },
      { title: 'Faculty Empowerment & Continuous CPD', guidance: 'Teacher professional development targets and mentoring cohorts.' },
      { title: 'Governance, Auditing & Accreditation', guidance: 'Accountability matrices, infrastructure readiness, and review cycles.' }
    ],
  },
  {
    id: 'poetry_collection',
    name: 'Poetry & Verse Anthology',
    category: 'Poetry',
    icon: 'Feather',
    description: 'Delicate typographic sanctuary for stanzas, sonnets, ghazals, free verse, and author commentary.',
    complexity: 'Light',
    estimatedWords: '1,500 - 6,000 words',
    structure: [
      { title: 'Dedication & Opening Stanza', guidance: 'The tone-setting invocation or epigraph.' },
      { title: 'Cycle I: Morning & Mist', guidance: 'Verses on dawn, ancestral soil, and unspoken longings.' },
      { title: 'Cycle II: The Bustling Bazaar', guidance: 'Sensory rhythms of market chatter, rain on metal roofs, and faces.' },
      { title: 'Cycle III: Twilight Solitudes', guidance: 'Philosophical meditations on time, impermanence, and memory.' },
      { title: 'Cycle IV: Monsoons & Renewal', guidance: 'Odes to the arrival of rain, green shoots, and rebirth.' },
      { title: 'Author\'s Note on Metre & Voice', guidance: 'Reflections on cadence, translation, and poetic influences.' }
    ],
  }
];

export const TEMPLATES = BLUEPRINTS.map(b => ({
  id: b.id as any,
  name: b.name,
  category: b.category,
  icon: b.icon,
  description: b.description,
  complexity: b.complexity,
  estimatedWords: b.estimatedWords,
  structure: b.structure.map(s => s.title)
}));

export type Template = (typeof TEMPLATES)[number];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Project } from '../types.ts';

export const INITIAL_DEMO_DOCUMENTS: Book[] = [
  // 1. BLANK / CUSTOM: The Writer's Notebook
  {
    id: 'demo-scratch',
    title: "The Writer's Notebook",
    subtitle: "Fragmentary Reflections on Craft, Silence, and Form",
    description: "A freeform literary commonplace book tracking the genesis of prose fragments, observing morning light, and testing rhythmic cadences.",
    type: 'scratch',
    blueprintId: 'scratch',
    tags: ['Commonplace', 'Essay', 'Craft of Writing', 'Reflections'],
    isFavorite: false,
    status: 'draft',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 1,
    authorName: 'Siddharth Rao',
    publisher: 'Shaastra Independent Folios',
    language: 'English',
    genre: 'Literary Non-Fiction',
    targetAudience: 'Writers, Seekers, Solitary Thinkers',
    copyrightYear: 2026,
    isbn: '978-81-945621-9-7',
    cover: {
      title: "The Writer's Notebook",
      subtitle: "Fragmentary Reflections on Craft",
      author: 'Siddharth Rao',
      bgColor: '#1E293B',
      textColor: '#F8FAFC',
      accentColor: '#38BDF8',
      styleTemplate: 'minimal',
      alignment: 'left',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: "The Writer's Notebook",
        subtitle: "Fragmentary Reflections on Craft, Silence, and Form",
        author: 'Siddharth Rao',
        publisher: 'Shaastra Independent Folios',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'To the blank page—which judges no tentative sentence.'
      },
      preface: {
        enabled: true,
        title: 'Note to the Reader',
        content: 'These leaves are not meant as commandments. They are field observations gathered while wrestling with sentences in the pre-dawn stillness of Chennai.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Siddharth Rao writes prose and essays on literature, craft, and architectural history.'
      }
    },
    chapters: [
      {
        id: 'scratch-ch-1',
        title: 'I. On Beginning Before Readiness',
        content: `<h1>I. On Beginning Before Readiness</h1>
<p class="lead">Every writer waits for conditions that will never arrive: undisturbed silence, absolute certainty, and the mythical afternoon where anxiety dissolves into pure eloquence.</p>
<p>The truth taught by the masters of the <em>Shaastra</em> tradition is far humbler: clarity is not the precursor to writing; it is the residue left behind by the friction of ink upon paper. One begins with an uneven syllable, a half-remembered silhouette, or the cadence of rain beating upon a galvanized tin shade.</p>
<blockquote>
  <p>"Do not polish a stone that has not yet been hauled from the quarry."</p>
</blockquote>
<p>Keep the hand moving. The editor in your mind is an auditor; the writer is a laborer at dawn.</p>`,
        isBookmarked: true,
        status: 'draft',
        wordCount: 120,
        order: 0,
        guidance: 'A freeform exploration of how to start a project without paralysis.'
      },
      {
        id: 'scratch-ch-2',
        title: 'II. The Architecture of the Sentence',
        content: `<h2>II. The Architecture of the Sentence</h2>
<p>A good sentence resembles a dry-stone wall in the Nilgiris: no cement is used, yet each boulder rests against the other through balance, gravity, and honest edges.</p>
<p>Notice the three duties of every sentence:</p>
<ul>
  <li><strong>To bear weight:</strong> It must carry its thought without groaning under superfluous adverbs.</li>
  <li><strong>To provide momentum:</strong> It must lean forward into the sentence that follows.</li>
  <li><strong>To leave music:</strong> Even read silently, the ear must savor its vowels.</li>
</ul>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 88,
        order: 1,
        guidance: 'Study syntax, cadence, and restraint.'
      }
    ],
    assets: []
  },

  // 2. CHILDREN'S STORY: The River Remembers
  {
    id: 'demo-children',
    title: 'The River Remembers',
    subtitle: 'An Illustrated Tale of the Kaveri and a Village Girl',
    description: 'A gentle, beautifully illustrated children\'s tale exploring the bond between ten-year-old Meenakshi, the ancient Kaveri river, and the migratory painted storks that herald the annual monsoon.',
    type: 'children',
    blueprintId: 'children',
    tags: ['Children\'s Story', 'Nature & Ecology', 'Folklore', 'Illustrated'],
    isFavorite: true,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    authorName: 'Ananya Sundaram',
    publisher: 'Shaastra Bal Sahitya Imprint',
    language: 'English (with Tamil glosses)',
    genre: 'Children’s Nature Fiction',
    targetAudience: 'Ages 8–12 & Family Read-Aloud',
    copyrightYear: 2026,
    isbn: '978-81-945621-0-4',
    cover: {
      title: 'The River Remembers',
      subtitle: 'An Illustrated Tale of the Kaveri',
      author: 'Ananya Sundaram',
      bgColor: '#1B4332',
      textColor: '#FAF9F6',
      accentColor: '#D8F3DC',
      styleTemplate: 'children',
      alignment: 'center',
      borderStyle: 'ornate'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'The River Remembers',
        subtitle: 'An Illustrated Tale of the Kaveri',
        author: 'Ananya Sundaram',
        publisher: 'Shaastra Bal Sahitya Imprint, Chennai',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'For all children who pause to listen to the whispers of our ancestral streams, and for the storks who never forget the path home.'
      },
      preface: {
        enabled: true,
        title: 'Author’s Invitation',
        content: 'Rivers in India are not mere bodies of flowing water; they are our grandmothers who carry centuries of lullabies, harvest celebrations, and cautionary tales.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Ananya Sundaram is a children\'s author and naturalist based near Grand Anicut, Tamil Nadu.'
      }
    },
    chapters: [
      {
        id: 'children-ch-1',
        title: 'Chapter 1: The Singing Sandbanks',
        content: `<h1>Chapter 1: The Singing Sandbanks</h1>
<p class="lead">Long before the temple bell rang for the morning <em>aarathi</em>, ten-year-old Meenakshi was already barefoot upon the damp sands of the Kaveri river.</p>
<p>The river here was wide and patient. In late summer, it broke into dozens of braided silver ribbons, weaving between islands of emerald river reeds and smooth granite boulders polished round by thousands of monsoons.</p>
<p>"Meenu! Do not venture beyond the second boulder!" called her grandfather, Periyavar, carrying a woven bamboo basket filled with fresh tulsi leaves and brass vessels for morning ablutions.</p>
<p>"I am only watching the water-skaters, Thatha!" she called back, her toes wriggling into the cool mud where the water rippled like accordion pleats.</p>
<p>Suddenly, a shadow swooped overhead—broad wings tipped in rose-pink and black. A solitary painted stork circled twice, tilted its wings against the morning breeze, and landed with a gentle splash upon the sandbar.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 168,
        order: 0,
        guidance: 'Introduce young protagonist, the natural environment, and the sensory landscape.'
      },
      {
        id: 'children-ch-2',
        title: 'Chapter 2: The Stork with the Broken Ribbon',
        content: `<h2>Chapter 2: The Stork with the Broken Ribbon</h2>
<p>Meenakshi froze. She knew that wild birds were as skittish as dropped mercury. But as the bird stepped forward on long yellow legs, she noticed something trailing from its left claw: a tangle of blue nylon twine, caught with dry water-hyacinth roots.</p>
<p>"Thatha," she whispered, tugging her grandfather\'s cotton veshti. "Look at his leg. He cannot wade freely."</p>
<p>Periyavar set down his brass vessel. His weathered face grew solemn. "That is plastic from the pilgrimage ghat three miles upriver. When we treat the river like a refuse ditch, the creatures pay the toll."</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 104,
        order: 1,
        guidance: 'Present the inciting ecological dilemma in an age-appropriate narrative style.'
      },
      {
        id: 'children-ch-3',
        title: 'Chapter 3: The Council Under the Banyan Tree',
        content: `<h2>Chapter 3: The Council Under the Banyan Tree</h2>
<p>By noon, seven children had gathered under the sprawling canopy of the great village banyan. Meenakshi had drawn a map in the soft earth using a broken tamarind twig.</p>
<p>"We cannot catch the bird by force," warned Karthik, who was twelve and claimed to know the flight patterns of every feathered creature in Thanjavur. "A frightened stork can strike with its spear-beak."</p>
<p>"We do not catch him," Meenakshi replied firmly. "We clean the shallow pool where he feeds at dusk. If we clear the reeds of twine and float small fingerling fish into the clean pond, he will come to our shallows where Thatha can cut the knot with his herbal shears."</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 132,
        order: 2,
        guidance: 'Children organize collective community action and demonstrate empathy.'
      }
    ],
    assets: []
  },

  // 3. STUDENT GUIDE: Student Guide to Experiential Learning
  {
    id: 'demo-school_guide',
    title: 'Student Guide to Experiential Learning',
    subtitle: 'A Companion for Project-Based Inquiry and Discovery in Secondary Schools',
    description: 'A comprehensive, practical field guide for school and college learners pursuing active community inquiry, local ecology investigations, and hands-on artifacts.',
    type: 'school_guide',
    blueprintId: 'school_guide',
    tags: ['Experiential Learning', 'Student Guide', 'Inquiry', 'Pedagogy'],
    isFavorite: true,
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
    authorName: 'Dr. Radhakrishnan Memorial Pedagogy Cell',
    publisher: 'Shaastra Vidya Kendra Publications',
    language: 'English',
    genre: 'Educational Companion & Field Manual',
    targetAudience: 'Secondary & Senior Secondary Learners (Grades 8–12)',
    copyrightYear: 2026,
    isbn: '978-81-945621-1-1',
    cover: {
      title: 'Student Guide to Experiential Learning',
      subtitle: 'A Companion for Active Inquiry',
      author: 'Shaastra Vidya Kendra',
      bgColor: '#1D3557',
      textColor: '#F1FAEE',
      accentColor: '#E63946',
      styleTemplate: 'academic',
      alignment: 'center',
      borderStyle: 'double'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Student Guide to Experiential Learning',
        subtitle: 'A Companion for Project-Based Inquiry and Discovery',
        author: 'Shaastra Vidya Kendra Pedagogy Cell',
        publisher: 'Shaastra Vidya Kendra Publications, New Delhi',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'Dedicated to young minds who dare to step out of textbooks and treat their neighborhood as a living laboratory.'
      },
      preface: {
        enabled: true,
        title: 'How to Use This Handbook',
        content: 'This volume is not designed to be memorized for examinations. It is a workbook for your hands, your eyes, and your boots. Carry it on field surveys, keep it beside your workbench, and annotate its margins generously.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'The Shaastra Vidya Kendra is an interdisciplinary alliance of teachers, field scientists, and curriculum designers dedicated to constructivist learning.'
      }
    },
    chapters: [
      {
        id: 'guide-ch-1',
        title: 'Orientation & Learning Charter',
        content: `<h1>Orientation & Learning Charter</h1>
<p class="lead">Welcome to experiential learning. In this pathway, you are no longer a passive spectator receiving pre-digested answers; you are an active investigator asking original questions.</p>
<div style="background-color: #f1f5f9; padding: 1rem; border-left: 4px solid #1D3557; margin: 1.5rem 0;">
  <strong>The Three Pillars of Active Inquiry:</strong>
  <ol>
    <li><strong>Direct Observation:</strong> Document what actually exists, not what the brochure says should exist.</li>
    <li><strong>Systemic Questioning:</strong> Ask "Why does this happen here?" and "Who benefits or suffers from this pattern?"</li>
    <li><strong>Artifact Creation:</strong> Conclude every inquiry by building something tangible: a map, a water filter model, or an oral history archive.</li>
  </ol>
</div>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 115,
        order: 0,
        guidance: 'Grounding learners in autonomy, curiosity, and ethical observation.'
      },
      {
        id: 'guide-ch-2',
        title: 'Module 1: The Spirit of Active Inquiry',
        content: `<h2>Module 1: The Spirit of Active Inquiry</h2>
<p>How does a student transform from a textbook memorizer into an authentic researcher? It begins by unlearning the urge to ask for the "right answer" on page 42.</p>
<p>When you conduct field inquiry, reality is messy. Variables are interconnected. When you measure the temperature of the school courtyard, shade, asphalt, wind currents, and tree canopy all interact simultaneously.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 75,
        order: 1,
        guidance: 'Moving beyond rote memorisation into keen observation.'
      },
      {
        id: 'guide-ch-3',
        title: 'Module 2: Field Activity Frameworks',
        content: `<h2>Module 2: Field Activity Frameworks</h2>
<p>Before you step out of the school gates, formulate a Field Hypothesis Card. Every investigator must have three essentials:</p>
<ul>
  <li>A clear spatial perimeter (e.g., 200 meters around the village pond).</li>
  <li>A standardized data recording grid (date, time, ambient humidity, observer signature).</li>
  <li>An ethical permission protocol for speaking with residents or vendors.</li>
</ul>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 65,
        order: 2,
        guidance: 'Step-by-step methodologies for local community research.'
      }
    ],
    assets: []
  },

  // 4. TEACHER HANDBOOK: Teacher Guide to Shaastra Edusystem
  {
    id: 'demo-teacher_handbook',
    title: 'Teacher Guide to Shaastra Edusystem',
    subtitle: 'Pedagogical Frameworks for Experiential, Constructivist & Student-Centered Classrooms',
    description: 'Instructional handbook for educators adopting constructive, experiential, and inquiry-led methods across multi-grade and multi-disciplinary settings.',
    type: 'teacher_handbook',
    blueprintId: 'teacher_handbook',
    tags: ['Teacher Handbook', 'Edusystem', 'Classroom Dynamics', 'Pedagogy'],
    isFavorite: false,
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
    authorName: 'Prof. K. S. Sundaram & Council of Master Mentors',
    publisher: 'Shaastra Educational Foundation Press',
    language: 'English',
    genre: 'Teacher Training & Curriculum Guide',
    targetAudience: 'Headmasters, Lead Educators, Teacher Trainees',
    copyrightYear: 2026,
    isbn: '978-81-945621-2-8',
    cover: {
      title: 'Teacher Guide to Shaastra Edusystem',
      subtitle: 'Constructivist Pedagogical Frameworks',
      author: 'Prof. K. S. Sundaram',
      bgColor: '#4A0E4E',
      textColor: '#FAF0CA',
      accentColor: '#F4D35E',
      styleTemplate: 'academic',
      alignment: 'center',
      borderStyle: 'ornate'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Teacher Guide to Shaastra Edusystem',
        subtitle: 'Pedagogical Frameworks for Experiential & Student-Centered Classrooms',
        author: 'Prof. K. S. Sundaram & Council of Master Mentors',
        publisher: 'Shaastra Educational Foundation Press, Bengaluru',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'To teachers who build spaces where no child is afraid of making a mistake.'
      },
      preface: {
        enabled: true,
        title: 'The Shift in Teacher Identity',
        content: 'In the traditional classroom, the teacher stood upon an elevated dais, the sole conduit of sanctioned facts. In the Shaastra Edusystem, the teacher is a chief facilitator, architect of learning environments, and co-investigator.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Prof. K. S. Sundaram has mentored over 4,000 rural and urban educators across India in learner-centered pedagogy.'
      }
    },
    chapters: [
      {
        id: 'teacher-ch-1',
        title: 'Philosophical Grounding',
        content: `<h1>Philosophical Grounding</h1>
<p class="lead">The Shaastra vision is rooted in ancient Indian epistemological inquiry (<em>Pramāna</em>), harmonized with modern constructivist principles formulated by Dewey, Vygotsky, and Freire.</p>
<p>Knowledge is not poured into empty vessels. It is actively constructed by learners as they interact with materials, deliberate with peers, and reflect upon surprises.</p>
<div style="background-color: #fdf2f8; padding: 1rem; border-left: 4px solid #db2777; margin: 1.5rem 0;">
  <strong>Core Tenet:</strong> If a concept can be touched, built, or surveyed in the local neighborhood, it should never be introduced solely as an abstract definition on a blackboard.
</div>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 105,
        order: 0,
        guidance: 'The Shaastra vision: cultivating holistic curiosity and ethical intellect.'
      },
      {
        id: 'teacher-ch-2',
        title: 'Classroom Architecture & Dynamics',
        content: `<h2>Classroom Architecture & Dynamics</h2>
<p>Break the straight rows. Monolithic desks facing forward silently reinforce obedience over collaboration. Arrange pods of 4 to 5 desks with central material trays containing graph paper, measuring tapes, and magnifiers.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 42,
        order: 1,
        guidance: 'Arranging collaborative spaces and fostering dialogue.'
      },
      {
        id: 'teacher-ch-3',
        title: 'Designing Experiential Units',
        content: `<h2>Designing Experiential Units</h2>
<p>A successful experiential unit follows the 4-phase arc: <strong>Spark & Wonder</strong> (catalytic phenomenon), <strong>Investigation & Field Gathering</strong> (collecting empirical traces), <strong>Synthesis & Dialogue</strong> (peer deliberation), and <strong>Public Exposition</strong> (sharing artifacts with community members).</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 48,
        order: 2,
        guidance: 'Template and workflow for creating multi-disciplinary learning arcs.'
      }
    ],
    assets: []
  },

  // 5. PARENT GUIDE: Parent Guide: Nurturing Inquisitive Minds
  {
    id: 'demo-parent_guide',
    title: 'Parent Guide: Nurturing Inquisitive Minds',
    subtitle: 'A Gentle Companion for Supporting Curiosity, Emotional Resilience, and Deep Learning at Home',
    description: 'Warm, actionable companion for parents supporting their child’s natural curiosity at home, balancing digital screens, and building collaborative partnerships with teachers.',
    type: 'parent_guide',
    blueprintId: 'parent_guide',
    tags: ['Parenting', 'Guide', 'Home Learning', 'Child Development'],
    isFavorite: false,
    status: 'draft',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 16,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    authorName: 'Dr. Meera Nambiar',
    publisher: 'Shaastra Kutumbha Press',
    language: 'English',
    genre: 'Parenting & Educational Psychology',
    targetAudience: 'Parents of School-Age Children (Ages 5–16)',
    copyrightYear: 2026,
    isbn: '978-81-945621-3-5',
    cover: {
      title: 'Parent Guide: Nurturing Inquisitive Minds',
      subtitle: 'Supporting Deep Curiosity at Home',
      author: 'Dr. Meera Nambiar',
      bgColor: '#264653',
      textColor: '#FAF9F6',
      accentColor: '#2A9D8F',
      styleTemplate: 'modern',
      alignment: 'center',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Parent Guide: Nurturing Inquisitive Minds',
        subtitle: 'Supporting Curiosity, Emotional Resilience, and Deep Learning at Home',
        author: 'Dr. Meera Nambiar',
        publisher: 'Shaastra Kutumbha Press, Kochi',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'For parents who stay patient through the fourteenth "Why?" of the morning.'
      },
      preface: {
        enabled: true,
        title: 'A Letter to Parents',
        content: 'You do not need a degree in nuclear physics or classical literature to cultivate an inquisitive home. The most potent tool in your parenting kit is not an expensive coaching class—it is your willingness to wonder aloud alongside your child.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Dr. Meera Nambiar is a child clinical psychologist and mother of two based in Kerala.'
      }
    },
    chapters: [
      {
        id: 'parent-ch-1',
        title: 'Introduction: The Home as a Laboratory',
        content: `<h1>Introduction: The Home as a Laboratory</h1>
<p class="lead">A kitchen is not merely a place where dinner is cooked; it is a laboratory of thermal expansion, enzymatic browning, phase changes, and ratio calculations.</p>
<p>When you boil milk, watch dough rise with yeast, or examine why salt dissolves in warm water faster than cold water, science ceases to be an alien chapter in a textbook. It becomes sensory reality.</p>
<p>Never dismiss a domestic curiosity with "You will learn that in eighth grade." Respond instead: "Let us test it right here with two cups and a spoon."</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 95,
        order: 0,
        guidance: 'Reimagining everyday domestic routines as creative sparks.'
      },
      {
        id: 'parent-ch-2',
        title: 'Cultivating Reading Rituals',
        content: `<h2>Cultivating Reading Rituals</h2>
<p>Children do not learn to love reading because they are commanded to read for thirty minutes before bedtime. They love reading when they see adults in the house absorbed in books with tea in hand.</p>
<p>Establish a <em>Family Reading Hour</em> where phones are docked in a wicker basket in the hallway, and everyone—parents, grandparents, children—curls up with a book of their choice in companionable silence.</p>`,
        isBookmarked: false,
        status: 'draft',
        wordCount: 78,
        order: 1,
        guidance: 'How to build family reading habits without coercion or tests.'
      }
    ],
    assets: []
  },

  // 6. FICTION NOVEL: The Mist Over Kodaikanal
  {
    id: 'demo-fiction_novel',
    title: 'The Mist Over Kodaikanal',
    subtitle: 'A Hill Station Chronicle in Nine Movements',
    description: 'A multi-chapter literary suspense novel set amidst the eucalyptus groves, shola forests, and colonial archives of an isolated hill station during the late autumn rains.',
    type: 'fiction_novel',
    blueprintId: 'fiction_novel',
    tags: ['Fiction', 'Literary Mystery', 'Hill Station', 'Multi-Chapter'],
    isFavorite: true,
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 35,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    authorName: 'Vikramaditya Varma',
    publisher: 'Shaastra Literary Imprint',
    language: 'English',
    genre: 'Literary Mystery & Atmospheric Fiction',
    targetAudience: 'Lovers of Literary Mystery & Historical Atmosphere',
    copyrightYear: 2026,
    isbn: '978-81-945621-4-2',
    cover: {
      title: 'The Mist Over Kodaikanal',
      subtitle: 'A Hill Station Chronicle',
      author: 'Vikramaditya Varma',
      bgColor: '#1A2A3A',
      textColor: '#ECEFF1',
      accentColor: '#80CBC4',
      styleTemplate: 'fiction',
      alignment: 'center',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'The Mist Over Kodaikanal',
        subtitle: 'A Hill Station Chronicle in Nine Movements',
        author: 'Vikramaditya Varma',
        publisher: 'Shaastra Literary Imprint, Chennai',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'For the shola trees that cling to the ridge, and for those who walk through the mist without fearing what lies behind it.'
      },
      preface: {
        enabled: true,
        title: 'Epigraph',
        content: '"The mountain does not conceal the truth; it merely waits for the clouds to part before those who have earned the view."'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Vikramaditya Varma was raised in the Palani Hills and spent a decade documenting colonial cadastral maps.'
      }
    },
    chapters: [
      {
        id: 'fiction-ch-0',
        title: 'Prologue: The Shadow Cast',
        content: `<h1>Prologue: The Shadow Cast</h1>
<p class="lead">In Kodaikanal, the fog does not arrive; it materializes out of the floorboards like an old memory that refused to drown.</p>
<p>By four in the afternoon on the third of November, the lake had already swallowed the wooden rowboats moored along the club pier. From the stone verandah of the Observatory bungalow, Dr. Nathan could hear nothing save the slow drip of condensing moisture dropping from pine needles onto the rusted corrugated roof.</p>
<p>He held the copper surveying cylinder in his hand. Its seal had been broken seventy years ago, yet the beeswax inside still smelled of dried clove and forgotten ink.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 112,
        order: 0,
        guidance: 'An evocative glimpse into the catalytic mystery or historical seed.'
      },
      {
        id: 'fiction-ch-1',
        title: 'Chapter 1: The Quiet Hill Town',
        content: `<h2>Chapter 1: The Quiet Hill Town</h2>
<p>The postmaster at Seven Roads junction had known three generations of Nathan’s family. He handed over the registered packet with the peculiar deference hill people reserve for those who live alone above the tree line.</p>
<p>"It arrived by the afternoon bus from Batlagundu, Doctor-ayya," Murugan said, wiping his steel-rimmed spectacles on his woollen muffler. "The driver said an advocate from Madurai paid him double fare to deliver it before the post office shutters closed."</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 84,
        order: 1,
        guidance: 'Establish normal world, protagonist desires, and ominous signs.'
      },
      {
        id: 'fiction-ch-2',
        title: 'Chapter 2: The Unwelcome Discovery',
        content: `<h2>Chapter 2: The Unwelcome Discovery</h2>
<p>Under the yellow glow of the brass hurricane lantern, the parchment unfolded with a brittle sigh. It was a deed of transfer dated September 1912, signed by the forest conservator and an unnamed trustee of the Palani Devasthanam.</p>
<p>Across the center of the deed, someone had drawn a red wax cross over the surveyor’s elevation benchmark for Pillar Rocks.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 68,
        order: 2,
        guidance: 'The inciting incident that disrupts normal routines.'
      }
    ],
    assets: []
  },

  // 7. ACADEMIC RESEARCH: Economics of Grassroots Enterprise
  {
    id: 'demo-academic_research',
    title: 'Economics of Grassroots Enterprise in Rural Tamil Nadu',
    subtitle: 'An Empirical Field Investigation into Self-Help Credit Unions, Artisan Collectives, and Sustainable Livelihoods',
    description: 'Rigorous empirical paper structure featuring literature review, field sampling methodology, statistical data tables, and actionable policy interventions.',
    type: 'academic_research',
    blueprintId: 'academic_research',
    tags: ['Economics', 'Policy Research', 'Grassroots', 'Empirical Study'],
    isFavorite: false,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    updatedAt: Date.now() - 1000 * 60 * 60 * 8,
    authorName: 'Dr. S. Kalyanasundaram & P. Revathi',
    publisher: 'Shaastra Institute of Development Studies Press',
    language: 'English',
    genre: 'Development Economics & Empirical Policy',
    targetAudience: 'Policy Makers, Economists, Rural Development Officers',
    copyrightYear: 2026,
    isbn: '978-81-945621-5-9',
    cover: {
      title: 'Economics of Grassroots Enterprise',
      subtitle: 'An Empirical Field Investigation',
      author: 'Dr. S. Kalyanasundaram',
      bgColor: '#0F172A',
      textColor: '#F8FAFC',
      accentColor: '#38BDF8',
      styleTemplate: 'academic',
      alignment: 'left',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Economics of Grassroots Enterprise in Rural Tamil Nadu',
        subtitle: 'An Empirical Field Investigation into Self-Help Credit Unions & Artisan Collectives',
        author: 'Dr. S. Kalyanasundaram & P. Revathi',
        publisher: 'Shaastra Institute of Development Studies Press, Chennai',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'Dedicated to the women leaders of Tamil Nadu self-help federations whose financial discipline sustains the rural economy.'
      },
      preface: {
        enabled: true,
        title: 'Research Scope & Grants',
        content: 'This research monograph synthesizes 36 months of longitudinal field surveys across 42 villages in Thanjavur, Pudukkottai, and Dindigul districts, funded in part by the Rural Livelihoods Mission.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Dr. S. Kalyanasundaram is Professor of Development Economics; P. Revathi is Senior Research Fellow at SIDS.'
      }
    },
    chapters: [
      {
        id: 'academic-ch-1',
        title: 'Abstract & Executive Summary',
        content: `<h1>Abstract & Executive Summary</h1>
<p class="lead">Microfinance mechanisms often fail when disconnected from local artisan supply chains. This investigation examines 1,240 rural households across 42 revenue villages in central Tamil Nadu.</p>
<p>Our quantitative findings demonstrate that when self-help groups (SHGs) transition from consumption microcredit to collective backward-linkage purchasing (raw brass, organic cotton, terracotta clay), default rates fall from <strong>4.8%</strong> to <strong>0.3%</strong>, while household net real income expands by an average of <strong>34.2%</strong> over a 24-month horizon.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 88,
        order: 0,
        guidance: 'Core research question, methodology sample, key findings, policy impact.'
      },
      {
        id: 'academic-ch-2',
        title: 'Empirical Findings & Data Tables',
        content: `<h2>Empirical Findings & Data Tables</h2>
<p>The surveyed sample was disaggregated across three clusters: weaving (Pudukkottai), bronze casting (Swamimalai), and organic paddy farming (Thanjavur).</p>
<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem;">
  <thead>
    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
      <th style="padding: 8px 12px;">Sector</th>
      <th style="padding: 8px 12px;">Sample (n)</th>
      <th style="padding: 8px 12px;">Avg Loan (₹)</th>
      <th style="padding: 8px 12px;">Repayment Rate</th>
      <th style="padding: 8px 12px;">Income Lift (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Bronze Casting</td>
      <td style="padding: 8px 12px;">380</td>
      <td style="padding: 8px 12px;">₹85,000</td>
      <td style="padding: 8px 12px;">99.4%</td>
      <td style="padding: 8px 12px;">+38.6%</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Organic Paddy</td>
      <td style="padding: 8px 12px;">490</td>
      <td style="padding: 8px 12px;">₹45,000</td>
      <td style="padding: 8px 12px;">98.8%</td>
      <td style="padding: 8px 12px;">+29.1%</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px;">Handloom Weaving</td>
      <td style="padding: 8px 12px;">370</td>
      <td style="padding: 8px 12px;">₹60,000</td>
      <td style="padding: 8px 12px;">99.1%</td>
      <td style="padding: 8px 12px;">+35.0%</td>
    </tr>
  </tbody>
</table>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 112,
        order: 1,
        guidance: 'Granular presentation of surveyed outcomes and correlation analyses.'
      }
    ],
    assets: []
  },

  // 8. STUDENT WORKBOOK: Student Science & Inquiry Workbook
  {
    id: 'demo-student_workbook',
    title: 'Shaastra Student Science & Inquiry Workbook',
    subtitle: 'Hands-on Field Protocols, Hypotheses Logs, and Experimental Data Sheets',
    description: 'An interactive scientific workbook containing real investigations: Flora Diversity Quadrat sampling, Turbidity & Water Quality, Simple Machines in Crafts, and Solar Thermal prototypes.',
    type: 'student_workbook',
    blueprintId: 'student_workbook',
    tags: ['Science Workbook', 'Field Experiments', 'Inquiry Worksheets', 'STEM'],
    isFavorite: false,
    status: 'draft',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 7,
    authorName: 'Shaastra Experiential STEM Lab',
    publisher: 'Shaastra Vidya Kendra Press',
    language: 'English',
    genre: 'Science Workbook & Field Protocols',
    targetAudience: 'Middle & High School Students (Grades 6–10)',
    copyrightYear: 2026,
    isbn: '978-81-945621-6-6',
    cover: {
      title: 'Shaastra Science Workbook',
      subtitle: 'Field Protocols & Hypotheses Logs',
      author: 'Shaastra STEM Lab',
      bgColor: '#064E3B',
      textColor: '#ECFDF5',
      accentColor: '#10B981',
      styleTemplate: 'report',
      alignment: 'center',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Shaastra Student Science & Inquiry Workbook',
        subtitle: 'Hands-on Field Protocols, Hypotheses Logs & Experimental Data Sheets',
        author: 'Shaastra Experiential STEM Lab',
        publisher: 'Shaastra Vidya Kendra Press, New Delhi',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'To every student who questions the textbook until the observation confirms it.'
      },
      preface: {
        enabled: true,
        title: 'Student Investigator Code',
        content: 'Record only what your eyes, sensors, and balances register. An unexpected observation is not an error—it is often the doorway to an undiscovered law.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'The Shaastra STEM Lab designs inquiry-based experiments for rural and urban schools.'
      }
    },
    chapters: [
      {
        id: 'workbook-ch-1',
        title: 'Laboratory Safety & Inquiry Code',
        content: `<h1>Laboratory Safety & Inquiry Code</h1>
<p class="lead">Science begins with respect: respect for the living creatures you observe, respect for hazardous chemicals, and respect for your colleagues\' safety.</p>
<ul>
  <li>Always wear safety goggles when heating liquids or working with glass apparatus.</li>
  <li>Never taste any laboratory substance—even if it smells like vinegar or sugar.</li>
  <li>Return living specimens (earthworms, pond snails, plant shoots) to their exact habitat after 15 minutes of non-invasive observation.</li>
</ul>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 82,
        order: 0,
        guidance: 'Ethical conduct, equipment handling, and safety guidelines.'
      },
      {
        id: 'workbook-ch-2',
        title: 'Investigation 1: Flora Diversity Survey',
        content: `<h2>Investigation 1: Flora Diversity Survey</h2>
<p><strong>Apparatus:</strong> 1m x 1m bamboo quadrat frame, magnifying loupe, centimeter scale, soil moisture probe.</p>
<p><strong>Hypothesis:</strong> Shaded areas beneath neem canopies will exhibit lower grass density but higher moss and lichen varieties than open school sports fields.</p>
<div style="border: 1px dashed #cbd5e1; padding: 12px; margin: 12px 0; background-color: #f8fafc;">
  <strong>Observation Log Grid:</strong>
  <p>Quadrat Location: ______________ | Date & Time: ______________</p>
  <p>Count of distinct leaf morphologies: [ &nbsp; &nbsp; &nbsp; ]</p>
  <p>Dominant soil texture: (Sandy / Loamy / Clayey / Humus-rich)</p>
</div>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 94,
        order: 1,
        guidance: 'Quadrat sampling, leaf vein classification, and soil data.'
      }
    ],
    assets: []
  },

  // 9. NEP IMPLEMENTATION: Institutional Implementation Framework
  {
    id: 'demo-nep_implementation',
    title: 'Institutional Implementation Framework (NEP)',
    subtitle: 'Strategic Governance, Curricular Restructuring & Multi-Disciplinary Credit Operations',
    description: 'A comprehensive governance whitepaper for university vice-chancellors, academic deans, and school principals transitioning to the National Education Policy 2020.',
    type: 'nep_implementation',
    blueprintId: 'nep_implementation',
    tags: ['NEP 2020', 'Institutional Governance', 'Higher Education', 'Curriculum Reform'],
    isFavorite: false,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 32,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    authorName: 'Academic Deans Council for Educational Excellence',
    publisher: 'Shaastra Higher Education Policy Press',
    language: 'English',
    genre: 'Policy Framework & Institutional Whitepaper',
    targetAudience: 'Vice Chancellors, College Principals, Academic Deans',
    copyrightYear: 2026,
    isbn: '978-81-945621-7-3',
    cover: {
      title: 'Institutional Framework (NEP)',
      subtitle: 'Strategic Governance & Curricular Restructuring',
      author: 'Academic Deans Council',
      bgColor: '#1E1B4B',
      textColor: '#EEF2FF',
      accentColor: '#818CF8',
      styleTemplate: 'report',
      alignment: 'center',
      borderStyle: 'double'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Institutional Implementation Framework (NEP)',
        subtitle: 'Strategic Governance, Curricular Restructuring & Multi-Disciplinary Credit Operations',
        author: 'Academic Deans Council for Educational Excellence',
        publisher: 'Shaastra Higher Education Policy Press, New Delhi',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'For educational leaders steering Indian institutions toward world-class multidisciplinary excellence.'
      },
      preface: {
        enabled: true,
        title: 'Executive Preface',
        content: 'This document serves as an institutional blueprint for dismantling silos between science, arts and liberal studies, and technical disciplines, establishing credit transfer banks, and incorporating Indian Knowledge Systems.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'The Academic Deans Council comprises senior administrators across central, state, and autonomous universities.'
      }
    },
    chapters: [
      {
        id: 'nep-ch-1',
        title: 'Executive Mandate & Vision',
        content: `<h1>Executive Mandate & Vision</h1>
<p class="lead">The National Education Policy 2020 envisions an educational architecture that dismantles rigid disciplinary silos and honors student agency through multiple exit and entry pathways.</p>
<p>For institutions transitioning from affiliate models to degree-granting autonomous status, this framework provides operational timelines, credit transfer protocols, and faculty retraining modules necessary to achieve compliance without compromising intellectual depth.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 68,
        order: 0,
        guidance: 'Alignment with holistic, multi-disciplinary, and skill-based ideals.'
      },
      {
        id: 'nep-ch-2',
        title: 'Curricular Restructuring (5+3+3+4)',
        content: `<h2>Curricular Restructuring (5+3+3+4)</h2>
<p>The restructuring demands that foundational years emphasize mother-tongue immersion and sensory play. In the secondary tier, students must have the liberty to combine physics with classical music, or computer coding with constitutional law, supported by an Academic Bank of Credits (ABC) digital ledger.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 56,
        order: 1,
        guidance: 'Phased transitions across foundational, preparatory, and middle years.'
      },
      {
        id: 'nep-ch-3',
        title: 'Vocational & Experiential Integration',
        content: `<h2>Vocational & Experiential Integration</h2>
<p>No student should graduate with a bachelor\'s degree without at least 120 contact hours in a hands-on local workshop, agricultural cooperative, or industrial laboratory. Vocational credits must carry equal academic weight to theoretical lecture hours.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 46,
        order: 2,
        guidance: 'Setting up craft internships, maker labs, and community field hours.'
      }
    ],
    assets: []
  },

  // 10. POETRY ANTHOLOGY: Monsoon & Terracotta
  {
    id: 'demo-poetry_collection',
    title: 'Monsoon & Terracotta',
    subtitle: 'Verses of Dawn, Rain, and the Clay of the Cauvery',
    description: 'A delicate typographic sanctuary of free verse, classical Tamil Akam/Puram echoes, and quiet reflections on clay, water, and impermanence.',
    type: 'poetry_collection',
    blueprintId: 'poetry_collection',
    tags: ['Poetry', 'Verse Anthology', 'Monsoon', 'Literary'],
    isFavorite: true,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    authorName: 'Revathi Krishnan',
    publisher: 'Shaastra Kavya Press',
    language: 'English (with Sangam allusions)',
    genre: 'Contemporary Poetry & Verse',
    targetAudience: 'Poetry Lovers, Meditative Readers',
    copyrightYear: 2026,
    isbn: '978-81-945621-8-0',
    cover: {
      title: 'Monsoon & Terracotta',
      subtitle: 'Verses of Dawn, Rain, and Clay',
      author: 'Revathi Krishnan',
      bgColor: '#431407',
      textColor: '#FED7AA',
      accentColor: '#F97316',
      styleTemplate: 'minimal',
      alignment: 'center',
      borderStyle: 'single'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Monsoon & Terracotta',
        subtitle: 'Verses of Dawn, Rain, and the Clay of the Cauvery',
        author: 'Revathi Krishnan',
        publisher: 'Shaastra Kavya Press, Thanjavur',
        year: 2026
      },
      dedication: {
        enabled: true,
        text: 'To the potters of Manamadurai who turn red earth into song upon the wheel.'
      },
      preface: {
        enabled: true,
        title: 'Invocation',
        content: 'Like red earth and pouring rain, our hearts have merged without parting. — Kuruntokai 40'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Revathi Krishnan is a bilingual poet and translator living along the banks of the Vennar.'
      }
    },
    chapters: [
      {
        id: 'poetry-ch-1',
        title: 'Dedication & Opening Stanza',
        content: `<h1>Dedication & Opening Stanza</h1>
<div style="font-family: Georgia, serif; font-style: italic; text-align: center; margin: 2.5rem 0; line-height: 2;">
  <p>The potter does not speak to the clay;<br>
  he wets his thumbs in river water<br>
  and listens to the stone axis hum.</p>
  <p>Before the first vessel rises,<br>
  the shape was already resting<br>
  in the silt of the summer dried tank.</p>
</div>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 52,
        order: 0,
        guidance: 'The tone-setting invocation or epigraph.'
      },
      {
        id: 'poetry-ch-2',
        title: 'Cycle I: Morning & Mist',
        content: `<h2>Cycle I: Morning & Mist</h2>
<div style="font-family: Georgia, serif; font-style: italic; text-align: center; margin: 2rem 0; line-height: 2.2;">
  <p>At four, before the crows take wing,<br>
  the river is gray glass.<br>
  A solitary woman sweeps the threshold with cow dung water,<br>
  her chalk kolam tracing loops of rice flour<br>
  for ants who have not yet prayed.</p>
  <p>We are all visitors here,<br>
  leaving white patterns on the dark flagstones<br>
  that feet will scatter by noon.</p>
</div>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 71,
        order: 1,
        guidance: 'Verses on dawn, ancestral soil, and unspoken longings.'
      },
      {
        id: 'poetry-ch-3',
        title: 'Cycle IV: Monsoons & Renewal',
        content: `<h2>Cycle IV: Monsoons & Renewal</h2>
<div style="font-family: Georgia, serif; font-style: italic; text-align: center; margin: 2rem 0; line-height: 2.2;">
  <p>The first raindrop hits the hot terracotta tile<br>
  with the sound of a struck bronze bell.<br>
  The petrichor rises like incense from an open sanctum.</p>
  <p>Drink, dry earth.<br>
  Every thirst is forgiven<br>
  when the sky forgets how to stay empty.</p>
</div>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 54,
        order: 2,
        guidance: 'Odes to the arrival of rain, green shoots, and rebirth.'
      }
    ],
    assets: []
  }
];

export const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Shaastra Delta Ecological Volumes',
    description: 'An integrated multi-book initiative crafting children’s river literature, botanical guides, and water policy studies across the Kaveri basin.',
    category: 'Ecology & Community',
    bookIds: ['demo-children', 'demo-academic_research', 'demo-poetry_collection'],
    notes: 'Coordinating with local community schools in Thanjavur and Tiruchirappalli for bilingual editions.',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: 'proj-2',
    title: 'Shaastra Pedagogy Transformation Suite',
    description: 'Institutional manuals, student experiential guides, and parent handbooks for deploying the Shaastra inquiry model nationwide.',
    category: 'Education & Governance',
    bookIds: ['demo-school_guide', 'demo-teacher_handbook', 'demo-parent_guide', 'demo-nep_implementation'],
    notes: 'Drafting unified rubrics and glossary of terms across Hindi, Tamil, and English editions.',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6
  }
];

/**
 * Returns the authentic demo book for any given blueprint ID.
 */
export function getDemoBookForBlueprint(blueprintId: string): Book | undefined {
  return INITIAL_DEMO_DOCUMENTS.find(b => b.blueprintId === blueprintId || b.id === `demo-${blueprintId}`);
}

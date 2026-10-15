/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Project } from '../types.ts';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_DEMO_DOCUMENTS: Book[] = [
  // 1. The River Remembers (Children's Illustrated Story)
  {
    id: 'demo-river-remembers',
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
        text: 'For all children who pause to listen to the whispers of our sacred streams, and for the storks who never forget the path home.'
      },
      preface: {
        enabled: true,
        title: 'Author’s Invitation',
        content: 'Rivers in India are not mere bodies of flowing water; they are our grandmothers who carry centuries of lullabies, harvest celebrations, and cautionary tales. When I sat by the sandbanks of Tiruchirappalli as a child, my grandfather taught me to read the river’s ripples like pages in an ever-turning book.'
      },
      aboutAuthor: {
        enabled: true,
        bio: 'Ananya Sundaram is a children’s author and birdwatcher who lives in Thanjavur. She conducts river-walk storytelling workshops for government school students across Tamil Nadu.',
        location: 'Thanjavur, Tamil Nadu'
      }
    },
    references: [
      {
        id: 'ref-1',
        type: 'book',
        author: 'Salim Ali',
        title: 'The Book of Indian Birds',
        publisher: 'Bombay Natural History Society',
        year: '2002',
        notes: 'Source for migratory plumage of Painted Storks (Mycteria leucocephala).'
      },
      {
        id: 'ref-2',
        type: 'article',
        author: 'Krishnan, M.',
        title: 'Nights by the Kaveri Sandbanks',
        publisher: 'The Statesman Archives',
        year: '1974',
        notes: 'Atmospheric descriptions of riverbed breeze and coracle steering.'
      }
    ],
    characters: [
      {
        id: 'char-1',
        name: 'Meenakshi',
        role: 'Protagonist',
        description: 'A curious 10-year-old girl who lives with her potter grandfather at the bend of the river.',
        appearance: 'Bright inquisitive eyes, twin braided hair tied with yellow ribbons, carrying a brass water-pot.',
        notes: 'Possesses the rare patience to sit motionless until kingfishers perch nearby.'
      },
      {
        id: 'char-2',
        name: 'Thatha (Subbiah the Potter)',
        role: 'Mentor',
        description: 'Meenakshi\'s gentle grandfather who shapes terracotta bells and speaks to the clay.',
        appearance: 'Weathered hands stained with river silt, silver mustache, cotton veshti.',
        notes: 'Remembers the great floods of 1961 and the ancient course of the distributary canals.'
      }
    ],
    bookNotes: [
      {
        id: 'note-1',
        title: 'Sensory notes for Chapter 3',
        category: 'plot',
        content: 'Emphasize the sudden stillness in the tamarind grove just before the thunderstorm breaks. The smell of petrichor on dried river clay.',
        createdAt: Date.now() - 1000 * 60 * 60 * 20,
        updatedAt: Date.now() - 1000 * 60 * 60 * 20
      }
    ],
    pageSettings: {
      size: 'A5',
      margins: 'normal',
      orientation: 'portrait',
      headerText: 'The River Remembers',
      footerText: 'Shaastra Bal Sahitya',
      showPageNumbers: true,
      chapterNumbering: true
    },
    tocSettings: {
      enabled: true,
      style: 'dots',
      showPageNumbers: true,
      showSubsections: false
    },
    chapters: [
      {
        id: uuidv4(),
        title: 'Prologue: The River Awakes',
        content: `<h1>Prologue: The River Awakes</h1><p class="lead"><em>Before the temple gongs sounded at four in the morning, the Kaveri was already awake.</em></p><p>She moved like a creature of dark silver, sliding past the stone steps of the bathing ghat where sleep still clung to the whitewashed temple towers. On cool mornings, steam rose from the water’s surface in delicate curls, carrying the faint perfume of night-flowering jasmine discarded from yesterday’s festival chariot.</p><p>For fifty miles upstream and fifty miles down, people said the river never spoke to anyone directly. But Meenakshi knew better. If you pressed your ear to the hollow bamboo poles anchored by the ferry dock, you could hear the low humming song of pebbles rolling across the riverbed five feet beneath the current.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 132,
        order: 0,
        blocks: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'Prologue: The River Awakes',
            meta: { headingLevel: 1 }
          },
          {
            id: 'b-2',
            type: 'quote',
            content: 'Before the temple gongs sounded at four in the morning, the Kaveri was already awake.',
            meta: { calloutType: 'quote' }
          },
          {
            id: 'b-3',
            type: 'paragraph',
            content: 'She moved like a creature of dark silver, sliding past the stone steps of the bathing ghat where sleep still clung to the whitewashed temple towers. On cool mornings, steam rose from the water’s surface in delicate curls, carrying the faint perfume of night-flowering jasmine discarded from yesterday’s festival chariot.'
          },
          {
            id: 'b-4',
            type: 'callout',
            content: '💡 <strong>River Lore:</strong> In Thanjavur villages, elders say the Kaveri cleanses not just soil, but the anxious thoughts of anyone who sits silently on her bank for twelve minutes.',
            meta: { calloutType: 'tip' }
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Chapter 1: The Silver Coracle',
        content: `<h2>Chapter 1: The Silver Coracle</h2><p>Meenakshi balanced the wicker basket filled with wet clay on her hip. The morning sun was just peeling through the crowns of the palmyra palms, turning the water into molten copper.</p><p>Near the reed bank, something caught the sunlight—not the usual glint of a discarded soda tin or an empty conch, but a circular craft woven of split cane, lined with tarred buffalo hide so smooth it reflected the sky like a cloudy mirror.</p><p>"Thatha!" she called out, forgetting her grandfather’s strict instruction never to raise one’s voice across the holy waters. "The old fisherman’s parisal is adrift again!"</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 110,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Chapter 2: The Storks Arrive',
        content: `<h2>Chapter 2: The Storks Arrive</h2><p>They appeared first as a white smudge against the pale blue haze of the eastern horizon—a slow, majestic formation that moved with the precision of dancers on an open stage.</p><p>Subbiah stopped his potter\'s wheel with the palm of his hand, leaving a half-formed water jar spinning quietly on its wooden pivot. "Ah," he said softly, squinting into the morning glare. "The guests from the north have kept their appointment."</p><blockquote>"When the painted storks land on the island tamarinds, winter has entered Tamil soil."</blockquote>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 94,
        order: 2
      },
      {
        id: uuidv4(),
        title: 'Chapter 3: The Secret in the Reed Bank',
        content: `<h2>Chapter 3: The Secret in the Reed Bank</h2><p>Deep inside the thicket of tall elephant grass where only water snakes and marsh harriers usually ventured, Meenakshi noticed a strange ring of stones. They were not ordinary basalt boulders; each stone bore faint carvings of five-petaled lotuses and spiral water wheels.</p><p>As she bent closer, she realised the stones formed an ancient sluice gate—a thousand years old, buried under twenty generations of river silt.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 78,
        order: 3
      },
      {
        id: uuidv4(),
        title: 'Chapter 4: The Night of Red Clay',
        content: `<h2>Chapter 4: The Night of Red Clay</h2><p>The monsoon did not arrive with polite drizzle. It slammed into the delta at midnight, whipping the coconut fronds into furious clatter and turning the village cart tracks into torrents of reddish soup.</p><p>Subbiah and Meenakshi worked by the yellow flicker of a hurricane lantern, carrying their unfired clay vessels into the thatched kiln shed before the dampness could melt them back into formless earth.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 76,
        order: 4
      },
      {
        id: uuidv4(),
        title: 'Chapter 5: Songs for the Sea',
        content: `<h2>Chapter 5: Songs for the Sea</h2><p>By fourth sunrise, the waters had subsided into a wide, peaceful expanse of bronze. The river carried gifts: broken branches from the Kodagu hills, wild bamboo shoots, and fragrant wild lemons.</p><p>Meenakshi knelt by the water’s edge and released a small terracotta boat she had shaped during the storm. Inside sat a single yellow oleander flower. "Carry my greeting to Poompuhar and the wide ocean," she whispered, and watched it dance into the main channel.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 84,
        order: 5
      }
    ],
    assets: []
  },

  // 2. Student Guide to Experiential Learning
  {
    id: 'demo-student-guide',
    title: 'Student Guide to Experiential Learning',
    subtitle: 'From Passive Observation to Grounded Inquiry',
    description: 'A handbook guiding secondary and undergraduate students to formulate research questions, conduct ethical fieldwork in Indian communities, maintain structured reflection logs, and construct compelling learning portfolios.',
    type: 'guide',
    blueprintId: 'school_guide',
    tags: ['Student Handbook', 'Experiential Learning', 'Shaastra Framework', 'Inquiry'],
    isFavorite: true,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
    authorName: 'Shaastra Curriculum Group',
    publisher: 'Shaastra Educational Press',
    language: 'English',
    genre: 'Instructional & Academic Guide',
    targetAudience: 'Secondary, Higher Secondary & College Students',
    copyrightYear: 2026,
    isbn: '978-81-945621-1-1',
    cover: {
      title: 'Student Guide to Experiential Learning',
      subtitle: 'From Passive Observation to Grounded Inquiry',
      author: 'Shaastra Curriculum Group',
      bgColor: '#1E3A8A',
      textColor: '#FFFFFF',
      accentColor: '#F59E0B',
      styleTemplate: 'academic',
      alignment: 'left',
      borderStyle: 'modern'
    },
    frontMatter: {
      titlePage: {
        enabled: true,
        title: 'Student Guide to Experiential Learning',
        subtitle: 'From Passive Observation to Grounded Inquiry',
        author: 'Shaastra Curriculum Group',
        publisher: 'Shaastra Educational Press, Bengaluru',
        year: 2026
      },
      preface: {
        enabled: true,
        title: 'Why Experiential Learning Matters Today',
        content: 'In an era where textbooks can be digitised and information recalled at the tap of a button, real education lies in direct sensory contact with human reality. Experiential learning invites you to step out of the lecture hall and look at your community through the dual lenses of scientific rigor and empathy.'
      }
    },
    chapters: [
      {
        id: uuidv4(),
        title: 'Orientation & Learning Charter',
        content: `<h1>Orientation & Learning Charter</h1><p class="lead">Experiential learning is not an extracurricular diversion; it is the cornerstone of true intellectual competence.</p><p>As a student undertaking a Shaastra inquiry project, you commit to five non-negotiable principles:</p><ul><li><strong>Active Observation:</strong> Noticing what others dismiss as ordinary background noise.</li><li><strong>Ethical Respect:</strong> Never treating community members as passive subjects of an experiment.</li><li><strong>Evidence Integrity:</strong> Recording observations exactly as they occur, without fudging data to match expectations.</li><li><strong>Critical Reflection:</strong> Connecting field notes to fundamental economic, ecological, or physical laws.</li><li><strong>Artifact Creation:</strong> Synthesising your findings into a durable book or document.</li></ul>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 112,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Module 1: The Spirit of Active Inquiry',
        content: `<h2>Module 1: The Spirit of Active Inquiry</h2><p>Most research begins with a bad question. A question like <em>"Why are village roads poor?"</em> leads only to complaints. But an inquiry formulated as: <em>"How do monsoon drainage patterns on the southern slope of Ward 4 affect vegetable cart transit times to the weekly mandi?"</em> provides a concrete, measurable roadmap.</p><p>In this module, you will practice transforming broad societal anxieties into testable field hypotheses.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 82,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Module 2: Field Activity Frameworks',
        content: `<h2>Module 2: Field Activity Frameworks</h2><p>Preparation is the difference between an enlightening field visit and an aimless walk. Before departing your campus:</p><ol><li>Verify that your observation logbook has waterproof protective wrapping.</li><li>Agree with your team on standardized recording metrics (e.g. measuring queue times in minutes rather than descriptors like 'long' or 'short').</li><li>Seek explicit verbal or written consent before taking photographs of workspaces or artisanal processes.</li></ol>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 78,
        order: 2
      },
      {
        id: uuidv4(),
        title: 'Module 3: Structured Reflection Logs',
        content: `<h2>Module 3: Structured Reflection Logs</h2><p>Experience without reflection is merely physical fatigue. At the close of every field day, reserve sixty uninterrupted minutes for your structured logbook. Ask yourself:</p><blockquote>"What surprised me today? What contradicted my initial assumption? What mathematical or social pattern explains this divergence?"</blockquote>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 56,
        order: 3
      },
      {
        id: uuidv4(),
        title: 'Module 4: Building the Portfolio Artifact',
        content: `<h2>Module 4: Building the Portfolio Artifact</h2><p>Your final submission must not be a stapled sheaf of photocopies. Using Book Builder Shaastra, you will compile an archival publication complete with table of contents, high-resolution diagrams, interview transcripts, and policy proposals that can be gifted back to the local panchayat or library.</p>`,
        isBookmarked: false,
        status: 'draft',
        wordCount: 60,
        order: 4
      }
    ],
    assets: []
  },

  // 3. Teacher Guide to Shaastra Edusystem
  {
    id: 'demo-teacher-guide',
    title: 'Teacher Guide to Shaastra Edusystem',
    subtitle: 'Pedagogy of Curiosity, Dignity, and Evidence',
    description: 'A comprehensive handbook for teachers and school administrators implementing experiential curricula, continuous formative diagnosis, peer mentoring circles, and non-punitive evaluation environments.',
    type: 'handbook',
    blueprintId: 'teacher_handbook',
    tags: ['Pedagogy', 'Teacher Training', 'Curriculum Design', 'NEP Aligned'],
    isFavorite: false,
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 35,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
    authorName: 'Prof. K. Venkateswaran',
    publisher: 'Shaastra Institute of Educational Research',
    language: 'English',
    genre: 'Professional Educator Handbook',
    copyrightYear: 2026,
    chapters: [
      {
        id: uuidv4(),
        title: 'Philosophical Grounding',
        content: `<h1>Philosophical Grounding</h1><p>The traditional Indian classroom has for too long suffered under the shadow of the one-way lecture—an architectural and pedagogical arrangement where the teacher speaks and fifty pupils transcribe silently.</p><p>The Shaastra approach asserts that <strong>understanding is constructed through dialogue and craftsmanship</strong>. The educator does not arrive as an omniscient authority, but as a master builder who sets up safe scaffolds within which learners confront genuine questions.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 84,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Classroom Architecture & Dynamics',
        content: `<h2>Classroom Architecture & Dynamics</h2><p>Desks arranged in rigid rows train children for factory assembly lines. To foster collaborative research, transform your physical room into dynamic inquiry clusters:</p><ul><li><strong>The Laboratory Hearth:</strong> A central bench for shared apparatus and demonstration.</li><li><strong>The Scribe Table:</strong> Equipped with reference encyclopedias, dictionaries, and draft registers.</li><li><strong>The Agora:</strong> A circular seating rug where seminar debates and project defenses occur weekly.</li></ul>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 75,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Designing Experiential Units',
        content: `<h2>Designing Experiential Units</h2><p>Every four-week unit must culminate in a public artifact. Rather than asking students to memorise the periodic table for a twenty-mark test, challenge them to research the chemical stability of local building materials and publish an informational guide for village masons.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 48,
        order: 2
      }
    ],
    assets: []
  },

  // 4. Parent Guide: Nurturing Inquisitive Minds
  {
    id: 'demo-parent-guide',
    title: 'Parent Guide: Nurturing Inquisitive Minds',
    subtitle: 'Daily Rhythms for Fostering Wonder at Home',
    description: 'An empathetic, grounded manual offering Indian parents practical alternatives to excessive screen-time, competitive coaching pressure, and passive entertainment by reviving reading rituals and dinner-table dialogues.',
    type: 'guide',
    blueprintId: 'parent_guide',
    tags: ['Parenting', 'Home Learning', 'Child Development', 'Mental Wellness'],
    isFavorite: false,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    authorName: 'Dr. Radhika Krishnakumar',
    publisher: 'Shaastra Family Press',
    language: 'English',
    genre: 'Parenting & Family Education',
    copyrightYear: 2026,
    chapters: [
      {
        id: uuidv4(),
        title: 'Introduction: The Home as a Laboratory',
        content: `<h1>Introduction: The Home as a Laboratory</h1><p>We often assume that learning happens only inside institutions with chalkboards and bells. Yet the most profound mathematical lessons happen when measuring lentils for dinner, and the most durable biological curiosity is sparked by watching ants navigate the kitchen window sill.</p><p>When parents shift from interrogation (<em>"What marks did you score today?"</em>) to co-investigation (<em>"What was the most surprising thing you noticed today?"</em>), a child\'s fear of failure vanishes.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 88,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Cultivating Reading Rituals',
        content: `<h2>Cultivating Reading Rituals</h2><p>Children do not imitate our advice; they imitate our habits. If an entire household spends the hours between 7 PM and 9 PM glued to smartphone notification reels, no amount of scolding will turn a child into an avid reader.</p><p>Establish a daily thirty-minute <strong>"Silent Reading Hearth"</strong> where all devices are placed in a decorative wicker box and everyone—adults included—opens a printed book.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 78,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Balancing Digital Engagement & Nature',
        content: `<h2>Balancing Digital Engagement & Nature</h2><p>Digital tools are instruments of creation, not pacifiers for restless toddlers. Encourage children to use Book Builder Shaastra to document their own weekend plant experiments, bird counts, or family recipes rather than passively consuming short-form video loops.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 50,
        order: 2
      }
    ],
    assets: []
  },

  // 5. Economics of Grassroots Enterprise in Rural Tamil Nadu (Academic Research)
  {
    id: 'demo-economics-research',
    title: 'Economics of Grassroots Enterprise in Rural Tamil Nadu',
    subtitle: 'An Empirical Field Study across 42 Micro-Enterprises in Thanjavur District',
    description: 'A formal socio-economic research report examining credit access, working capital velocity, artisanal supply chains, and technological adoption among handloom weavers, bronze casters, and terracotta cooperatives.',
    type: 'research',
    blueprintId: 'academic_research',
    tags: ['Economics', 'Rural Enterprise', 'Field Research', 'Policy Paper'],
    isFavorite: true,
    status: 'review',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
    authorName: 'Dr. S. Rangarajan & M. Deepa',
    publisher: 'Centre for Rural Development & Shaastra Policy Forum',
    language: 'English',
    genre: 'Economic Monograph & Research',
    copyrightYear: 2026,
    isbn: '978-81-945621-4-2',
    references: [
      {
        id: 'ref-econ-1',
        type: 'journal',
        author: 'Banerjee, A., & Duflo, E.',
        title: 'The Miracle of Microfinance? Evidence from a Randomized Evaluation',
        publisher: 'American Economic Journal: Applied Economics',
        year: '2015',
        notes: 'Comparison of interest rates vs informal money lenders.'
      },
      {
        id: 'ref-econ-2',
        type: 'report',
        author: 'NABARD',
        title: 'Status of Microfinance in India 2024-25',
        publisher: 'National Bank for Agriculture and Rural Development',
        year: '2025',
        notes: 'Official state-wise credit deployment data.'
      }
    ],
    chapters: [
      {
        id: uuidv4(),
        title: 'Abstract & Executive Summary',
        content: `<h1>Abstract & Executive Summary</h1><p class="lead">Micro and small informal enterprises constitute over 84% of non-farm rural livelihoods in Thanjavur district, yet their capacity for sustained capital accumulation remains severely curtailed by informal debt structures.</p><p>This study draws on rigorous field interviews, balance-sheet reconstructions, and seasonal cash-flow audits across 42 grassroots enterprises in five taluks. Our data reveals that while headline access to formal banking has risen under digital KYC initiatives, effective credit delivery remains bottlenecked by collateral demands that artisanal units cannot satisfy.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 96,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Introduction & Regional Context',
        content: `<h2>Introduction & Regional Context</h2><p>The delta region of the Kaveri has historically functioned as both an agricultural granary and a center of high-value artistic crafts—most notably Swamimalai bronze casting, Thirubuvanam silk weaving, and Nachiarkoil brass lamp making.</p><p>However, the transition from generational patron-client relationships to open commodity markets has exposed rural producers to brutal price volatility in raw copper, tin, and mulberry silk.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 75,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Methodology & Field Sampling',
        content: `<h2>Methodology & Field Sampling</h2><p>Data was gathered over a nine-month period between January and September 2025. Sampling was stratified across three distinct enterprise archetypes:</p><ul><li>Family-owned hereditary workshops (&lt; 3 workers)</li><li>Informal worker collectives (4–12 workers)</li><li>Registered cooperative federations (&gt; 15 workers)</li></ul>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 52,
        order: 2
      },
      {
        id: uuidv4(),
        title: 'Empirical Findings & Data Tables',
        content: `<h2>Empirical Findings & Data Tables</h2><p>Average daily wages in informal bronze casting fluctuated between ₹450 and ₹850, directly correlated with seasonal temple festival orders. Working capital cycles averaged 48 days, forcing 68% of proprietors to borrow short-term cash from local intermediaries at effective annual APRs exceeding 36%.</p>`,
        isBookmarked: true,
        status: 'review',
        wordCount: 58,
        order: 3
      }
    ],
    assets: []
  },

  // 6. The Mist Over Kodaikanal (Fiction Novel)
  {
    id: 'demo-fiction-kodaikanal',
    title: 'The Mist Over Kodaikanal',
    subtitle: 'A Hill Station Mystery in Nine Chapters',
    description: 'When an eccentric botanist disappears from his greenhouse above Pillar Rocks, an archivist from the Madras Literary Society is drawn into a labyrinth of colonial botanical secrets, forgotten land grants, and mountain mist.',
    type: 'novel',
    blueprintId: 'fiction_novel',
    tags: ['Fiction', 'Literary Mystery', 'Nilgiri Setting', 'Novel'],
    isFavorite: true,
    status: 'draft',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    updatedAt: Date.now() - 1000 * 60 * 60 * 1,
    authorName: 'Vikramaditya Iyer',
    publisher: 'Shaastra Fiction Workshop',
    language: 'English',
    genre: 'Literary Mystery',
    copyrightYear: 2026,
    characters: [
      {
        id: 'char-vik-1',
        name: 'Raghavan Pillai',
        role: 'Protagonist',
        description: 'Quiet, methodical archivist from the Madras Literary Society who restores brittle 19th-century manuscripts.',
        appearance: 'Thin frame, wire-rimmed spectacles, tweed coat worn thin at the elbows.',
        notes: 'Suffers from chronic insomnia; walks the hill station paths at 3 AM.'
      },
      {
        id: 'char-vik-2',
        name: 'Dr. Christopher Douglas',
        role: 'Supporting',
        description: 'Missing 74-year-old Scottish-Indian botanist who spent forty years breeding rare terrestrial orchids.',
        notes: 'Believed to possess an unrecorded 1888 land survey map.'
      }
    ],
    chapters: [
      {
        id: uuidv4(),
        title: 'Prologue: The Shadow Cast',
        content: `<h1>Prologue: The Shadow Cast</h1><p class="lead"><em>Fog in Kodaikanal does not fall from the sky; it rises from the deep ravines like cold steam from a witch’s copper cauldron.</em></p><p>By four in the afternoon, Coaker’s Walk had ceased to exist. The valley below—with its terraced pear orchards and cluster of tin-roofed cottages—had dissolved into an impenetrable wall of white dampness. It was the sort of silence that felt alive, swallowing footsteps, the caw of mountain ravens, and the distant hum of bus diesel engines.</p><p>In the glasshouse perched on the cliff edge, the oil lamp remained lit. The tea in Dr. Douglas\'s porcelain mug was still lukewarm. But the botanist himself was gone, leaving behind only the open ledger of his <em>Flora Palniensis</em> and a damp pair of gardening shears driven deep into a tray of freshly watered moss.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 154,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Chapter 1: The Quiet Hill Town',
        content: `<h2>Chapter 1: The Quiet Hill Town</h2><p>Raghavan stepped off the battered state transport bus at seven the next morning, his joints aching from twelve hours of hairpin bends ascending from the plains of Batlagundu.</p><p>The air smelled of eucalyptus smoke and damp pine needles. He pulled his muffler tighter around his chin and looked up at the gothic spire of the English church piercing through the vapor. He had come here to catalog old parish birth registers, not to investigate a missing person. But Kodaikanal had a way of entangling anyone who crossed the lake before sunrise.</p>`,
        isBookmarked: false,
        status: 'draft',
        wordCount: 104,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Chapter 2: The Unwelcome Discovery',
        content: `<h2>Chapter 2: The Unwelcome Discovery</h2><p>The latch to the greenhouse door had not been forced; it had been opened with a brass key that now dangled from the exterior lock. Inside, amidst the heavy scent of crushed ferns and damp loam, Raghavan discovered a folded sheet of vellum tucked beneath the ledger\'s calfskin spine.</p><p>It was not a botanical illustration. It was a handwritten receipt dated November 1947, acknowledging the deposit of a wooden deed-box in the vaults of the Imperial Bank of India.</p>`,
        isBookmarked: true,
        status: 'draft',
        wordCount: 92,
        order: 2
      }
    ],
    assets: []
  },

  // 7. Shaastra Student Science Workbook: Class IX
  {
    id: 'demo-science-workbook',
    title: 'Shaastra Student Science Workbook: Class IX',
    subtitle: 'Hands-on Experiments, Observation Records & Inquiry Logs',
    description: 'A student laboratory companion featuring structured inquiry worksheets, hypothesis tables, equipment checklists, and community capstone reflections aligned with contemporary science curricula.',
    type: 'workbook',
    blueprintId: 'student_workbook',
    tags: ['Science Workbook', 'Class 9', 'Laboratory Records', 'STEM'],
    isFavorite: false,
    status: 'final',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 18,
    authorName: 'Shaastra Science Collective',
    publisher: 'Shaastra Schools Division',
    language: 'English',
    genre: 'Student Science Workbook',
    copyrightYear: 2026,
    chapters: [
      {
        id: uuidv4(),
        title: 'Laboratory Safety & Inquiry Code',
        content: `<h1>Laboratory Safety & Inquiry Code</h1><p class="lead">Science is not what is written in the textbook; science is what you can verify through honest, careful measurement.</p><p>Before beginning any investigation in this workbook:</p><ol><li>Inspect all glassware for hairline fractures before applying heat.</li><li>Never taste, smell directly, or touch unfamiliar chemical salts or plant extracts.</li><li>Record anomalous or 'unexpected' results honestly. Some of history’s greatest discoveries occurred when experiments appeared to fail!</li></ol>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 80,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Investigation 1: Flora Diversity Survey',
        content: `<h2>Investigation 1: Flora Diversity Survey</h2><p><strong>Objective:</strong> To measure plant species richness within a one-meter square quadrant on the school playground border.</p><p><strong>Apparatus:</strong> Four wooden pegs, 4 meters of jute twine, magnifying hand lens, metric ruler, specimen envelopes.</p><p><strong>Hypothesis:</strong> The shaded soil beneath the neem tree will host fewer flowering angiosperms but higher moss and lichen density than the sunlit football ground perimeter.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 76,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Investigation 2: Water Quality & Turbidity',
        content: `<h2>Investigation 2: Water Quality & Turbidity</h2><p><strong>Objective:</strong> Compare transparency and suspended particulate count between tap water, open well water, and rain runoff.</p><p><strong>Method:</strong> Build a simple Secchi disk using a plastic jar lid painted in alternating black and white quadrants, attached to a graduated nylon cord.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 54,
        order: 2
      }
    ],
    assets: []
  },

  // 8. Institutional Implementation Framework for NEP 2020
  {
    id: 'demo-nep-framework',
    title: 'Institutional Implementation Framework for NEP 2020',
    subtitle: 'Strategic Roadmap for Multidisciplinary Higher Education Governance',
    description: 'A comprehensive operational whitepaper designed for chancellors, deans, and academic councils detailing the transition toward flexible credit choice systems, regional language pedagogy, and vocational apprenticeships.',
    type: 'report',
    blueprintId: 'nep_implementation',
    tags: ['NEP 2020', 'Higher Education', 'Policy Framework', 'Institutional Governance'],
    isFavorite: false,
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 50,
    updatedAt: Date.now() - 1000 * 60 * 60 * 8,
    authorName: 'Shaastra Policy & Governance Council',
    publisher: 'Shaastra University Press',
    language: 'English',
    genre: 'Policy Framework & Institutional Whitepaper',
    copyrightYear: 2026,
    isbn: '978-81-945621-8-0',
    chapters: [
      {
        id: uuidv4(),
        title: 'Executive Mandate & Vision',
        content: `<h1>Executive Mandate & Vision</h1><p class="lead">The National Education Policy 2020 envisions an educational architecture that dismantling the rigid disciplinary boundaries dividing sciences, arts, and professional vocations.</p><p>For institutions transitioning from affiliate models to autonomous degree-granting universities, this framework provides operational timelines, credit transfer protocols, and faculty retraining modules necessary to achieve compliance without compromising intellectual depth.</p>`,
        isBookmarked: true,
        status: 'final',
        wordCount: 72,
        order: 0
      },
      {
        id: uuidv4(),
        title: 'Curricular Restructuring (5+3+3+4)',
        content: `<h2>Curricular Restructuring (5+3+3+4)</h2><p>The restructuring demands that foundational years emphasize mother-tongue immersion and sensory play. In the secondary tier, students must have the liberty to combine physics with classical music, or computer coding with constitutional law, supported by an Academic Bank of Credits (ABC) digital ledger.</p>`,
        isBookmarked: false,
        status: 'final',
        wordCount: 58,
        order: 1
      },
      {
        id: uuidv4(),
        title: 'Vocational & Experiential Integration',
        content: `<h2>Vocational & Experiential Integration</h2><p>No student should graduate with a bachelor\'s degree without at least 120 contact hours in a hands-on local workshop, agricultural cooperative, or industrial laboratory. Vocational credits must carry equal academic weight to theoretical lecture hours.</p>`,
        isBookmarked: false,
        status: 'in_progress',
        wordCount: 50,
        order: 2
      }
    ],
    assets: []
  }
];

export const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Shaastra Delta Ecological Publications',
    description: 'An integrated multi-book initiative publishing children’s river literature, botanical guides, and water policy studies across the Kaveri basin.',
    category: 'Ecology & Community',
    bookIds: ['demo-river-remembers', 'demo-economics-research'],
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
    bookIds: ['demo-student-guide', 'demo-teacher-guide', 'demo-parent-guide', 'demo-nep-framework'],
    notes: 'Drafting unified rubrics and glossary of terms across Hindi, Tamil, and English editions.',
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6
  }
];

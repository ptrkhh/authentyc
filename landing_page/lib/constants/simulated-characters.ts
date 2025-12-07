/**
 * Simulated Character Templates
 *
 * Pre-generated diverse character profiles for demo purposes.
 * Each category (hiring, dating, founder) has templates with varying
 * compatibility scores to show realistic matching scenarios.
 */

import type { SimulatedCharacter, Category } from '@/components/landing/SimulationResults';

export interface CharacterTemplate {
  names: string[];
  roles: string[];
  avatarColors: string[];
  alignmentTemplates: string[][];
  challengeTemplates: string[][];
  matchScoreRange: [number, number];
}

// Character templates by category
export const CHARACTER_TEMPLATES: Record<Category, CharacterTemplate> = {
  hiring: {
    names: [
      'TechNova Solutions',
      'Quantum Leap Systems',
      'BlueSky Analytics',
      'Nebula Innovations',
      'Apex Dynamics',
      'Horizon Digital',
      'Vertex Ventures',
      'EchoStream Media'
    ],
    roles: [
      'Senior Software Engineer',
      'Product Manager',
      'Engineering Manager',
      'Staff Engineer',
      'Technical Lead',
      'Senior Product Designer',
      'Senior Data Scientist',
      'Engineering Director'
    ],
    avatarColors: [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ],
    alignmentTemplates: [
      [
        'Both value direct, transparent communication',
        'Share a data-driven approach to decision-making',
        'Prefer structured feedback and clear expectations'
      ],
      [
        'Both thrive in collaborative, team-oriented environments',
        'Value work-life balance and sustainable pace',
        'Enjoy mentoring and knowledge sharing'
      ],
      [
        'Both prefer autonomy and ownership over micromanagement',
        'Share a bias toward action and iteration',
        'Value impact and results over process'
      ],
      [
        'Both appreciate thoughtful, detail-oriented work',
        'Prefer asynchronous communication and deep work time',
        'Value technical excellence and craft'
      ],
      [
        'Both excel at cross-functional collaboration',
        'Share enthusiasm for learning new technologies',
        'Prefer fast-paced, dynamic environments'
      ]
    ],
    challengeTemplates: [
      [
        'May need to align on preferred meeting frequency',
        'Different approaches to handling ambiguity'
      ],
      [
        'Potential mismatch in desired level of structure',
        'May differ on work hour flexibility expectations'
      ],
      [
        'Could have different communication style preferences',
        'May need to clarify decision-making authority'
      ],
      [
        'Different comfort levels with public visibility',
        'May need to sync on documentation expectations'
      ],
      [
        'Potential differences in risk tolerance',
        'May need to align on technical vs. business priorities'
      ]
    ],
    matchScoreRange: [62, 94]
  },
  dating: {
    names: [
      'Emma Rodriguez',
      'Ryan Patel',
      'Olivia Chang',
      'Noah Williams',
      'Sophia Jensen',
      'Ethan Kim',
      'Ava Thompson',
      'Liam Foster'
    ],
    roles: [
      'Creative Professional',
      'Entrepreneur',
      'Teacher',
      'Software Developer',
      'Marketing Manager',
      'Research Scientist',
      'Designer',
      'Financial Analyst'
    ],
    avatarColors: [
      'bg-rose-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500'
    ],
    alignmentTemplates: [
      [
        'Both value deep conversations and intellectual connection',
        'Share similar energy levels and social preferences',
        'Align on importance of personal growth and self-reflection'
      ],
      [
        'Both enjoy adventure and trying new experiences',
        'Share a playful sense of humor and spontaneity',
        'Value quality time and shared activities'
      ],
      [
        'Both prioritize emotional openness and vulnerability',
        'Share similar conflict resolution styles',
        'Align on need for alone time and independence'
      ],
      [
        'Both value stability and long-term planning',
        'Share similar lifestyle preferences and routines',
        'Align on financial values and goals'
      ],
      [
        'Both enjoy creative pursuits and cultural activities',
        'Share appreciation for thoughtful gestures',
        'Value meaningful traditions and rituals'
      ]
    ],
    challengeTemplates: [
      [
        'May need to balance different social energy needs',
        'Could have different preferences for weekend activities'
      ],
      [
        'Different communication styles under stress',
        'May need to align on relationship pace expectations'
      ],
      [
        'Potential differences in expressing affection',
        'May need to navigate different family dynamics'
      ],
      [
        'Different approaches to planning vs. spontaneity',
        'Could have varying comfort with public displays of affection'
      ],
      [
        'May need to balance different career ambitions',
        'Could have different preferences for living environment'
      ]
    ],
    matchScoreRange: [58, 92]
  },
  founder: {
    names: [
      'David Park',
      'Maya Santos',
      'James Wilson',
      'Zara Ahmed',
      'Chris Lee',
      'Nina Gupta',
      'Tyler Brown',
      'Rachel Cohen'
    ],
    roles: [
      'Serial Entrepreneur',
      'Technical Co-founder',
      'Growth Expert',
      'Product Visionary',
      'Operations Leader',
      'Design Leader',
      'Sales & BD Expert',
      'Former VC Associate'
    ],
    avatarColors: [
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500'
    ],
    alignmentTemplates: [
      [
        'Both embrace calculated risk and rapid iteration',
        'Share bias for action over extensive planning',
        'Align on building for real user feedback early'
      ],
      [
        'Both value clear role definition and accountability',
        'Share commitment to transparent communication',
        'Align on importance of work-life integration'
      ],
      [
        'Both have complementary skill sets and expertise',
        'Share similar fundraising philosophy and approach',
        'Align on company culture and values'
      ],
      [
        'Both bring strong network and domain expertise',
        'Share similar vision for company scale and timeline',
        'Value data-driven decision-making'
      ],
      [
        'Both have track record of building and shipping',
        'Share realistic expectations about startup challenges',
        'Align on equity split and commitment level'
      ]
    ],
    challengeTemplates: [
      [
        'May need to clarify decision-making in deadlocks',
        'Different comfort levels with debt vs. equity'
      ],
      [
        'Potential differences in desired growth pace',
        'May need to align on hiring philosophy'
      ],
      [
        'Different preferences for remote vs. in-person work',
        'Could have varying tolerance for technical debt'
      ],
      [
        'May need to navigate different leadership styles',
        'Could differ on when to pivot vs. persevere'
      ],
      [
        'Different approaches to delegating vs. doing',
        'May need to align on customer segment priorities'
      ]
    ],
    matchScoreRange: [65, 93]
  }
};

/**
 * Generates 5 diverse simulated characters for a given category.
 * In a real implementation, this would use LLM analysis of the user's
 * chat history. For demo purposes, we use pre-defined templates.
 */
export function generateSimulatedCharacters(category: Category): SimulatedCharacter[] {
  const template = CHARACTER_TEMPLATES[category];
  const characters: SimulatedCharacter[] = [];

  // Generate 5 diverse characters with varying match scores
  const matchScores = [
    template.matchScoreRange[1] - 2, // High match
    template.matchScoreRange[1] - 10, // Good match
    Math.floor((template.matchScoreRange[0] + template.matchScoreRange[1]) / 2), // Medium match
    template.matchScoreRange[0] + 10, // Lower match
    template.matchScoreRange[0] + 5  // Low match
  ];

  for (let i = 0; i < 5; i++) {
    const nameIndex = Math.floor(Math.random() * template.names.length);
    const roleIndex = Math.floor(Math.random() * template.roles.length);
    const alignmentIndex = i % template.alignmentTemplates.length;
    const challengeIndex = i % template.challengeTemplates.length;

    characters.push({
      id: `${category}-${i}`,
      name: template.names[nameIndex],
      role: template.roles[roleIndex],
      avatarColor: template.avatarColors[i % template.avatarColors.length],
      matchScore: matchScores[i],
      alignment: template.alignmentTemplates[alignmentIndex],
      challenges: template.challengeTemplates[challengeIndex],
      category
    });
  }

  // Sort by match score descending
  return characters.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * In the future, this function could be replaced with actual LLM-based generation:
 *
 * export async function generateSimulatedCharactersWithLLM(
 *   chatAnalysis: string,
 *   category: Category
 * ): Promise<SimulatedCharacter[]> {
 *   const response = await openai.chat.completions.create({
 *     model: 'gpt-4',
 *     messages: [
 *       {
 *         role: 'system',
 *         content: `Generate 5 diverse ${category} matches based on this personality analysis...`
 *       },
 *       { role: 'user', content: chatAnalysis }
 *     ]
 *   });
 *   // Parse and return characters
 * }
 */

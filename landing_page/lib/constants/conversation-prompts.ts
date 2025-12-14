/**
 * Conversation Starter Prompts
 *
 * Pre-written prompts users can copy to ChatGPT to generate
 * authentic conversations for personality analysis.
 */

export interface ConversationPrompt {
  category: 'hiring' | 'dating' | 'founder';
  title: string;
  prompt: string;
  description: string;
}

export const CONVERSATION_PROMPTS: ConversationPrompt[] = [
  {
    category: 'hiring',
    title: 'Career Goals',
    prompt: `PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, details, or patterns from our history?
- How many different conversations/time periods does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my career, skills, or work preferences. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "works in tech") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity (e.g., you know my role and a few technical skills), but significant gaps remain. Missing either:
- Technical details (specific skills, technologies, proficiency levels, projects), OR
- Non-technical aspects (work style, preferences, values, communication patterns)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH technical and non-technical insights, but some aspects lack depth or recent updates.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different time periods. You have:
- Detailed technical knowledge (specific skills, technologies, proficiency levels, preferred tools, architectural preferences)
- Deep non-technical understanding (work style, values, communication preferences, what energizes/drains me)
- Evidence from at least 3+ separate conversations over time
- Recent data (within last few months)

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include approximate timeframes like "In our conversation about [topic] a few weeks ago..." or "Based on multiple discussions over the past months...". If rating is below 7, explicitly state what's missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your work, projects, and career over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific technical skills, programming languages, frameworks, and proficiency levels (e.g., "expert in React and TypeScript, comfortable with Python for data analysis")
- Cites specific examples from past conversations (e.g., "As mentioned in our discussion about [project]...")
- Includes work style, preferences, and values with concrete examples
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you'd like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. What aspects of your current or most recent role energize you the most, and what drains you?
2. Describe a recent work challenge you handled well - what was your approach?
3. What does your ideal work environment look like? (team size, pace, structure, autonomy)
4. What are you optimizing for in your next role? (learning, impact, compensation, flexibility, etc.)
5. How do you prefer to receive feedback and recognition?
6. What kind of problems or projects do you want to spend most of your time on?
7. What would make you excited to start work each day?

Begin with PHASE 1 assessment.`,
    description: 'Reveals work style, problem-solving approach, and professional values',
  },
  {
    category: 'dating',
    title: 'Relationship Goals',
    prompt: `PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, personality insights, or patterns from our history?
- How many different conversations/contexts does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my personality, values, or lifestyle. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "lives in [city]") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity, but significant gaps remain. Missing either:
- Lifestyle/interests details (hobbies, activities, daily routines, preferences), OR
- Emotional/relational aspects (communication style, conflict resolution, values, emotional needs)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH lifestyle and emotional insights, drawn from multiple conversations, but some aspects lack depth.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different contexts. You have:
- Detailed lifestyle knowledge (hobbies, interests, routines, preferences, social patterns)
- Deep personality understanding (communication style, emotional patterns, values, stress responses)
- Evidence from at least 3+ separate conversations over time
- Examples from different life contexts (work, relationships, challenges, joys)

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include contexts like "When you discussed [situation]..." or "Based on multiple conversations about [topic]...". If rating is below 7, explicitly state what's missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your life, interests, and experiences over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific lifestyle preferences, hobbies, interests, and personality traits (e.g., "enjoys hiking and outdoor photography", "values deep intellectual conversations", "introverted but enjoys small group settings")
- Cites specific examples from past conversations (e.g., "As you mentioned when discussing [experience]...")
- Includes communication style, emotional patterns, and values with concrete examples
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you'd like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. What does a typical 'good day' look like for you? What small things matter most?
2. Think of a recent disagreement or frustration - how did you handle it and what would your ideal resolution have looked like?
3. What do you need from a partner when you're stressed or going through a difficult time?
4. What activities or experiences do you want to share regularly with a partner?
5. How do you like to show care and appreciation to people you're close to?
6. What values or dealbreakers are non-negotiable for you in a relationship?
7. What does 'quality time together' mean to you - what does it look like in practice?

Begin with PHASE 1 assessment.`,
    description: 'Shows authentic personality, communication style, and emotional intelligence',
  },
  {
    category: 'founder',
    title: 'Startup & Team Fit',
    prompt: `PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, business insights, or patterns from our history?
- How many different conversations/contexts does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my professional background, skills, or working style. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "interested in startups") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity, but significant gaps remain. Missing either:
- Technical/domain expertise (specific skills, industry experience, business domains, strengths/weaknesses), OR
- Collaboration/leadership aspects (decision-making style, working patterns, team dynamics, communication preferences)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH technical and interpersonal insights, but some aspects lack depth or concrete examples.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different contexts. You have:
- Detailed technical/domain knowledge (skills, industry experience, business domains like "B2B SaaS" or "fintech", specific strengths in areas like product, engineering, sales)
- Deep collaboration understanding (decision-making patterns, leadership style, team dynamics, conflict resolution, communication preferences)
- Evidence from at least 3+ separate conversations over time
- Examples of past projects, startups, or entrepreneurial experiences

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include contexts like "In our discussions about [project/business]..." or "Based on conversations about [topic]...". If rating is below 7, explicitly state what's missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your projects, business ideas, and professional experiences over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific technical skills, industry experience, and business domains (e.g., "experienced in B2B SaaS with background in fintech", "strong in product development and technical architecture, less experienced in sales")
- Cites specific examples from past conversations (e.g., "As demonstrated in your work on [project]...")
- Includes decision-making style, collaboration patterns, and leadership approach with concrete examples
- Mentions any previous startup or entrepreneurial experience
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you'd like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. Walk me through how you typically make important decisions under time pressure or uncertainty.
2. Describe a past collaboration that went really well - what made it work?
3. When you've worked with others who have different working styles than you, what challenges came up and how did you handle them?
4. What energizes you most about building something new? What parts do you tend to avoid or procrastinate on?
5. How do you prefer to divide responsibilities and make decisions in a team? (consensus, delegation, other?)
6. What kind of feedback, communication, or support do you need from co-founders or teammates?
7. What would be a dealbreaker for you in a co-founder or early team member?

Begin with PHASE 1 assessment.`,
    description: 'Reveals collaboration style, decision-making patterns, and leadership approach',
  },
];

export function getPromptByCategory(category: 'hiring' | 'dating' | 'founder'): ConversationPrompt {
  return CONVERSATION_PROMPTS.find(p => p.category === category) || CONVERSATION_PROMPTS[3];
}

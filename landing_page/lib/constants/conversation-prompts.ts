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
    prompt: "PRIMARY DIRECTIVE: You will be asking me several questions. Skip the question you can already answer based on everything you know about me from our past chats. When all questions have been answered, write a detailed summary based on the answers AND everything you know from our past chats, IMPORTANT: Your final response must ONLY be the summary. Do not add any closing remarks, offers for further assistance, or suggestions for next steps. Do not say 'If you'd like...'.\n\nI'm exploring my career direction.Based on everything you know about me from our past chats, please interview me about what I'm looking for in my next role. Ask me the following questions one at a time (skip any you can already answer based on our history)\n\n1. What aspects of your current or most recent role energize you the most, and what drains you?\n2. Describe a recent work challenge you handled well - what was your approach?\n3. What does your ideal work environment look like? (team size, pace, structure, autonomy)\n4. What are you optimizing for in your next role? (learning, impact, compensation, flexibility, etc.)\n5. How do you prefer to receive feedback and recognition?\n6. What kind of problems or projects do you want to spend most of your time on?\n7. What would make you excited to start work each day?\n\nStart with your first question that you can't answer from our history.",
    description: 'Reveals work style, problem-solving approach, and professional values',
  },
  {
    category: 'dating',
    title: 'Relationship Goals',
    prompt: "PRIMARY DIRECTIVE: You will be asking me several questions. Skip the question you can already answer based on everything you know about me from our past chats. When all questions have been answered, write a detailed summary based on the answers AND everything you know from our past chats, IMPORTANT: Your final response must ONLY be the summary. Do not add any closing remarks, offers for further assistance, or suggestions for next steps. Do not say 'If you'd like...'.\n\nI want to reflect on what I'm looking for in a life partner.Based on everything you know about me from our past chats, please ask me the following questions one at a time(skip any you can already answer based on our history): \n\n1.What does a typical 'good day' look like for you ? What small things matter most?\n2.Think of a recent disagreement or frustration - how did you handle it and what would your ideal resolution have looked like ?\n3.What do you need from a partner when you're stressed or going through a difficult time?\n4. What activities or experiences do you want to share regularly with a partner?\n5. How do you like to show care and appreciation to people you're close to ?\n6.What values or dealbreakers are non - negotiable for you in a relationship ?\n7.What does 'quality time together' mean to you - what does it look like in practice ?\n\nStart with your first question that you can't answer from our history.",
    description: 'Shows authentic personality, communication style, and emotional intelligence',
  },
  {
    category: 'founder',
    title: 'Startup & Team Fit',
    prompt: "PRIMARY DIRECTIVE: You will be asking me several questions. Skip the question you can already answer based on everything you know about me from our past chats. When all questions have been answered, write a detailed summary based on the answers AND everything you know from our past chats, IMPORTANT: Your final response must ONLY be the summary. Do not add any closing remarks, offers for further assistance, or suggestions for next steps. Do not say 'If you'd like...'.\n\nI'm thinking about starting or joining a startup.Based on everything you know about me from our past chats, please interview me about what kind of co - founder or team would complement me.Ask me the following questions one at a time(skip any you can already answer based on our history): \n\n1.Walk me through how you typically make important decisions under time pressure or uncertainty.\n2.Describe a past collaboration that went really well - what made it work ?\n3.When you've worked with others who have different working styles than you, what challenges came up and how did you handle them?\n4. What energizes you most about building something new? What parts do you tend to avoid or procrastinate on?\n5. How do you prefer to divide responsibilities and make decisions in a team? (consensus, delegation, other?)\n6. What kind of feedback, communication, or support do you need from co-founders or teammates?\n7. What would be a dealbreaker for you in a co-founder or early team member?\n\nStart with your first question that you can't answer from our history.",
    description: 'Reveals collaboration style, decision-making patterns, and leadership approach',
  },
];

export function getPromptByCategory(category: 'hiring' | 'dating' | 'founder'): ConversationPrompt {
  return CONVERSATION_PROMPTS.find(p => p.category === category) || CONVERSATION_PROMPTS[3];
}

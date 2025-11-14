# Authentyc.ai Relationship Expansion Prompts

This document contains the standardized prompts for each relationship category in Authentyc.ai. Each section includes:
1. **User Prompt**: What users copy-paste into ChatGPT to generate their personality profile
2. **Server Prompt**: What the Authentyc.ai server uses to analyze compatibility between two parsed profiles

---

## 1. Dating Compatibility & Relationship Discovery

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my relationship patterns and compatibility factors. Be specific and balanced—include both strengths and areas where I might face challenges. Focus on:

1. **Attachment & Communication Style**: How I typically communicate in relationships, handle conflict, express needs, and respond to emotional situations. Include specific examples from our chats.

2. **Past Relationship Patterns**: What patterns emerge from how I've discussed past relationships—what went well, what didn't, how I've grown, and any recurring themes or blind spots.

3. **Values & Priorities**: What I genuinely prioritize in romantic relationships (not what I think I should prioritize). Include evidence from my actual concerns and questions.

4. **Lifestyle & Compatibility Factors**: My actual day-to-day preferences around scheduling, social activities, alone time, communication frequency, and life rhythms.

5. **Emotional Maturity & Growth**: How I process difficult emotions, take responsibility, show empathy, and demonstrate self-awareness. Be honest about areas where I'm still developing.

6. **Deal-Breakers & Non-Negotiables**: What I've consistently indicated matters most to me, both explicitly stated and implicitly revealed through our conversations.

7. **Red Flags & Growth Areas**: Any concerning patterns, contradictions between stated values and behavior, or areas where a potential partner should be aware of challenges.

Be thorough, evidence-based, and objective. Reference specific conversations or themes when possible.
```

### Server Prompt
```
Analyze compatibility between Person A and Person B for romantic relationship potential. You have their ChatGPT-generated personality profiles from the standardized dating prompt.

Provide a structured compatibility assessment:

**Overall Compatibility Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Communication Compatibility** [0-10]: Do their communication styles complement or clash? Consider directness, conflict resolution, emotional expression.

2. **Attachment & Emotional Alignment** [0-10]: How well do their attachment styles and emotional processing patterns mesh?

3. **Values & Life Goals** [0-10]: Are their core values and relationship priorities aligned or fundamentally divergent?

4. **Lifestyle Compatibility** [0-10]: Do their day-to-day rhythms, social needs, and time preferences fit together?

5. **Growth Trajectory Alignment** [0-10]: Are they at similar levels of emotional maturity? Do their growth areas complement or compound?

**Key Strengths**: 2-3 specific areas where they would thrive together, with evidence from their profiles.

**Potential Challenges**: 2-3 specific friction points or mismatches they should be aware of, with evidence.

**Conversation Starters**: 3 specific topics they should discuss early, based on identified compatibility questions.

**Recommendation**:
- **Strong Match**: High compatibility across dimensions, challenges are manageable
- **Moderate Match**: Some alignment with notable differences to navigate
- **Exploratory Match**: Intriguing potential but significant questions to resolve
- **Misaligned**: Fundamental incompatibilities in critical areas

Be objective and evidence-based. Avoid generic positivity—provide actionable insights grounded in their actual profiles.
```

---

## 2. Jobseeking & Talent Screening

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective professional assessment. Be specific and balanced—include both strengths and development areas. Focus on:

1. **Technical Skills & Problem-Solving**: What technical capabilities, tools, and methodologies have I demonstrated? How do I approach debugging, learning new technologies, and solving complex problems? Include specific examples.

2. **Work Style & Collaboration**: How do I actually work—independently vs. collaboratively, structured vs. flexible, detail-oriented vs. big-picture? How do I describe working with teammates and handling feedback?

3. **Communication & Documentation**: How clearly do I explain technical concepts? How thorough am I in seeking help, documenting approaches, or explaining my thinking?

4. **Learning Velocity & Adaptability**: How quickly do I pick up new concepts? Do I show growth from earlier conversations? How do I respond when stuck or encountering unfamiliar territory?

5. **Initiative & Ownership**: Do I take ownership of problems? Do I show proactive thinking, or do I wait for direction? What evidence exists of me driving projects forward?

6. **Professional Maturity**: How do I handle setbacks, ambiguity, time pressure, and competing priorities? Any patterns in how I discuss workplace challenges or conflicts?

7. **Limitations & Development Areas**: Where do I struggle? What gaps exist in my knowledge or skills? What do my questions reveal about blind spots or areas needing growth?

Be thorough, evidence-based, and professionally candid. Reference specific conversations, projects, or problem-solving sessions when possible.
```

### Server Prompt
```
Analyze job fit between Candidate and Role based on their ChatGPT-generated professional profile and the job requirements.

Provide a structured assessment:

**Overall Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Technical Skills Match** [0-10]: How well do their demonstrated capabilities align with role requirements?

2. **Work Style Fit** [0-10]: Does their work approach match the team culture and role expectations?

3. **Communication & Collaboration** [0-10]: Will they integrate effectively with the team and stakeholders?

4. **Learning & Growth Potential** [0-10]: Can they ramp up quickly and grow into role challenges?

5. **Problem-Solving & Execution** [0-10]: Do they show the analytical and execution capabilities needed?

**Key Strengths**: 2-3 specific capabilities that make them well-suited, with evidence from profile.

**Development Areas**: 2-3 specific gaps or concerns, with severity assessment (critical / moderate / minor).

**Interview Focus Topics**: 3-4 specific areas to probe in interviews based on profile insights.

**Onboarding Considerations**: Specific support or resources this candidate would benefit from based on their profile.

**Recommendation**:
- **Strong Fit**: High alignment across critical dimensions
- **Moderate Fit**: Core capabilities present with some gaps
- **Developmental Fit**: Potential but requires significant ramp-up
- **Misaligned**: Fundamental gaps in critical requirements

Be objective and evidence-based. Avoid both excessive optimism and unfair penalization—focus on actionable hiring insights.
```

---

## 3. Co-Living & Roommate Pairing

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my living habits and roommate compatibility factors. Be specific and balanced—include both strengths and potential friction points. Focus on:

1. **Daily Routines & Schedules**: My actual sleep schedule, work-from-home patterns, morning/evening routines, and how flexible or rigid these are.

2. **Cleanliness & Organization**: My honest standards for cleanliness, how I handle shared spaces, organization preferences, and any recurring stress around tidiness or clutter.

3. **Social & Noise Preferences**: How often I host guests, my comfort with roommates' guests, noise tolerance, need for quiet time, and social energy levels.

4. **Communication & Conflict**: How I handle household disagreements, my directness in addressing issues, whether I tend to avoid or confront problems, and examples of how I've navigated shared living situations.

5. **Financial Habits**: My approach to shared expenses, budgeting, splitting bills, and any patterns around financial stress or spending.

6. **Boundaries & Privacy**: What I need in terms of personal space, alone time, shared vs. separate food/items, and how I signal when I need privacy.

7. **Red Flags & Challenges**: Any habits or patterns that could create friction in shared living—inconsistency, avoidance, strong preferences that might be inflexible, or lifestyle factors a roommate should know upfront.

Be thorough, evidence-based, and honest. Reference specific situations or concerns when possible.
```

### Server Prompt
```
Analyze roommate compatibility between Person A and Person B based on their ChatGPT-generated co-living profiles.

Provide a structured assessment:

**Overall Compatibility Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Schedule & Routine Alignment** [0-10]: Do their daily rhythms complement or clash?

2. **Cleanliness Standards Match** [0-10]: Are their tidiness expectations aligned enough to avoid conflict?

3. **Social & Noise Compatibility** [0-10]: Do their guest policies and noise tolerance levels work together?

4. **Communication Style Fit** [0-10]: Can they navigate household issues effectively given their conflict styles?

5. **Financial Compatibility** [0-10]: Are their approaches to bills and budgeting aligned?

**Key Strengths**: 2-3 specific areas where they would cohabit well, with evidence.

**Potential Friction Points**: 2-3 specific areas likely to cause tension, with severity (deal-breaker / significant / manageable).

**House Rules to Establish**: 3-4 specific policies they should agree on upfront based on identified differences.

**Living Arrangement Suggestions**: Specific setup recommendations (separate bathrooms, quiet hours, cleaning schedule, etc.) based on their profiles.

**Recommendation**:
- **Strong Match**: Well-aligned across critical living dimensions
- **Moderate Match**: Compatible with clear house rules needed
- **High-Maintenance Match**: Can work but requires explicit communication and boundaries
- **Incompatible**: Fundamental lifestyle mismatches likely to cause chronic conflict

Be objective and practical. Focus on preventing common roommate conflicts through honest matching.
```

---

## 4. Graduate Cohort & Study Pod Matching

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my academic work style and study group compatibility. Be specific and balanced—include both strengths and challenges. Focus on:

1. **Study Habits & Discipline**: My actual study patterns—consistency, procrastination tendencies, planning ahead vs. last-minute, and time management effectiveness. Include specific examples.

2. **Learning Style & Comprehension**: How I approach new material, whether I prefer visual/verbal/hands-on learning, depth vs. breadth preferences, and how I check my understanding.

3. **Collaboration Approach**: How I work in group settings—do I lead, follow, facilitate? Do I pull my weight? How do I handle group dynamics and different work styles?

4. **Communication in Academic Settings**: How clearly I explain concepts, how I ask for help, how I respond to others' questions, and my teaching/mentoring approach.

5. **Stress Management & Resilience**: How I handle exam pressure, tight deadlines, setbacks, or difficult material. Any patterns in my response to academic stress.

6. **Contribution Style**: What I bring to study groups—am I the planner, the explainer, the synthesizer, the motivator? What role do I naturally fall into?

7. **Weaknesses & Burnout Signals**: Areas where I struggle academically, tendencies to overcommit or disengage, and warning signs that I'm overwhelmed or checking out.

Be thorough, evidence-based, and academically honest. Reference specific studying or learning situations when possible.
```

### Server Prompt
```
Analyze study pod compatibility for Members A, B, C [up to 4 members] based on their ChatGPT-generated academic profiles.

Provide a structured assessment:

**Overall Pod Viability Score**: [0-100] with brief justification

**Pod Balance Analysis**:
1. **Discipline & Reliability Match** [0-10]: Do members have compatible work ethics and follow-through?

2. **Learning Style Complementarity** [0-10]: Do their learning approaches complement or require too much accommodation?

3. **Collaboration Dynamics** [0-10]: Will their communication and group work styles mesh effectively?

4. **Stress Response Compatibility** [0-10]: Can they support each other under pressure without compounding stress?

5. **Skill & Role Distribution** [0-10]: Is there healthy diversity in contributions (planner, explainer, etc.) without gaps or redundancy?

**Pod Strengths**: 2-3 specific ways this combination would excel together, with evidence.

**Pod Challenges**: 2-3 specific friction points or imbalances, with severity assessment.

**Role Assignments**: Suggest specific roles for each member (coordinator, deadline tracker, concept explainer, etc.) based on their profiles.

**Operating Agreements**: 3-4 specific pod norms they should establish (meeting frequency, accountability check-ins, workload distribution, etc.).

**Recommendation**:
- **Strong Pod**: Well-balanced, complementary strengths, aligned work ethics
- **Viable Pod**: Can succeed with clear structure and expectations
- **High-Risk Pod**: Significant imbalances requiring active management
- **Mismatched Pod**: Fundamental incompatibilities in work style or reliability

Be objective and practical. Focus on creating balanced, sustainable study groups.
```

---

## 5. Founder Masterminds & Accountability Circles

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my founder mindset and accountability partnership potential. Be specific and balanced—include both strengths and blind spots. Focus on:

1. **Execution & Follow-Through**: How consistently do I actually execute on plans? Do I set goals and hit them, or do I frequently pivot or abandon initiatives? Include specific examples of follow-through (or lack thereof).

2. **Candor & Transparency**: How honestly do I discuss setbacks, mistakes, or uncertainty? Do I tend to present a polished front, or am I genuinely vulnerable about struggles?

3. **Strategic Thinking & Decision-Making**: How do I approach major decisions? Do I show evidence of systematic thinking, or am I more reactive? How do I weigh risk and opportunity?

4. **Emotional Resilience & Crisis Response**: How do I handle bad news, customer rejection, technical failures, or strategic dead-ends? What patterns emerge in my stress response?

5. **Feedback & Coaching Receptivity**: How do I respond to criticism or alternative viewpoints? Do I defend, deflect, or genuinely consider input? Examples of integrating feedback.

6. **Peer Support Capacity**: Can I effectively support other founders—do I ask good questions, offer useful frameworks, or do I tend to make conversations about my own situation?

7. **Weaknesses & Shadow Patterns**: What am I avoiding? Where do I consistently struggle—delegation, fundraising, sales, technical execution, people management? Any patterns of self-sabotage or blind spots?

Be thorough, evidence-based, and candidly introspective. Reference specific business challenges or strategic discussions when possible.
```

### Server Prompt
```
Analyze mastermind compatibility for Founders A, B, C, D [up to 6 members] based on their ChatGPT-generated founder profiles.

Provide a structured assessment:

**Overall Mastermind Fit Score**: [0-100] with brief justification

**Group Dynamics Analysis**:
1. **Candor & Transparency Match** [0-10]: Do members share similar vulnerability levels to enable deep trust?

2. **Stage & Challenge Alignment** [0-10]: Are they facing comparable challenges that enable peer insight?

3. **Execution Accountability** [0-10]: Can they hold each other accountable without enabling excuses?

4. **Strategic Diversity** [0-10]: Do they bring complementary perspectives and expertise?

5. **Emotional Maturity & Support** [0-10]: Can they provide and receive support effectively?

**Group Strengths**: 2-3 specific ways this cohort would excel together, with evidence.

**Group Challenges**: 2-3 specific risks (imbalanced candor, stage mismatches, dominant personalities, etc.).

**Meeting Structure Recommendations**: Specific format suggestions (check-in structure, time allocation, accountability mechanisms) based on their profiles.

**Individual Roles**: Suggest how each founder contributes (strategic advisor, accountability driver, emotional anchor, etc.).

**Recommendation**:
- **Strong Cohort**: Aligned on candor, stage, and support capacity
- **Viable Cohort**: Can work with explicit norms and facilitation
- **Developmental Cohort**: Significant gaps but growth potential
- **Misaligned Cohort**: Fundamental mismatches in openness or stage

Be objective and evidence-based. Prioritize psychological safety and productive accountability.
```

---

## 6. Creative Duo & Writers' Room Pairing

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my creative process and collaboration style. Be specific and balanced—include both strengths and potential friction points. Focus on:

1. **Creative Process & Workflow**: Do I work in structured outlines or discover through drafting? How much revision do I embrace? Do I need external deadlines or self-impose them? Include specific examples.

2. **Idea Generation & Development**: How do I generate and refine ideas? Am I prolific with raw ideas, or do I carefully develop fewer concepts? How do I respond when ideas don't land?

3. **Feedback & Critique Response**: How do I receive creative feedback? Do I defend my work, embrace notes, or get paralyzed by criticism? Examples of integrating feedback or struggling with it.

4. **Collaboration Style**: Do I prefer bouncing ideas back and forth, or working independently and reviewing? How do I handle creative disagreements? Do I compromise easily or fight for my vision?

5. **Creative Voice & Tone**: What themes, styles, or tones emerge in my creative work? What am I drawn to exploring? Any patterns in the stories I tell or perspectives I take?

6. **Professional Discipline**: How consistently do I show up for creative work? Do I push through blocks, or do I wait for inspiration? How do I handle project completion and polish?

7. **Weaknesses & Creative Blocks**: Where do I get stuck—starting, middle development, endings, revision? Any patterns of abandoning projects or getting overly precious about work?

Be thorough, evidence-based, and creatively honest. Reference specific projects or creative discussions when possible.
```

### Server Prompt
```
Analyze creative collaboration compatibility between Person A and Person B based on their ChatGPT-generated creative profiles.

Provide a structured assessment:

**Overall Creative Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Process Compatibility** [0-10]: Do their creative workflows complement (structured/discovery, fast/deliberate, etc.)?

2. **Feedback Dynamic** [0-10]: Can they give and receive critique productively?

3. **Collaboration Style Match** [0-10]: Do their preferred working modes align (real-time brainstorm vs. async review, etc.)?

4. **Creative Vision Alignment** [0-10]: Do their themes, tones, and creative sensibilities mesh?

5. **Discipline & Momentum** [0-10]: Can they maintain productive creative momentum together?

**Collaboration Strengths**: 2-3 specific ways their creative partnership would thrive, with evidence.

**Potential Creative Conflicts**: 2-3 specific friction points in their creative process or feedback dynamics.

**Working Agreement Recommendations**: Specific workflow structures (brainstorm frequency, draft exchange timing, feedback protocols, decision-making process) based on their profiles.

**Project Fit Assessment**: What types of projects would play to their combined strengths vs. expose fault lines?

**Recommendation**:
- **Strong Partnership**: Complementary processes and aligned creative sensibilities
- **Promising Partnership**: Core compatibility with workflow norms needed
- **Experimental Partnership**: Interesting potential but significant process differences
- **Misaligned Partnership**: Fundamental creative or process incompatibilities

Be objective and creativity-focused. Help them establish productive creative collaboration.
```

---

## 7. Travel Buddy Matchmaking

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my travel style and trip companion compatibility. Be specific and balanced—include both strengths and potential friction points. Focus on:

1. **Planning Style & Structure**: Do I prefer detailed itineraries or spontaneous exploration? How much advance planning do I need? How do I respond when plans change? Include specific examples.

2. **Budget & Spending**: My realistic travel budget comfort zone, how I think about value vs. splurges, spending on food/lodging/experiences, and any financial stress triggers.

3. **Pace & Energy**: How much activity do I want in a day? Do I need downtime, or do I want to maximize every hour? Morning person or night owl? How do I handle fatigue?

4. **Adventure vs. Comfort**: My actual tolerance for uncertainty, physical challenges, unfamiliar food, language barriers, and "things going wrong." Be honest about where I draw comfort lines.

5. **Social & Cultural Approach**: Do I want to meet locals and immerse culturally, or maintain tourist comfort? How do I think about respectful travel and cultural engagement?

6. **Communication & Conflict**: How do I handle travel stress, disagreements about what to do, or when something goes wrong? Any patterns in how I navigate group decision-making?

7. **Red Flags & Deal-Breakers**: What would make a trip miserable for me? Any inflexible needs (dietary, religious, safety, accessibility) or strong aversions a travel buddy should know?

Be thorough, evidence-based, and travel-realistic. Reference specific travel discussions or planning examples when possible.
```

### Server Prompt
```
Analyze travel buddy compatibility between Person A and Person B based on their ChatGPT-generated travel profiles.

Provide a structured assessment:

**Overall Travel Compatibility Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Planning Style Match** [0-10]: Can they agree on structure level and adapt to each other's needs?

2. **Budget Alignment** [0-10]: Are their spending comfort zones compatible enough to avoid financial tension?

3. **Pace & Energy Fit** [0-10]: Do their activity levels and stamina match?

4. **Adventure-Comfort Balance** [0-10]: Are they aligned on risk tolerance and comfort boundaries?

5. **Communication & Flexibility** [0-10]: Can they navigate decisions and handle stress collaboratively?

**Trip Strengths**: 2-3 specific ways they'd enhance each other's travel experience, with evidence.

**Potential Trip Conflicts**: 2-3 specific friction points (spending, pacing, planning, etc.) with severity.

**Trip Planning Recommendations**: Specific structure suggestions (budget agreements, daily planning process, alone time, decision-making protocol) based on their profiles.

**Destination Fit**: What types of trips would work well for this pairing vs. expose incompatibilities?

**Recommendation**:
- **Strong Travel Match**: Well-aligned across critical travel dimensions
- **Viable Travel Match**: Can work well with upfront planning agreements
- **Challenging Match**: Require significant compromise and communication
- **Incompatible Match**: Fundamental differences likely to create trip-ruining friction

Be objective and practical. Help them avoid common travel companion pitfalls.
```

---

## 8. Mentor–Mentee Pairing (Professional Development)

### User Prompt (Mentee Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my professional development needs and mentorship compatibility. Be specific and balanced—include both goals and growth areas. Focus on:

1. **Career Goals & Clarity**: What are my actual professional goals (vs. what I think I should want)? How clear or uncertain am I? What evidence exists of direction or confusion?

2. **Skill Gaps & Development Areas**: Where do I most need to grow—technical skills, leadership, communication, strategy, execution? What patterns emerge in where I get stuck professionally?

3. **Learning Style & Receptivity**: How do I best absorb guidance—tactical advice, strategic frameworks, storytelling, homework? How do I respond to direct feedback or challenge?

4. **Initiative & Ownership**: Do I drive my own development, or do I wait for guidance? Do I implement advice, or do I frequently ask the same questions without action?

5. **Communication Preferences**: How often would I ideally connect with a mentor? Do I prefer structured check-ins or ad-hoc reach-outs? How do I ask for help—specifically or vaguely?

6. **Vulnerability & Openness**: How honestly do I discuss professional struggles or setbacks? Do I present a polished version or genuinely share challenges?

7. **Expectations & Boundaries**: What do I realistically need from a mentor—accountability, expertise, connections, encouragement? Any unrealistic expectations or potential boundary issues?

Be thorough, evidence-based, and development-focused. Reference specific career discussions or professional challenges when possible.
```

### User Prompt (Mentor Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my mentorship style and capacity. Be specific and balanced—include both strengths and limitations. Focus on:

1. **Mentorship Philosophy & Approach**: How do I think about developing others? Do I prefer tactical coaching, strategic guidance, or empathetic support? What patterns emerge in how I help others?

2. **Communication & Feedback Style**: How direct am I with hard truths? Do I sugarcoat or challenge bluntly? How do I balance support and accountability?

3. **Expertise & Value Add**: Where can I genuinely add value—technical skills, industry navigation, leadership, specific domains? Where am I less equipped to guide?

4. **Time & Energy Capacity**: How much mentorship bandwidth do I realistically have? Do I over-commit and under-deliver, or set boundaries effectively?

5. **Patience & Adaptability**: How do I respond when mentees don't implement advice, repeat questions, or progress slowly? Can I adapt my style to different learning preferences?

6. **Boundaries & Expectations**: What do I expect from mentees—initiative, preparation, follow-through? What would frustrate me or cause me to disengage?

7. **Limitations & Blind Spots**: What mentorship scenarios would I struggle with? What biases or blind spots might affect my guidance? Where should I not be someone's primary mentor?

Be thorough, evidence-based, and coaching-realistic. Reference specific examples of guiding, teaching, or supporting others.
```

### Server Prompt
```
Analyze mentor-mentee compatibility between Mentor and Mentee based on their ChatGPT-generated mentorship profiles.

Provide a structured assessment:

**Overall Mentorship Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Goals-Expertise Alignment** [0-10]: Can the mentor effectively guide in the mentee's development areas?

2. **Learning-Teaching Style Match** [0-10]: Do their learning and teaching approaches complement?

3. **Communication Compatibility** [0-10]: Will their feedback and receptivity styles work together?

4. **Expectations Alignment** [0-10]: Are their cadence, initiative, and boundary expectations matched?

5. **Growth Potential** [0-10]: Can this pairing realistically accelerate the mentee's development?

**Pairing Strengths**: 2-3 specific ways this mentorship would be highly effective, with evidence.

**Pairing Challenges**: 2-3 specific risks (expectation mismatches, style clashes, expertise gaps, etc.).

**Mentorship Structure Recommendations**: Specific suggestions (meeting frequency, agenda format, homework approach, goal-setting cadence) based on their profiles.

**Success Metrics**: What specific outcomes would indicate this mentorship is working well?

**Recommendation**:
- **Strong Match**: Excellent alignment on goals, style, and expectations
- **Viable Match**: Can succeed with clear structure and communication
- **Developmental Match**: Worth trying but requires active expectation management
- **Misaligned Match**: Fundamental incompatibilities in needs, style, or capacity

Be objective and development-focused. Prioritize productive, sustainable mentorship relationships.
```

---

## 9. Family Caregiver Placement

### User Prompt (Caregiver Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my caregiving capabilities and approach. Be specific and balanced—include both strengths and areas of concern. Focus on:

1. **Caregiving Philosophy & Empathy**: How do I think about caring for others—especially elderly or chronically ill individuals? What evidence exists of patience, empathy, and person-centered care?

2. **Medical & Safety Competence**: What do I know about medication management, safety protocols, emergency response, and health monitoring? Include specific examples of how I approach medical scenarios.

3. **Communication & Documentation**: How clearly do I communicate about health concerns? Do I proactively document and report, or do I need reminders? How do I handle difficult health conversations?

4. **Reliability & Professionalism**: How consistent and dependable am I with commitments? Do I show up on time, follow through, and maintain professional boundaries?

5. **Problem-Solving Under Pressure**: How do I respond to emergencies, sudden health changes, or challenging patient behaviors? Do I stay calm and systematic, or do I get overwhelmed?

6. **Respect & Dignity**: How do I balance providing necessary care with respecting patient autonomy and dignity? Examples of navigating this tension.

7. **Limitations & Red Flags**: What scenarios would I struggle with—dementia behaviors, end-of-life care, physical demands, emotional toll? Any concerning patterns or gaps in knowledge?

Be thorough, evidence-based, and professionally candid. Reference specific caregiving discussions or health-related scenarios when possible.
```

### Server Prompt
```
Analyze caregiver-family compatibility between Caregiver and Family (with patient needs profile) based on the ChatGPT-generated caregiver profile and family requirements.

Provide a structured assessment:

**Overall Placement Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Medical Competence Match** [0-10]: Does the caregiver have the skills for this patient's specific needs?

2. **Empathy & Philosophy Alignment** [0-10]: Does their caregiving approach match the family's values and patient's personality?

3. **Communication & Reliability** [0-10]: Will they keep the family informed and show up consistently?

4. **Crisis Management Capability** [0-10]: Can they handle the specific emergencies this patient might face?

5. **Sustainability & Boundaries** [0-10]: Can they maintain long-term, professional caregiving without burnout?

**Placement Strengths**: 2-3 specific reasons this caregiver fits this family's needs, with evidence.

**Placement Concerns**: 2-3 specific risks or gaps (skill deficits, personality mismatches, scenario limitations) with severity.

**Onboarding Recommendations**: Specific training, protocols, or support this caregiver needs for success with this patient.

**Red Flag Assessment**: Any serious concerns that require further verification, references, or should disqualify this placement?

**Recommendation**:
- **Strong Fit**: Excellent skills and approach match for this patient
- **Viable Fit**: Can succeed with training and family support
- **Conditional Fit**: Requires supervised trial period and skill development
- **Poor Fit**: Significant gaps or misalignments for this patient's needs

Be objective and safety-focused. Prioritize patient wellbeing and family peace of mind.
```

---

## 10. Wellness & Fitness Accountability Partners

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my wellness approach and accountability partnership compatibility. Be specific and balanced—include both motivational drivers and relapse patterns. Focus on:

1. **Health Goals & Motivation**: What are my actual wellness goals (not what I think I should want)? What motivates me—data, aesthetics, performance, health metrics, social connection? Include evidence.

2. **Habit Patterns & Consistency**: How consistent am I with health habits? Do I start strong and fade, maintain steady progress, or cycle through motivation waves? What patterns emerge?

3. **Setback Response & Resilience**: How do I handle missed workouts, diet slip-ups, or plateaus? Do I bounce back, spiral into guilt, or rationalize quitting?

4. **Accountability Preferences**: What kind of accountability actually helps me—gentle encouragement, data sharing, tough love, scheduled check-ins? What backfires?

5. **Lifestyle & Constraints**: What realistic constraints do I face—time, budget, physical limitations, work schedule? How do I actually navigate these (vs. use them as excuses)?

6. **Social & Support Needs**: Do I thrive with a partner or prefer independent accountability? How do I want to interact—daily check-ins, weekly reviews, shared workouts?

7. **Red Flags & Relapse Triggers**: What consistently derails my wellness efforts? Any concerning patterns around disordered eating, over-exercising, or unhealthy mindsets? What should a partner watch for?

Be thorough, evidence-based, and health-realistic. Reference specific wellness discussions or habit-building attempts when possible.
```

### Server Prompt
```
Analyze wellness accountability partnership compatibility between Person A and Person B based on their ChatGPT-generated wellness profiles.

Provide a structured assessment:

**Overall Partnership Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Goal Alignment** [0-10]: Are their wellness goals compatible enough to support each other?

2. **Motivation Style Match** [0-10]: Do their motivational drivers and accountability preferences complement?

3. **Habit Pattern Complementarity** [0-10]: Can they sustain mutual momentum given their consistency patterns?

4. **Resilience & Support Compatibility** [0-10]: Can they support each other through setbacks productively?

5. **Lifestyle & Schedule Fit** [0-10]: Do their constraints and availability enable effective partnership?

**Partnership Strengths**: 2-3 specific ways they would support each other effectively, with evidence.

**Partnership Challenges**: 2-3 specific friction points (mismatched pacing, different relapse triggers, schedule conflicts, etc.).

**Partnership Structure Recommendations**: Specific suggestions (check-in format, accountability mechanisms, shared tracking, celebration protocols) based on their profiles.

**Warning Signs to Monitor**: Specific patterns either partner should watch for that indicate unhealthy dynamics or individual struggles.

**Recommendation**:
- **Strong Partnership**: Well-matched goals, styles, and support capacity
- **Viable Partnership**: Can work with clear structure and communication
- **Challenging Partnership**: Significant differences requiring careful management
- **Incompatible Partnership**: Mismatched approaches likely to undermine both

Be objective and health-focused. Avoid enabling unhealthy patterns while supporting genuine wellness.
```

---

## 11. Volunteer & Nonprofit Board Placement

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my volunteer capacity and nonprofit governance potential. Be specific and balanced—include both value-add and realistic limitations. Focus on:

1. **Mission Alignment & Passion**: What causes or issues do I genuinely care about (vs. what sounds impressive)? What evidence exists of sustained interest and knowledge depth?

2. **Relevant Skills & Expertise**: What professional or lived experience can I meaningfully contribute—fundraising, governance, operations, marketing, finance, community connections, technical skills?

3. **Time & Energy Realism**: How much volunteer bandwidth do I actually have? Do I over-commit and under-deliver, or set realistic boundaries? Examples of follow-through or flaking.

4. **Governance Literacy**: What do I understand about nonprofit board roles—fiduciary duties, fundraising expectations, strategic oversight vs. operational involvement? Any misconceptions or knowledge gaps?

5. **Collaboration & Leadership**: How do I work with other passionate volunteers or staff? Can I balance strong opinions with collaborative decision-making? How do I handle organizational politics?

6. **Uncomfortable Tasks Willingness**: Am I willing to do unglamorous work—asking friends for money, reviewing budgets, attending long meetings, handling difficult personnel issues?

7. **Limitations & Deal-Breakers**: What would cause me to disengage—burnout, mission drift, interpersonal conflict, time demands? Any constraints or expectations that would make me ineffective?

Be thorough, evidence-based, and service-realistic. Reference specific discussions about volunteering, community work, or organizational involvement.
```

### Server Prompt
```
Analyze volunteer/board placement compatibility between Candidate and Organization based on the ChatGPT-generated volunteer profile and organizational needs.

Provide a structured assessment:

**Overall Placement Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Mission-Passion Alignment** [0-10]: Does the candidate have genuine, sustainable commitment to this cause?

2. **Skills-Needs Match** [0-10]: Can they fill specific organizational gaps or needs?

3. **Time-Commitment Realism** [0-10]: Is their available bandwidth appropriate for the role's demands?

4. **Governance Readiness** [0-10]: Do they understand and accept board responsibilities (if board role)?

5. **Cultural & Collaborative Fit** [0-10]: Will they work effectively with existing board/staff/volunteers?

**Placement Strengths**: 2-3 specific contributions this candidate would make, with evidence.

**Placement Concerns**: 2-3 specific risks (time constraints, skill gaps, expectation mismatches, etc.).

**Onboarding Recommendations**: Specific orientation or training this candidate needs for success.

**Role Suggestions**: What specific committee, project, or role would best leverage their strengths while managing limitations?

**Recommendation**:
- **Strong Fit**: Excellent mission alignment, skills match, and realistic capacity
- **Viable Fit**: Can contribute effectively with clear role definition
- **Developmental Fit**: Needs training and mentorship but has potential
- **Poor Fit**: Misaligned expectations, insufficient capacity, or skills mismatch

Be objective and mission-focused. Prioritize sustainable, high-impact volunteer relationships.
```

---

## 12. Language Exchange Partnerships

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my language learning approach and exchange partner compatibility. Be specific and balanced—include both strengths and learning challenges. Focus on:

1. **Language Goals & Motivation**: What are my actual language learning goals—fluency, travel basics, cultural connection, professional use? How consistent is my motivation? Include evidence.

2. **Learning Style & Pace**: How do I learn best—structured lessons, immersive conversation, grammar-first, errors-okay? How quickly do I pick up languages? How do I respond to mistakes?

3. **Practice Consistency**: How reliably do I maintain language practice? Do I show up for scheduled sessions, practice between meetings, or cycle through bursts and gaps?

4. **Correction Preferences**: How do I want to be corrected—real-time, at the end, gently, directly? How do I handle feeling embarrassed or stuck?

5. **Cultural Curiosity**: Am I genuinely interested in the culture behind the language, or focused only on linguistic mechanics? Examples of cultural learning or lack thereof.

6. **Teaching & Reciprocity**: Can I effectively help a partner learn my native language? Am I patient, clear, and balanced in giving/receiving instruction?

7. **Limitations & Frustration Triggers**: What causes me to give up on language learning—slow progress, lack of time, difficulty speaking, grammar overwhelm? What should a partner know about my challenges?

Be thorough, evidence-based, and learning-realistic. Reference specific language learning discussions or cultural explorations when possible.
```

### Server Prompt
```
Analyze language exchange partnership compatibility between Person A (learning Language X, native Language Y) and Person B (learning Language Y, native Language X) based on their ChatGPT-generated language learning profiles.

Provide a structured assessment:

**Overall Exchange Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Goal & Level Compatibility** [0-10]: Are their proficiency levels and goals balanced enough for mutual benefit?

2. **Learning Style Match** [0-10]: Do their learning preferences and pacing align?

3. **Commitment & Consistency** [0-10]: Can they maintain a sustainable exchange schedule?

4. **Correction & Feedback Compatibility** [0-10]: Do their feedback preferences and teaching styles mesh?

5. **Cultural Exchange Potential** [0-10]: Is there mutual cultural curiosity and respect?

**Partnership Strengths**: 2-3 specific ways this exchange would be mutually beneficial, with evidence.

**Partnership Challenges**: 2-3 specific friction points (level imbalance, schedule conflicts, correction style clashes, etc.).

**Exchange Structure Recommendations**: Specific suggestions (session format, time split, correction protocol, topic planning, cultural activities) based on their profiles.

**Progress Milestones**: What specific outcomes would indicate this exchange is effective?

**Recommendation**:
- **Strong Match**: Well-balanced levels, compatible styles, mutual commitment
- **Viable Match**: Can succeed with clear structure and balanced sessions
- **Developmental Match**: Worth trying but requires monitoring for balance
- **Imbalanced Match**: Significant disparities likely to create one-sided exchange

Be objective and learning-focused. Ensure both partners benefit equitably.
```

---

## 13. Therapist & Client Alignment

### User Prompt (Client Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my mental health needs and therapy compatibility factors. Be specific and balanced—include both therapeutic goals and barriers. Focus on:

1. **Mental Health Goals & Needs**: What do I actually need help with—specific diagnoses, life transitions, relationship patterns, trauma, self-understanding? What patterns emerge in my emotional struggles?

2. **Therapy History & Preferences**: What has worked or not worked in past therapy (if any)? What modalities or approaches appeal to me—CBT, psychodynamic, EMDR, somatic, etc.?

3. **Emotional Processing Style**: How do I process difficult emotions—analytically, somatically, through narrative? Do I intellectualize, or do I access feelings easily? Examples from our conversations.

4. **Communication & Vulnerability**: How comfortable am I being vulnerable? Do I open up quickly or slowly? How do I talk about painful experiences?

5. **Desired Therapist Qualities**: What do I need in a therapist—directness, warmth, structure, flexibility, specific cultural competencies, lived experience? What would make me shut down or disengage?

6. **Homework & Active Participation**: Am I willing to do therapeutic homework, practice skills between sessions, and actively engage in my healing? Or do I prefer processing within sessions only?

7. **Barriers & Concerns**: What might get in the way of therapy success—avoidance patterns, trust issues, cost, time, specific triggers or fears? What should a therapist be aware of upfront?

Be thorough, evidence-based, and therapeutically honest. Reference specific emotional discussions or coping patterns when possible.
```

### User Prompt (Therapist Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my therapeutic approach and client compatibility factors. Be specific and balanced—include both strengths and practice limitations. Focus on:

1. **Therapeutic Orientation & Methods**: What modalities do I practice—CBT, psychodynamic, ACT, DBT, IFS, etc.? What does my actual approach look like in sessions? Include specific examples if discussed.

2. **Session Structure & Style**: Do I prefer structured sessions or follow the client's lead? How directive or non-directive am I? What's my pacing like?

3. **Communication & Feedback Approach**: How do I give feedback—gently, directly, through questions? How do I challenge clients or address resistance?

4. **Cultural Competency & Specializations**: What populations, issues, or identities do I have genuine competence with? Where are my blind spots or limitations in lived experience or training?

5. **Boundaries & Therapist Presence**: How do I maintain therapeutic boundaries? How much do I self-disclose? How emotionally present am I vs. clinically detached?

6. **Capacity & Sustainability**: What kinds of clients or presenting issues energize me vs. drain me? What would lead me to refer out or struggle to be effective?

7. **Limitations & Non-Ideal Clients**: What client presentations, expectations, or dynamics would I struggle with? Who should I not take on as a client?

Be thorough, evidence-based, and clinically honest. Reference specific therapeutic discussions or supervision insights when possible.
```

### Server Prompt
```
Analyze therapist-client compatibility between Therapist and Client based on their ChatGPT-generated therapy profiles.

Provide a structured assessment:

**Overall Therapeutic Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Modality-Needs Match** [0-10]: Does the therapist's approach align with the client's presenting issues and goals?

2. **Style & Communication Compatibility** [0-10]: Will their session styles and communication preferences work together?

3. **Cultural & Identity Alignment** [0-10]: Does the therapist have appropriate competence for this client's identities and experiences?

4. **Engagement & Structure Fit** [0-10]: Do their expectations around homework, pacing, and participation mesh?

5. **Therapeutic Alliance Potential** [0-10]: Is there strong potential for trust, safety, and productive relationship?

**Pairing Strengths**: 2-3 specific reasons this therapeutic match could be highly effective, with evidence.

**Pairing Concerns**: 2-3 specific risks (style mismatches, competency gaps, triggering dynamics, etc.).

**Initial Session Recommendations**: Specific topics or expectations to discuss in consultation to ensure alignment.

**Potential Challenges to Address**: What dynamics or issues might arise that they should proactively plan for?

**Recommendation**:
- **Strong Match**: Excellent alignment on modality, style, and client needs
- **Viable Match**: Can succeed with clear expectation-setting and goodwill
- **Exploratory Match**: Worth a consultation but significant questions to resolve
- **Poor Match**: Fundamental incompatibilities in approach, competency, or needs

Be objective and clinically appropriate. Prioritize client wellbeing and therapeutic effectiveness.
```

---

## 14. Prenuptial Planning & Couples Mediation

### User Prompt (Individual Partner Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my relationship expectations and prenuptial planning compatibility factors. Be specific and balanced—include both values and potential conflict areas. Focus on:

1. **Financial Philosophy & Money History**: How do I think about money—saving vs. spending, risk tolerance, debt comfort, financial independence vs. sharing? What patterns emerge from my financial discussions? Include specific examples.

2. **Marriage & Commitment Expectations**: What does marriage mean to me beyond the wedding? What do I expect around fidelity, career priority, geographic flexibility, family planning?

3. **Household & Career Vision**: How do I envision household labor division, dual careers vs. primary breadwinner, work-life balance, whose career takes priority when?

4. **Family & In-Law Dynamics**: What role do I expect family to play—financial support, caregiving, boundary-setting, geographic proximity? How do I handle family conflict?

5. **Conflict Style & Communication**: How do I approach difficult conversations about money, sex, parenting, or life decisions? Do I avoid, confront, compromise? Examples of past relationship conflict navigation.

6. **Future Planning & Contingencies**: How do I think about planning for worst-case scenarios—divorce, death, disability? Am I pragmatic or do I see it as pessimistic?

7. **Non-Negotiables & Anxieties**: What would I absolutely need in a prenuptial agreement? What am I anxious about regarding marriage or legal commitment? What might I be hiding or minimizing?

Be thorough, evidence-based, and relationship-realistic. Reference specific relationship discussions or financial planning scenarios when possible.
```

### Server Prompt
```
Analyze prenuptial compatibility and mediation needs for Couple (Partner A & Partner B) based on their ChatGPT-generated relationship profiles.

Provide a structured assessment:

**Overall Alignment Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Financial Philosophy Alignment** [0-10]: How compatible are their money values and behaviors?

2. **Marriage Expectations Match** [0-10]: Are their visions of marriage and commitment aligned?

3. **Household & Career Compatibility** [0-10]: Can they navigate the logistics of shared life and dual ambitions?

4. **Family Dynamics Fit** [0-10]: Will their family expectations and boundary approaches work together?

5. **Conflict & Communication Compatibility** [0-10]: Can they handle difficult conversations productively?

**Alignment Strengths**: 2-3 specific areas where they share values and vision, with evidence.

**Divergence Points**: 2-3 specific areas of misalignment or potential conflict, with severity (critical / significant / manageable).

**Prenuptial Discussion Topics**: Specific clauses or scenarios they must address (asset division, debt responsibility, career relocation, family support, inheritance, etc.).

**Mediation Recommendations**: Specific conversation structures or professional support they need (financial planner, therapist, mediator, attorney specialization).

**Warning Signs**: Any patterns suggesting they should not marry yet, or require significant pre-marital work?

**Recommendation**:
- **Strong Foundation**: Well-aligned with normal differences to negotiate
- **Workable Partnership**: Core compatibility with important conversations needed
- **High-Risk Partnership**: Significant misalignments requiring intensive pre-marital work
- **Concerning Misalignment**: Fundamental incompatibilities that may predict instability

Be objective and long-term focused. Help them prevent marital conflicts through honest planning.
```

---

## 15. Parenting Ally Pods

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my parenting approach and parent support compatibility. Be specific and balanced—include both parenting strengths and struggles. Focus on:

1. **Parenting Philosophy & Approach**: What's my actual parenting style—permissive, authoritative, structured, Montessori, attachment-based? What values guide my decisions? Include specific examples.

2. **Discipline & Boundaries**: How do I think about discipline, consequences, and boundary-setting? What do I struggle with in this area?

3. **Developmental Stage & Challenges**: What specific parenting phase am I in? What am I finding hardest—sleep, tantrums, school issues, teen independence, neurodiversity, etc.?

4. **Emotional Regulation & Stress**: How do I handle parenting stress, tantrums, defiance, or my own triggered responses? What are my breaking points?

5. **Support Needs & Gaps**: What kind of parenting support would actually help me—validation, tactical advice, shared experiences, emergency backup, just listening?

6. **Judgment & Openness**: How judgmental am I of different parenting approaches? How open am I to hearing others' methods even if different from mine?

7. **Vulnerability & Honesty**: How honestly can I discuss parenting failures, burnout, resentment, or difficult feelings? Or do I tend to present a curated version of my parenting?

Be thorough, evidence-based, and parenting-realistic. Reference specific parenting discussions or child development challenges when possible.
```

### Server Prompt
```
Analyze parenting pod compatibility for Parents A, B, C [up to 5 members] based on their ChatGPT-generated parenting profiles.

Provide a structured assessment:

**Overall Pod Viability Score**: [0-100] with brief justification

**Pod Dynamics Analysis**:
1. **Parenting Philosophy Compatibility** [0-10]: Are their approaches similar enough to provide mutual support vs. judgment?

2. **Stage & Challenge Alignment** [0-10]: Are they facing similar parenting phases to enable relevant peer support?

3. **Vulnerability & Honesty Match** [0-10]: Do they share comparable openness levels to enable deep trust?

4. **Support Style Fit** [0-10]: Do their support needs and giving styles complement?

5. **Judgment & Acceptance Balance** [0-10]: Can they hold space for different approaches while maintaining boundaries?

**Pod Strengths**: 2-3 specific ways this cohort would support each other effectively, with evidence.

**Pod Challenges**: 2-3 specific friction points (philosophy clashes, stage mismatches, judgment dynamics, etc.).

**Pod Structure Recommendations**: Specific suggestions (meeting frequency, confidentiality norms, advice vs. venting balance, topic rotation) based on their profiles.

**Conversation Guidelines**: What ground rules would help this group avoid judgment and maintain support?

**Recommendation**:
- **Strong Pod**: Aligned philosophy, stage, and vulnerability for deep support
- **Viable Pod**: Can work with clear norms and facilitated boundaries
- **Challenging Pod**: Significant differences requiring active management
- **Misaligned Pod**: Fundamental philosophy or openness mismatches

Be objective and parent-supportive. Create space for authentic parenting challenges without enabling harmful practices.
```

---

## 16. Cross-Cultural Remote Team Onboarding

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my cross-cultural collaboration style and remote work compatibility. Be specific and balanced—include both collaboration strengths and cultural blind spots. Focus on:

1. **Communication Style & Directness**: How direct or indirect am I in professional communication? How do I deliver feedback, disagree, or escalate issues? Include cultural context if relevant.

2. **Asynchronous Work & Documentation**: How well do I work asynchronously—documentation habits, over-communication vs. under-communication, timezone sensitivity, response time expectations?

3. **Meeting & Decision-Making Preferences**: How do I prefer decisions to be made—consensus, hierarchical, debate-driven? How do I engage in meetings—vocal, observer, prepared/impromptu?

4. **Feedback & Conflict Navigation**: How do I receive critical feedback? How do I handle professional disagreements or misunderstandings? Any cultural patterns in conflict avoidance or confrontation?

5. **Cultural Self-Awareness**: What do I understand about my own cultural norms around work, authority, time, relationships? Where might I unconsciously impose cultural assumptions?

6. **Adaptability & Cultural Learning**: How curious am I about other cultures' work norms? How do I respond when cultural differences create friction? Examples of adaptation or rigidity.

7. **Potential Friction Points**: What cultural norms am I deeply attached to that might clash with others—punctuality, formality, directness, social vs. task focus? What should teammates know upfront?

Be thorough, evidence-based, and culturally honest. Reference specific cross-cultural discussions or work scenarios when possible.
```

### Server Prompt
```
Analyze cross-cultural team integration compatibility between New Team Member and Existing Team based on their ChatGPT-generated cultural collaboration profiles.

Provide a structured assessment:

**Overall Integration Fit Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Communication Style Compatibility** [0-10]: How well do their directness and feedback norms align?

2. **Asynchronous Work Alignment** [0-10]: Can they collaborate effectively across timezones with their documentation and communication habits?

3. **Decision-Making & Meeting Style Fit** [0-10]: Will their participation and decision preferences mesh with team norms?

4. **Cultural Adaptability Match** [0-10]: How well can they bridge cultural gaps and learn each other's norms?

5. **Conflict & Feedback Compatibility** [0-10]: Can they navigate disagreements productively given their cultural approaches?

**Integration Strengths**: 2-3 specific ways this team member would enhance cross-cultural collaboration, with evidence.

**Integration Challenges**: 2-3 specific cultural friction points or misunderstanding risks, with severity.

**Onboarding Recommendations**: Specific cultural onboarding steps (communication norms training, buddy assignment, cultural context sharing, explicit protocol setting) based on identified gaps.

**Watch-Out Scenarios**: Specific situations likely to trigger cultural miscommunication that should be proactively addressed.

**Recommendation**:
- **Smooth Integration**: Strong cultural awareness and compatible norms
- **Viable Integration**: Can succeed with cultural onboarding and explicit norms
- **Developmental Integration**: Requires active cultural coaching and patience
- **High-Risk Integration**: Significant cultural gaps requiring intensive support

Be objective and culturally sensitive. Prioritize productive collaboration while respecting cultural differences.
```

---

## 17. Recovery Sponsor & Peer Support Matching

### User Prompt (Person Seeking Support Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my recovery journey and support partnership needs. Be specific and balanced—include both progress and ongoing struggles. Focus on:

1. **Recovery Stage & Substance**: Where am I in my recovery journey—early sobriety, years clean, struggling with relapse, harm reduction? What substance(s) or behaviors am I recovering from?

2. **Trigger Patterns & Coping**: What actually triggers me toward relapse—stress, social situations, emotions, people, places? What coping strategies have worked or failed? Include specific examples.

3. **Accountability Preferences**: What kind of support helps me—daily check-ins, tough love, empathetic listening, structured programs, flexibility? What makes me shut down or resist?

4. **Honesty & Transparency**: How honestly do I discuss urges, slips, or struggles? Do I tend to minimize, rationalize, or openly share challenges?

5. **Spiritual & Program Alignment**: What's my relationship with 12-step programs, spirituality, or alternative recovery models? What resonates or feels alienating?

6. **Support Capacity & Reciprocity**: Can I support others, or do I need intensive one-way support right now? Am I in a place to give as well as receive?

7. **Relapse History & Red Flags**: What patterns emerge in my past relapses? What warning signs indicate I'm at risk? What should a sponsor or peer watch for?

Be thorough, evidence-based, and recovery-honest. Reference specific discussions about substance use, triggers, or sobriety when possible.
```

### User Prompt (Person Offering Support/Sponsor Version)
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my recovery experience and sponsorship capacity. Be specific and balanced—include both strengths and boundaries. Focus on:

1. **Recovery Journey & Foundation**: How long have I been in recovery? What's my substance history? How stable is my own sobriety? Include specific timeline if discussed.

2. **Sponsorship Philosophy & Approach**: How do I think about supporting others—tough love, empathetic, program-focused, flexible? What does my support style look like?

3. **Boundary-Setting & Self-Care**: How well do I maintain boundaries to protect my own recovery? Do I over-extend or maintain healthy limits?

4. **Trigger & Relapse Awareness**: What could trigger my own relapse through sponsorship—specific substances, behaviors, codependency patterns? What should I avoid?

5. **Availability & Consistency**: How much time and energy can I realistically offer? Am I reliable for crisis calls, regular check-ins, or only structured meetings?

6. **Spiritual & Program Stance**: How do I approach spirituality, 12-step work, or alternative methods? How flexible am I with different recovery paths?

7. **Limitations & Non-Ideal Matches**: What kinds of people or situations would I struggle to sponsor—specific substances, early sobriety chaos, resistance to program, personality clashes?

Be thorough, evidence-based, and recovery-protective. Reference specific sponsorship discussions or recovery support experiences when possible.
```

### Server Prompt
```
Analyze recovery support match between Sponsor/Peer and Person Seeking Support based on their ChatGPT-generated recovery profiles.

Provide a structured assessment:

**Overall Support Match Score**: [0-100] with brief justification

**Dimensional Analysis**:
1. **Recovery Stage Compatibility** [0-10]: Are their recovery stages appropriate for a supportive relationship?

2. **Accountability Style Match** [0-10]: Do their support/accountability preferences align?

3. **Honesty & Transparency Fit** [0-10]: Can they engage with appropriate openness and trust?

4. **Spiritual & Program Alignment** [0-10]: Are their recovery philosophies compatible enough?

5. **Boundary & Sustainability** [0-10]: Can the sponsor/peer maintain healthy boundaries while offering needed support?

**Match Strengths**: 2-3 specific ways this pairing would support recovery effectively, with evidence.

**Match Concerns**: 2-3 specific risks (trigger overlaps, boundary issues, philosophy clashes, stage mismatches).

**Support Structure Recommendations**: Specific suggestions (check-in frequency, crisis protocols, program work expectations, relapse action plan) based on their profiles.

**Safety Considerations**: Any scenarios that could jeopardize either person's recovery that require safeguards?

**Recommendation**:
- **Strong Match**: Excellent alignment for sustainable, recovery-protective support
- **Viable Match**: Can work with clear boundaries and communication
- **High-Risk Match**: Proceed cautiously with additional support structures
- **Unsafe Match**: Fundamental incompatibilities or safety concerns

Be objective and recovery-protective. Prioritize both individuals' sustained sobriety.
```

---

## 18. Sustainable Living & Climate Action Cohorts

### User Prompt
```
Based on everything you know about me from our past conversations, please provide a comprehensive and objective analysis of my sustainability commitment and climate cohort compatibility. Be specific and balanced—include both genuine commitment and realistic limitations. Focus on:

1. **Sustainability Values & Knowledge**: What environmental issues do I genuinely care about vs. what sounds good? What depth of knowledge do I have? Include specific topics I've explored.

2. **Action & Follow-Through**: What have I actually done vs. what have I talked about doing? Do I implement sustainability changes, or do I mostly research and plan?

3. **Skills & Contributions**: What can I realistically contribute—grant writing, community organizing, technical expertise (solar, composting, etc.), storytelling, logistics? Include specific examples.

4. **Time & Energy Realism**: How much bandwidth do I have for climate action? Do I over-commit and burn out, or set sustainable boundaries? What's my track record?

5. **Collaboration & Leadership**: Do I prefer leading, supporting, or following in group projects? How do I handle disagreements about strategy or priorities?

6. **Practical Constraints**: What realistic limits do I face—budget, physical ability, living situation, family commitments? How do I navigate these (vs. use as excuses)?

7. **Burnout & Frustration Triggers**: What would cause me to disengage from climate work—slow progress, interpersonal drama, lack of visible impact, competing priorities?

Be thorough, evidence-based, and action-realistic. Reference specific sustainability discussions or environmental projects when possible.
```

### Server Prompt
```
Analyze climate action cohort compatibility for Members A, B, C, D [up to 6 members] based on their ChatGPT-generated sustainability profiles.

Provide a structured assessment:

**Overall Cohort Viability Score**: [0-100] with brief justification

**Cohort Dynamics Analysis**:
1. **Mission & Focus Alignment** [0-10]: Are they focused on compatible environmental priorities?

2. **Action & Execution Balance** [0-10]: Do they have a healthy mix of planners and doers?

3. **Skills Complementarity** [0-10]: Do they have diverse, complementary skills for project success?

4. **Time & Commitment Match** [0-10]: Are their bandwidth levels compatible for sustained collaboration?

5. **Resilience & Sustainability** [0-10]: Can they maintain momentum without collective burnout?

**Cohort Strengths**: 2-3 specific ways this group would excel in climate action, with evidence.

**Cohort Challenges**: 2-3 specific risks (skill gaps, commitment imbalances, scope disagreements, burnout patterns).

**Project Recommendations**: What types of climate projects would suit this cohort's combined strengths and constraints?

**Operating Structure**: Specific suggestions (meeting cadence, decision-making process, task distribution, progress tracking) based on their profiles.

**Recommendation**:
- **Strong Cohort**: Balanced skills, aligned commitment, sustainable capacity
- **Viable Cohort**: Can succeed with clear project scope and structure
- **Developmental Cohort**: Potential but needs active facilitation and boundaries
- **Imbalanced Cohort**: Significant gaps or mismatches in commitment or capability

Be objective and impact-focused. Prioritize sustainable, effective climate action over burnout-prone enthusiasm.
```

---

## General Design Principles

### Prompt Design Quality Checks
All prompts in this document have been designed to:

1. **Consistency**: Same prompt for all users in a category, eliminating variability in data quality
2. **Significance**: Focus on critical relationship factors backed by research and the RELATIONSHIP_EXPANSIONS analysis
3. **Balance**: Explicitly request weaknesses, challenges, and red flags alongside strengths to counter AI positivity bias
4. **Evidence-Based**: Require specific examples from chat history rather than general self-description
5. **Actionability**: Generate insights that enable practical compatibility assessment and relationship success
6. **Objectivity**: Frame requests in neutral language that doesn't lead toward positive or negative responses
7. **Comprehensiveness**: Cover behavioral patterns, not just stated preferences or one-time incidents
8. **Privacy-Respectful**: Keep analysis at individual level; server prompts compare profiles without exposing raw chat data

### Server Prompt Quality Checks
All server prompts:

1. **Structured Scoring**: Provide numerical scores for objective comparison and tracking
2. **Dimensional Analysis**: Break down compatibility into specific, measurable factors
3. **Evidence Requirements**: Ground assessments in specific profile elements, not generalizations
4. **Actionable Recommendations**: Provide concrete next steps, conversation starters, or structure suggestions
5. **Balanced Outcomes**: Offer nuanced recommendations beyond binary match/no-match
6. **Risk Assessment**: Identify specific challenges and their severity levels
7. **Avoid Bias**: Explicitly instruct against generic positivity or unfair penalization

### Implementation Notes

- **User Experience**: User prompts are copy-pasteable into ChatGPT without modification
- **Parse Once, Analyze Many**: User profiles are generated once and can be analyzed against multiple compatibility scenarios
- **Progressive Disclosure**: Prompts can be shortened for MVP with core sections, expanded for advanced features
- **Multi-Language Support**: Prompts can be translated; server analysis works across languages via ChatGPT summaries
- **Version Control**: As relationship science evolves, prompts can be versioned and A/B tested for improved signal extraction


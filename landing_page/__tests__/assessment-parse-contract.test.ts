/** @jest-environment node */
// parseResponse is a pure string->object function, but the parser module's
// import chain touches lib/supabase/server at load time; stub it like the
// sibling parser test does.
jest.mock('../lib/supabase/server', () => ({ supabaseServer: {} }));

import {
  parseResponse,
  getRatingCategory,
  RATING_THRESHOLDS,
} from '@/lib/chatgpt/parser';

// A representative v2 assistant OUTPUT (NOT the prompt): evidence-first
// ANALYSIS, ordered sections, exact markers the prompt's OUTPUT FORMAT block
// instructs ChatGPT to emit.
const SAMPLE_ASSESSMENT = [
  'Here is your audit.',
  '',
  '--- ASSESSMENT ---',
  '',
  'OVERALL COMPLETENESS: 8/10',
  '',
  'Rating Criteria: 1-3 = almost nothing. 4-6 = one side only. 7-8 = both ' +
    'sides from multiple conversations. 9-10 = deep evidence in most pillars.',
  '',
  'ANALYSIS:',
  '',
  'Evidence base: Roughly 6 conversations support your hard skills (incident ' +
    'triage, Postgres tuning, on-call retros) and 4 your work style (feedback ' +
    'threads, a burnout discussion).',
  '',
  'When you walked through the Friday outage, it showed calm prioritization ' +
    'under pressure — which means you would thrive where ownership is high.',
  '',
  'What this means for your next move: a small, high-autonomy team.',
  '',
  '--- END ASSESSMENT ---',
].join('\n');

describe('parseResponse — v2 assessment contract', () => {
  const parsed = parseResponse(SAMPLE_ASSESSMENT);

  it('extracts the completeness rating from OVERALL COMPLETENESS', () => {
    expect(parsed.completenessRating).toBe(8);
  });

  it('extracts structured assessment details', () => {
    expect(parsed.assessmentDetails).toBeDefined();
    expect(parsed.assessmentDetails!.rating).toBe(8);
  });

  it('summary and analysis both lead with the Evidence base line', () => {
    expect(parsed.summary.startsWith('Evidence base:')).toBe(true);
    expect(parsed.assessmentDetails!.analysis.startsWith('Evidence base:')).toBe(true);
  });

  it('summary equals the parsed ANALYSIS body', () => {
    expect(parsed.summary).toBe(parsed.assessmentDetails!.analysis);
  });

  it('the analysis body excludes the markers and rating block', () => {
    expect(parsed.assessmentDetails!.analysis).not.toContain('--- END ASSESSMENT ---');
    expect(parsed.assessmentDetails!.analysis).not.toContain('OVERALL COMPLETENESS');
    expect(parsed.assessmentDetails!.analysis).toContain('What this means for your next move');
  });
});

describe('getRatingCategory — band mapping matches the unified rubric', () => {
  it('maps the four bands to parser thresholds', () => {
    expect(getRatingCategory(2)).toBe('INSUFFICIENT'); // 1-3
    expect(getRatingCategory(5)).toBe('MINIMAL');       // 4-6
    expect(getRatingCategory(8)).toBe('GOOD');          // 7-8
    expect(getRatingCategory(10)).toBe('EXCELLENT');    // 9-10
  });

  it('threshold constants are unchanged', () => {
    expect(RATING_THRESHOLDS).toEqual({
      EXCELLENT: 9, GOOD: 7, MINIMAL: 4, INSUFFICIENT: 1,
    });
  });
});

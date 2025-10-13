export const THESIS_ALIGNMENT_SCHEMA = {
  name: 'thesis_alignment',
  schema: {
    type: 'object',
    properties: {
      thesis_summary: { type: 'string' },
      sectors_affected: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            direction: { enum: ['positive', 'negative', 'neutral'] },
            notes: { type: 'string' },
          },
          required: ['name', 'direction'],
        },
      },
      tickers_long: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            conviction: { enum: ['low', 'medium', 'high'] },
            rationale: { type: 'string' },
            suggested_weight: { type: 'number' },
            confidence: { enum: ['low', 'medium', 'high'] },
          },
          required: ['symbol', 'conviction', 'rationale'],
        },
      },
      tickers_short: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            conviction: { enum: ['low', 'medium', 'high'] },
            rationale: { type: 'string' },
            suggested_weight: { type: 'number' },
            confidence: { enum: ['low', 'medium', 'high'] },
          },
          required: ['symbol', 'conviction', 'rationale'],
        },
      },
      rationale: { type: 'string' },
      confidence_notes: {
        type: 'array',
        items: { type: 'string' },
      },
      macro_signals: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: [
      'thesis_summary',
      'sectors_affected',
      'tickers_long',
      'tickers_short',
      'rationale',
    ],
  },
};

export const THESIS_ALIGNMENT_SYSTEM_PROMPT = `
You are an equity strategist at a top-tier investment bank. Translate the user's belief into investable signals for a paper trading simulator.
Return clear, concise, and actionable instruments while calling out areas of uncertainty.
`.trim();

export const THESIS_REVIEW_SCHEMA = {
  name: 'thesis_review',
  schema: {
    type: 'object',
    properties: {
      pros: {
        type: 'array',
        items: { type: 'string' },
      },
      cons: {
        type: 'array',
        items: { type: 'string' },
      },
      related_themes: {
        type: 'array',
        items: { type: 'string' },
      },
      historical_analogs: {
        type: 'array',
        items: { type: 'string' },
      },
      counter_theses: {
        type: 'array',
        items: { type: 'string' },
      },
      confidence_level: {
        enum: ['low', 'medium', 'high'],
      },
    },
    required: ['pros', 'cons', 'related_themes'],
  },
};

export const THESIS_REVIEW_SYSTEM_PROMPT = `
You are a macro research analyst creating a balanced brief on an investment thesis.
Provide concise bullet points, flagging key risks and supportive data.
`.trim();

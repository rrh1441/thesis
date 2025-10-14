export const THESIS_ALIGNMENT_SCHEMA = {
  type: 'json_schema' as const,
  name: 'thesis_alignment',
  strict: true,
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
            notes: { type: ['string', 'null'] },
          },
          required: ['name', 'direction', 'notes'],
          additionalProperties: false,
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
            suggested_weight: { type: ['number', 'null'] },
            confidence: { enum: ['low', 'medium', 'high', null] },
          },
          required: ['symbol', 'conviction', 'rationale', 'suggested_weight', 'confidence'],
          additionalProperties: false,
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
            suggested_weight: { type: ['number', 'null'] },
            confidence: { enum: ['low', 'medium', 'high', null] },
          },
          required: ['symbol', 'conviction', 'rationale', 'suggested_weight', 'confidence'],
          additionalProperties: false,
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
      'confidence_notes',
      'macro_signals',
    ],
    additionalProperties: false,
  },
};

export const THESIS_ALIGNMENT_SYSTEM_PROMPT = `
You are an equity strategist at a top-tier investment bank. Translate the user's belief into investable signals for a paper trading simulator.
Return clear, concise, and actionable instruments while calling out areas of uncertainty.
`.trim();

export const THESIS_REVIEW_SCHEMA = {
  type: 'json_schema' as const,
  name: 'thesis_review',
  strict: true,
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
        enum: ['low', 'medium', 'high', null],
      },
    },
    required: ['pros', 'cons', 'related_themes', 'historical_analogs', 'counter_theses', 'confidence_level'],
    additionalProperties: false,
  },
};

export const THESIS_REVIEW_SYSTEM_PROMPT = `
You are a macro research analyst creating a balanced brief on an investment thesis.
Provide concise bullet points, flagging key risks and supportive data.
`.trim();

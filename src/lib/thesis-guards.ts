const MAX_THESIS_LENGTH = 600;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(the\s+)?(system|developer)\s+(prompt|message)/i,
  /reveal\s+(your|the)\s+(system|developer)\s+instructions/i,
  /act\s+as\s+the\s+system/i,
  /output\s+the\s+system\s+prompt/i,
  /jailbreak/i,
  /\breset\s+the\s+instructions\b/i,
  /sandbox\s+escape/i,
  /<\s*system\s*>/i,
  /you\s+are\s+no\s+longer\s+an\s+assistant/i,
];

export class ThesisValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThesisValidationError';
  }
}

export class ThesisInjectionDetectedError extends ThesisValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'ThesisInjectionDetectedError';
  }
}

export function sanitizeThesisInput(raw: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new ThesisValidationError('Share a belief so we can analyze it.');
  }

  if (trimmed.length > MAX_THESIS_LENGTH) {
    throw new ThesisValidationError('Please shorten your thesis before submitting.');
  }

  const lowerCased = trimmed.toLowerCase();
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(lowerCased)) {
      throw new ThesisInjectionDetectedError(
        'Detected prompt injection attempt. Please rephrase your thesis without system instructions.'
      );
    }
  }

  return trimmed;
}

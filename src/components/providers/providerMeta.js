export const PROVIDER_NAMES = {
  GROQ: 'Groq',
  GEMINI: 'Gemini',
  OPENROUTER: 'OpenRouter',
};

export const STATUS_DOT = {
  ACTIVE: 'bg-ok',
  RATE_LIMITED: 'bg-warn',
  DOWN: 'bg-down',
};

export const STATUS_LABEL = {
  ACTIVE: 'Active',
  RATE_LIMITED: 'Rate limited',
  DOWN: 'Down',
};

export const displayName = (provider) =>
  PROVIDER_NAMES[String(provider).toUpperCase()] ?? provider;
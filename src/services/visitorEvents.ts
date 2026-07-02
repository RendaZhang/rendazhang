const VISITOR_EVENT_SCHEMA_VERSION = 1 as const;
const MAX_EVENT_VALUE_LENGTH = 80;
const SAFE_ID_PATTERN = /^[a-z][a-z0-9_:-]{0,63}$/;

export const VISITOR_EVENT_NAMES = [
  'page_view',
  'cta_clicked',
  'nav_item_clicked',
  'theme_mode_changed',
  'palette_changed',
  'language_changed',
  'chat_widget_opened',
  'chat_widget_closed',
  'chat_preset_question_clicked',
  'docs_anchor_clicked',
  'certification_verify_clicked',
  'contact_intent_clicked'
] as const;

export const VISITOR_ROUTE_KEYS = [
  'home',
  'docs',
  'certifications',
  'deepseek_chat',
  'login',
  'register',
  'profile',
  'not_found',
  'server_error'
] as const;

export const VISITOR_LOCALES = ['zh-CN', 'en'] as const;
export const VISITOR_THEME_MODES = ['light', 'dark'] as const;
export const VISITOR_PALETTES = ['default', 'aurora', 'forest'] as const;
export const CHAT_PRESET_QUESTION_IDS = [
  'who_is_renda',
  'personalweb_proof',
  'cloud_native_evidence',
  'certification_context',
  'recruiter_summary'
] as const;

export type VisitorEventName = (typeof VISITOR_EVENT_NAMES)[number];
export type VisitorRouteKey = (typeof VISITOR_ROUTE_KEYS)[number];
export type VisitorLocale = (typeof VISITOR_LOCALES)[number];
export type VisitorThemeMode = (typeof VISITOR_THEME_MODES)[number];
export type VisitorPalette = (typeof VISITOR_PALETTES)[number];
export type ChatPresetQuestionId = (typeof CHAT_PRESET_QUESTION_IDS)[number];

export interface VisitorEventPayloads {
  page_view: {
    routeKey: VisitorRouteKey;
    locale?: VisitorLocale;
  };
  cta_clicked: {
    surface: string;
    targetId: string;
    targetRouteKey?: VisitorRouteKey;
  };
  nav_item_clicked: {
    itemId: string;
    targetRouteKey: VisitorRouteKey;
  };
  theme_mode_changed: {
    mode: VisitorThemeMode;
  };
  palette_changed: {
    palette: VisitorPalette;
  };
  language_changed: {
    language: VisitorLocale;
  };
  chat_widget_opened: {
    surface: string;
  };
  chat_widget_closed: {
    surface: string;
  };
  chat_preset_question_clicked: {
    presetId: ChatPresetQuestionId;
  };
  docs_anchor_clicked: {
    anchorId: string;
  };
  certification_verify_clicked: {
    credentialId: string;
    targetId: string;
  };
  contact_intent_clicked: {
    targetId: string;
  };
}

type VisitorEventPayload = VisitorEventPayloads[VisitorEventName];
type VisitorEventValue = string;
type NormalizedVisitorEventPayload = Record<string, VisitorEventValue>;
type VisitorEventPayloadInput = Record<string, unknown>;

export interface VisitorEvent {
  name: VisitorEventName;
  payload: NormalizedVisitorEventPayload;
  schemaVersion: typeof VISITOR_EVENT_SCHEMA_VERSION;
}

export interface VisitorEventTransport {
  send: (event: VisitorEvent) => void;
}

export type VisitorEventRejectReason =
  | 'unknown_event_name'
  | 'missing_payload'
  | 'missing_required_payload_key'
  | 'unknown_payload_key'
  | 'sensitive_payload_key'
  | 'sensitive_payload_value'
  | 'invalid_payload_value'
  | 'transport_error';

export type VisitorEventResult =
  | {
      ok: true;
      event: VisitorEvent;
    }
  | {
      ok: false;
      reason: VisitorEventRejectReason;
      key?: string;
    };

interface EventPayloadRule {
  required: readonly string[];
  optional?: readonly string[];
}

const EVENT_PAYLOAD_RULES: Record<VisitorEventName, EventPayloadRule> = {
  page_view: {
    required: ['routeKey'],
    optional: ['locale']
  },
  cta_clicked: {
    required: ['surface', 'targetId'],
    optional: ['targetRouteKey']
  },
  nav_item_clicked: {
    required: ['itemId', 'targetRouteKey']
  },
  theme_mode_changed: {
    required: ['mode']
  },
  palette_changed: {
    required: ['palette']
  },
  language_changed: {
    required: ['language']
  },
  chat_widget_opened: {
    required: ['surface']
  },
  chat_widget_closed: {
    required: ['surface']
  },
  chat_preset_question_clicked: {
    required: ['presetId']
  },
  docs_anchor_clicked: {
    required: ['anchorId']
  },
  certification_verify_clicked: {
    required: ['credentialId', 'targetId']
  },
  contact_intent_clicked: {
    required: ['targetId']
  }
};

const SENSITIVE_PAYLOAD_KEY_PATTERN =
  /(?:auth|body|content|cookie|email|message|name|password|phone|profile|prompt|secret|session|subject|text|token|uid|user)/i;

const URL_OR_QUERY_VALUE_PATTERN = /(?:https?:\/\/|www\.|[?&][a-z0-9_-]+=)/i;
const EMAIL_VALUE_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_LIKE_VALUE_PATTERN = /\+?\d[\d\s().-]{6,}\d/;
const PRIVATE_PATH_VALUE_PATTERN =
  /(?:^|\/)(?:admin|api|auth|cloudchat|etc|internal|opt|private|root|server|tmp|users|var)(?:\/|$)/i;

const noopVisitorEventTransport: VisitorEventTransport = {
  send: () => undefined
};

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

function isVisitorEventName(value: unknown): value is VisitorEventName {
  return isOneOf(value, VISITOR_EVENT_NAMES);
}

export function isChatPresetQuestionId(value: unknown): value is ChatPresetQuestionId {
  return isOneOf(value, CHAT_PRESET_QUESTION_IDS);
}

function isSafeIdentifierValue(value: string): boolean {
  return value.length <= MAX_EVENT_VALUE_LENGTH && SAFE_ID_PATTERN.test(value);
}

function containsSensitiveValue(value: string): boolean {
  return (
    URL_OR_QUERY_VALUE_PATTERN.test(value) ||
    EMAIL_VALUE_PATTERN.test(value) ||
    PHONE_LIKE_VALUE_PATTERN.test(value) ||
    PRIVATE_PATH_VALUE_PATTERN.test(value)
  );
}

function isAllowedValueForKey(
  name: VisitorEventName,
  key: string,
  value: unknown
): value is VisitorEventValue {
  if (typeof value !== 'string' || value.length > MAX_EVENT_VALUE_LENGTH) {
    return false;
  }

  if (containsSensitiveValue(value)) {
    return false;
  }

  switch (key) {
    case 'routeKey':
    case 'targetRouteKey':
      return isOneOf(value, VISITOR_ROUTE_KEYS);
    case 'locale':
    case 'language':
      return isOneOf(value, VISITOR_LOCALES);
    case 'mode':
      return isOneOf(value, VISITOR_THEME_MODES);
    case 'palette':
      return isOneOf(value, VISITOR_PALETTES);
    case 'presetId':
      return name === 'chat_preset_question_clicked' && isChatPresetQuestionId(value);
    case 'anchorId':
    case 'credentialId':
    case 'itemId':
    case 'surface':
    case 'targetId':
      return isSafeIdentifierValue(value);
    default:
      return false;
  }
}

export function normalizeVisitorEvent(
  name: string,
  payload: VisitorEventPayloadInput
): VisitorEventResult {
  if (!isVisitorEventName(name)) {
    return { ok: false, reason: 'unknown_event_name' };
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, reason: 'missing_payload' };
  }

  const rule = EVENT_PAYLOAD_RULES[name];
  const allowedKeys = new Set([...(rule.optional ?? []), ...rule.required]);
  const normalizedPayload: NormalizedVisitorEventPayload = {};

  for (const requiredKey of rule.required) {
    if (!(requiredKey in payload)) {
      return { ok: false, reason: 'missing_required_payload_key', key: requiredKey };
    }
  }

  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_PAYLOAD_KEY_PATTERN.test(key)) {
      return { ok: false, reason: 'sensitive_payload_key', key };
    }

    if (!allowedKeys.has(key)) {
      return { ok: false, reason: 'unknown_payload_key', key };
    }

    if (typeof value === 'string' && containsSensitiveValue(value)) {
      return { ok: false, reason: 'sensitive_payload_value', key };
    }

    if (value === undefined && !rule.required.includes(key)) {
      continue;
    }

    if (!isAllowedValueForKey(name, key, value)) {
      return { ok: false, reason: 'invalid_payload_value', key };
    }

    normalizedPayload[key] = value;
  }

  return {
    ok: true,
    event: {
      name,
      payload: normalizedPayload,
      schemaVersion: VISITOR_EVENT_SCHEMA_VERSION
    }
  };
}

export function trackVisitorEvent<N extends VisitorEventName>(
  name: N,
  payload: VisitorEventPayloads[N],
  transport: VisitorEventTransport = noopVisitorEventTransport
): VisitorEventResult {
  const result = normalizeVisitorEvent(name, payload as VisitorEventPayload);

  if (!result.ok) {
    return result;
  }

  try {
    transport.send(result.event);
  } catch {
    return { ok: false, reason: 'transport_error' };
  }

  return result;
}

export function createVisitorEventTracker(
  transport: VisitorEventTransport = noopVisitorEventTransport
) {
  return {
    track<N extends VisitorEventName>(
      name: N,
      payload: VisitorEventPayloads[N]
    ): VisitorEventResult {
      return trackVisitorEvent(name, payload, transport);
    }
  };
}

export { noopVisitorEventTransport };

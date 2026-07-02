import { describe, expect, it, vi } from 'vitest';
import {
  createVisitorEventTracker,
  isChatPresetQuestionId,
  normalizeVisitorEvent,
  noopVisitorEventTransport,
  trackVisitorEvent,
  type VisitorEventTransport
} from '../services/visitorEvents';

describe('visitorEvents', () => {
  it('normalizes allowed event names and payload fields', () => {
    const result = normalizeVisitorEvent('page_view', {
      routeKey: 'home',
      locale: 'en'
    });

    expect(result).toEqual({
      ok: true,
      event: {
        name: 'page_view',
        payload: {
          routeKey: 'home',
          locale: 'en'
        },
        schemaVersion: 1
      }
    });
  });

  it('rejects unknown event names', () => {
    const result = normalizeVisitorEvent('form_body_submitted', {
      routeKey: 'home'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'unknown_event_name'
    });
  });

  it('rejects unknown payload keys instead of forwarding unsanctioned fields', () => {
    const result = normalizeVisitorEvent('cta_clicked', {
      surface: 'hero',
      targetId: 'view_docs',
      targetRouteKey: 'docs',
      campaignId: 'summer'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'unknown_payload_key',
      key: 'campaignId'
    });
  });

  it('rejects visitor-entered or sensitive payload keys', () => {
    const result = normalizeVisitorEvent('chat_preset_question_clicked', {
      presetId: 'personalweb_proof',
      message: 'tell me about this visitor'
    });

    expect(result).toEqual({
      ok: false,
      reason: 'sensitive_payload_key',
      key: 'message'
    });
  });

  it('rejects URLs, query strings, private paths, emails, and phone-like values', () => {
    expect(
      normalizeVisitorEvent('docs_anchor_clicked', {
        anchorId: 'https://www.rendazhang.com/docs/?from=visitor'
      })
    ).toEqual({
      ok: false,
      reason: 'sensitive_payload_value',
      key: 'anchorId'
    });

    expect(
      normalizeVisitorEvent('cta_clicked', {
        surface: 'hero',
        targetId: '/cloudchat/auth/me',
        targetRouteKey: 'docs'
      })
    ).toEqual({
      ok: false,
      reason: 'sensitive_payload_value',
      key: 'targetId'
    });

    expect(
      normalizeVisitorEvent('contact_intent_clicked', {
        targetId: '952402967@qq.com'
      })
    ).toEqual({
      ok: false,
      reason: 'sensitive_payload_value',
      key: 'targetId'
    });

    expect(
      normalizeVisitorEvent('contact_intent_clicked', {
        targetId: '+86-13925067232'
      })
    ).toEqual({
      ok: false,
      reason: 'sensitive_payload_value',
      key: 'targetId'
    });
  });

  it('uses a no-op transport by default', () => {
    expect(() =>
      trackVisitorEvent('theme_mode_changed', {
        mode: 'dark'
      })
    ).not.toThrow();

    expect(noopVisitorEventTransport.send).not.toThrow();
  });

  it('sends sanitized events only after normalization succeeds', () => {
    const transport: VisitorEventTransport = {
      send: vi.fn()
    };
    const tracker = createVisitorEventTracker(transport);

    const result = tracker.track('palette_changed', {
      palette: 'forest'
    });

    expect(result.ok).toBe(true);
    expect(transport.send).toHaveBeenCalledWith({
      name: 'palette_changed',
      payload: {
        palette: 'forest'
      },
      schemaVersion: 1
    });
  });

  it('does not call the transport for rejected events', () => {
    const transport: VisitorEventTransport = {
      send: vi.fn()
    };

    const result = trackVisitorEvent(
      'nav_item_clicked',
      {
        itemId: 'home',
        targetRouteKey: 'docs',
        token: 'private'
      } as never,
      transport
    );

    expect(result).toEqual({
      ok: false,
      reason: 'sensitive_payload_key',
      key: 'token'
    });
    expect(transport.send).not.toHaveBeenCalled();
  });

  it('handles controlled chat preset question IDs only', () => {
    expect(isChatPresetQuestionId('personalweb_proof')).toBe(true);
    expect(isChatPresetQuestionId('what did I type')).toBe(false);

    expect(
      normalizeVisitorEvent('chat_preset_question_clicked', {
        presetId: 'personalweb_proof'
      })
    ).toEqual({
      ok: true,
      event: {
        name: 'chat_preset_question_clicked',
        payload: {
          presetId: 'personalweb_proof'
        },
        schemaVersion: 1
      }
    });

    expect(
      normalizeVisitorEvent('chat_preset_question_clicked', {
        presetId: 'visitor_freeform_question'
      })
    ).toEqual({
      ok: false,
      reason: 'invalid_payload_value',
      key: 'presetId'
    });
  });

  it('rejects non-enumerated values and long identifiers', () => {
    expect(
      normalizeVisitorEvent('theme_mode_changed', {
        mode: 'system'
      })
    ).toEqual({
      ok: false,
      reason: 'invalid_payload_value',
      key: 'mode'
    });

    expect(
      normalizeVisitorEvent('docs_anchor_clicked', {
        anchorId: `docs_${'a'.repeat(90)}`
      })
    ).toEqual({
      ok: false,
      reason: 'invalid_payload_value',
      key: 'anchorId'
    });
  });
});

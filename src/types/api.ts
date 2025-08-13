/**
 * API request and response type definitions.
 * These interfaces mirror backend endpoints to provide
 * strong typing across the application.
 */

export interface ChatSendMessageRequest {
  /** User's input message */
  message: string;
}

export interface ChatSendMessageResponse {
  /** AI generated reply text */
  text: string;
}

export type ResetChatRequest = Record<string, never>;

export interface ResetChatResponse {
  /**
   * Backend returns a status message instead of `{ ok: true }`.
   * See `/reset_chat` in backend API documentation.
   */
  status: string;
}

// #region Auth endpoints

export interface AuthLoginRequest {
  /** Email or phone identifier */
  identifier: string;
  /** Account password */
  password: string;
}

export interface AuthLoginResponse {
  /** Whether the login succeeded */
  ok: boolean;
  /** Error message on failure */
  error?: string;
}

export interface AuthRegisterRequest {
  /** User email; optional but either email or phone is required */
  email?: string;
  /** User phone number; optional but either email or phone is required */
  phone?: string;
  /** Account password */
  password: string;
  /** Display name shown to other users */
  display_name?: string;
}

export interface AuthRegisterResponse {
  /** Indicates success */
  ok: boolean;
  /** Error message on failure */
  error?: string;
}

export type AuthLogoutRequest = Record<string, never>;

export interface AuthLogoutResponse {
  ok: boolean;
}

export interface AuthMeResponse {
  ok: boolean;
  user: {
    id: number;
    uid: string;
    email: string | null;
    phone: string | null;
    display_name: string;
    is_active: boolean;
  };
  error?: string;
}

export interface AuthPasswordForgotRequest {
  identifier: string;
}

export interface AuthPasswordForgotResponse {
  ok: boolean;
  /** Present only when server runs with `DEBUG_RETURN_RESET_TOKEN=1`. */
  debug_token?: string;
}

export interface AuthPasswordResetRequest {
  token: string;
  password: string;
}

export interface AuthPasswordResetResponse {
  ok: boolean;
  revoked_sessions?: number;
  error?: string;
}

export interface AuthHealthzResponse {
  ok: boolean;
  redis: boolean;
  db: boolean;
}

// #endregion

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
  /** Indicates whether the reset operation succeeded */
  success: boolean;
}

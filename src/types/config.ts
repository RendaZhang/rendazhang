import type { ENDPOINTS } from '../constants/api';

export interface GlobalConfig {
  readonly API_BASE_URL: string;
  readonly ENDPOINTS: typeof ENDPOINTS;
  readonly TYPING_INTERVAL: number;
}

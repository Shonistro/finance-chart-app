export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  refresh_expires_in: string;
  token_type: string;
  expires_in: string;
  scope: string;
  not_before_policy: number;
  session_state: string;
}

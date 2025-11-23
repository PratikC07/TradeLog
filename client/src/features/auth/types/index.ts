// Matches the response from /auth/login and /auth/register
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: "trader" | "admin";
}

// For the Registration Form
export interface RegisterCredentials {
  username: string; // This is the 'Display Name'
  email: string;
  password: string;
}

// For the Login Form
export interface LoginCredentials {
  email: string;
  password: string;
}

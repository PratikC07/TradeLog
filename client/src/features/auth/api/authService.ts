import { apiClient } from "../../../lib/apiClient";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "../types";

export const authService = {
  // Endpoint: POST /auth/register
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  // Endpoint: POST /auth/login
  // Requirement: Content-Type: application/x-www-form-urlencoded
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    // Backend contract says: Map Email to 'username' key
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },
};

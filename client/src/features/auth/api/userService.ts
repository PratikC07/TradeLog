import { apiClient } from "../../../lib/apiClient";
import { UserProfile } from "../../../types/api";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/users/me");
    return response.data;
  },
};

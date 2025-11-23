import { apiClient } from "../../../lib/apiClient";
import { Trade, PaginatedResponse } from "../../../types/api";

interface GetTradesParams {
  skip: number;
  limit: number;
  status?: "OPEN" | "CLOSED";
}

export const journalService = {
  getTrades: async ({
    skip,
    limit,
    status,
  }: GetTradesParams): Promise<PaginatedResponse<Trade>> => {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());
    if (status) {
      params.append("status", status);
    }

    const response = await apiClient.get<PaginatedResponse<Trade>>(
      `/trades/?${params.toString()}`
    );
    return response.data;
  },
};

import { apiClient } from "../../../lib/apiClient";
import {
  Trade,
  DashboardSummary,
  ChartDataPoint,
  PaginatedResponse,
} from "../../../types/api";

// Input Types
export interface CreateTradeDTO {
  symbol: string;
  side: "LONG" | "SHORT";
  quantity: number;
  entry_price: number;
  entry_date?: string;
}

export interface UpdateTradeDTO extends Partial<CreateTradeDTO> {
  exit_price?: number;
  exit_date?: string;
}

export interface CloseTradeDTO {
  exit_price: number;
  exit_date?: string;
}

export const dashboardService = {
  // --- READ ---
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>(
      "/analytics/summary"
    );
    return response.data;
  },

  getChartData: async (): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get<{ data: ChartDataPoint[] }>(
      "/analytics/chart"
    );
    return response.data.data;
  },

  getRecentTrades: async (): Promise<Trade[]> => {
    // FIXED: Limit set to 5 for Dashboard Overview
    const response = await apiClient.get<PaginatedResponse<Trade>>(
      "/trades/?limit=5"
    );
    return response.data.data;
  },

  getTopTrades: async (): Promise<Trade[]> => {
    const response = await apiClient.get<PaginatedResponse<Trade>>(
      "/analytics/admin/top-trades"
    );
    return response.data.data;
  },

  // --- WRITE ---
  createTrade: async (data: CreateTradeDTO): Promise<Trade> => {
    const response = await apiClient.post<Trade>("/trades/", data);
    return response.data;
  },

  updateTrade: async (id: string, data: UpdateTradeDTO): Promise<Trade> => {
    const response = await apiClient.put<Trade>(`/trades/${id}`, data);
    return response.data;
  },

  closeTrade: async (id: string, data: CloseTradeDTO): Promise<Trade> => {
    const response = await apiClient.patch<Trade>(`/trades/${id}/close`, data);
    return response.data;
  },

  deleteTrade: async (id: string): Promise<void> => {
    await apiClient.delete(`/trades/${id}`);
  },
};

import { useState, useEffect, useCallback } from "react";
import {
  dashboardService,
  CreateTradeDTO,
  UpdateTradeDTO,
  CloseTradeDTO,
} from "../api/dashboardService";
import { userService } from "../../auth/api/userService";
import {
  Trade,
  DashboardSummary,
  ChartDataPoint,
  UserProfile,
} from "../../../types/api";

export const useDashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Ensure loading starts

      // 1. Fetch User Profile
      const userProfile = await userService.getProfile();
      setUser(userProfile);

      // DEBUG: Check what the backend is actually returning
      console.log("Cvurrent User Role:", userProfile.role);

      // 2. Fetch Common Data
      const [summaryData, chartRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getChartData(),
      ]);
      setSummary(summaryData);
      setChartData(chartRes);

      // 3. ROBUST ROLE CHECK
      // Convert to lowercase to be safe: "Admin", "ADMIN" -> "admin"
      const normalizedRole = userProfile.role?.toLowerCase();

      if (normalizedRole === "admin") {
        console.log("Fetching Admin Top Trades...");
        const topTrades = await dashboardService.getTopTrades();
        setTrades(topTrades);
      } else {
        console.log("Fetching Trader Recent Trades...");
        const recentTrades = await dashboardService.getRecentTrades();
        setTrades(recentTrades);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Actions (Standard CRUD) ---
  const createTrade = async (data: CreateTradeDTO) => {
    try {
      await dashboardService.createTrade(data);
      await fetchData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateTrade = async (id: string, data: UpdateTradeDTO) => {
    try {
      await dashboardService.updateTrade(id, data);
      await fetchData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const closeTrade = async (id: string, data: CloseTradeDTO) => {
    try {
      await dashboardService.closeTrade(id, data);
      await fetchData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      await dashboardService.deleteTrade(id);
      await fetchData();
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    user,
    summary,
    trades,
    chartData,
    loading,
    error,
    actions: {
      createTrade,
      updateTrade,
      closeTrade,
      deleteTrade,
      refresh: fetchData,
    },
  };
};

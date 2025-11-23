import { useState, useEffect, useCallback } from "react";
import { journalService } from "../api/journalService";
import { dashboardService } from "../../dashboard/api/dashboardService"; // Reuse mutations
import { Trade, PaginatedResponse } from "../../../types/api";
import { ModalMode } from "../../../components/shared/TradeFormModal";

export const useJournal = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "OPEN">("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      const status = filter === "OPEN" ? "OPEN" : undefined;

      const response = await journalService.getTrades({
        skip,
        limit: LIMIT,
        status,
      });

      setTrades(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Journal fetch error", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (newPage - 1) * LIMIT < total) {
      setPage(newPage);
    }
  };

  // Wrapper for mutations that also refreshes the list
  const handleMutation = async (
    mode: ModalMode,
    id: string | null,
    data: any
  ) => {
    try {
      if (mode === "ADD") await dashboardService.createTrade(data);
      if (mode === "EDIT" && id) await dashboardService.updateTrade(id, data);
      if (mode === "CLOSE" && id) await dashboardService.closeTrade(id, data);

      fetchTrades(); // Refresh table
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    await dashboardService.deleteTrade(id);
    fetchTrades();
  };

  return {
    trades,
    loading,
    total,
    page,
    filter,
    setFilter: (f: "ALL" | "OPEN") => {
      setFilter(f);
      setPage(1);
    }, // Reset page on filter change
    handlePageChange,
    handleMutation,
    handleDelete,
    LIMIT,
  };
};

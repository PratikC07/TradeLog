import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOutletContext } from "react-router-dom";
// Components
import { StatsGrid } from "./StatsGrid";
import { DeleteModal } from "./DeleteModal";
import { TradesTable } from "../../../components/shared/TradesTable";
import {
  TradeFormModal,
  ModalMode,
} from "../../../components/shared/TradeFormModal";
import { Plus } from "../../../components/ui/Icons";
// Logic & Types
import { useDashboard } from "../hooks/useDashboard";
import { Trade } from "../../../types/api";

export const Dashboard: React.FC = () => {
  // 1. Get 'user' directly from the hook that fetches the data
  const { summary, trades, chartData, loading, actions, user } = useDashboard();

  // 2. Derive isAdmin from THAT user object
  // Safe check with optional chaining and lowercase
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Debug log to verify UI logic
  console.log("Dashboard Render - Is Admin?", isAdmin);

  // 2. UI State
  const [modalMode, setModalMode] = useState<ModalMode>("NONE");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Handlers ---
  const onFormSubmit = async (mode: ModalMode, data: any) => {
    let success = false;
    if (mode === "ADD") success = await actions.createTrade(data);
    else if (mode === "EDIT" && selectedTrade)
      success = await actions.updateTrade(selectedTrade.id, data);
    else if (mode === "CLOSE" && selectedTrade)
      success = await actions.closeTrade(selectedTrade.id, data);

    if (success) {
      setModalMode("NONE");
      setFormError(null);
    } else {
      setFormError("Operation failed. Please check input values.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!tradeToDelete) return;
    setIsDeleting(true);
    const success = await actions.deleteTrade(tradeToDelete);
    setIsDeleting(false);
    if (success) setIsDeleteModalOpen(false);
  };

  // Loading State
  if (loading && !summary) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 font-mono animate-pulse">
        INITIALIZING DASHBOARD...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
      {/* ACTIONS HEADER - TRADER ONLY */}
      {!isAdmin && (
        <div className="flex justify-end items-center gap-4 mb-[-20px] relative z-10">
          <button
            onClick={() => {
              setSelectedTrade(null);
              setModalMode("ADD");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-[#b3e600] transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          >
            <Plus size={18} /> Add Trade
          </button>
        </div>
      )}

      {/* 1. STATS GRID */}
      {summary && <StatsGrid summary={summary} />}

      {/* 2. CHART SECTION */}
      <div className="w-full h-[350px] md:h-[500px] p-6 rounded-2xl bg-dark-card border border-white/5 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-lg font-bold text-white">
            {isAdmin ? "Platform Growth" : "Equity Curve"}
          </h2>
          <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400 border border-white/5">
            Cumulative PnL
          </span>
        </div>

        <div className="flex-1 min-h-0 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ccff00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ccff00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#222"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#444"
                axisLine={false}
                tickLine={false}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
                minTickGap={30}
                tickMargin={12}
              />
              <YAxis
                stroke="#444"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  ybBorderColor: "#333",
                }}
                itemStyle={{ color: "#ccff00" }}
                formatter={(value: number) => [`$${value}`, "Net PnL"]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Area
                type="monotone"
                dataKey="cumulative_pnl"
                stroke="#ccff00"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVal)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. TRADES TABLE */}
      <div className="w-full min-h-[400px] flex flex-col pb-8">
        <TradesTable
          trades={trades}
          isAdmin={isAdmin}
          // Explicit Title Change for Admin
          title={isAdmin ? "Top 5 Highest Profitable Trades" : "Recent Trades"}
          showViewAll={!isAdmin} // Strictly hide for Admin
          isLoading={loading}
          onEdit={(t) => {
            setSelectedTrade(t);
            setModalMode("EDIT");
          }}
          onDelete={(id) => {
            setTradeToDelete(id);
            setIsDeleteModalOpen(true);
          }}
          onClosePosition={(t) => {
            setSelectedTrade(t);
            setModalMode("CLOSE");
          }}
        />
      </div>

      {/* MODALS */}
      <TradeFormModal
        isOpen={modalMode !== "NONE"}
        mode={modalMode}
        trade={selectedTrade}
        onClose={() => {
          setModalMode("NONE");
          setFormError(null);
        }}
        onSubmit={onFormSubmit}
        error={formError}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

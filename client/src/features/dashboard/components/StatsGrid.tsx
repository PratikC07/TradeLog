import React from "react";
import { DashboardSummary, isAdminSummary } from "../../../types/api";
import {
  ArrowUpRight,
  ArrowDownRight,
  User,
  Wallet,
  LayoutDashboard,
  Activity,
  TrendingUp,
} from "../../../components/ui/Icons";

// --- HELPER COMPONENTS ---

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: React.ReactNode;
  color: string;
  className?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  color,
  className = "",
  icon,
}) => (
  <div
    className={`p-5 md:p-6 rounded-2xl bg-dark-card border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col justify-between ${className}`}
  >
    <div className="relative z-10">
      <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wider truncate">
        {title}
      </h3>
      <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-2 overflow-hidden">
        {/* Added 'title' prop to show full value on hover even if truncated */}
        <span className="truncate" title={String(value)}>
          {value}
        </span>
      </div>
      {subValue && (
        <div className="mt-2 text-xs md:text-sm truncate">{subValue}</div>
      )}
    </div>
    <div
      className={`absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 rounded-full blur-[50px] md:blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-30 transition-opacity ${
        color.includes("neon-green")
          ? "bg-neon-green"
          : color.includes("neon-blue")
          ? "bg-neon-blue"
          : color.includes("red")
          ? "bg-red-500"
          : "bg-purple-500"
      }`}
    ></div>
    {icon && (
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-125 md:scale-150">
        {icon}
      </div>
    )}
  </div>
);

// --- IMPROVED USER STAT CARD (TOP GAINER/LOSER) ---
const UserStatCard: React.FC<{
  title: string;
  user: { username: string; email: string; total_pnl: number } | null;
  type: "gainer" | "loser";
}> = ({ title, user, type }) => {
  const isGainer = type === "gainer";

  const colorClass = isGainer ? "text-neon-green" : "text-red-500";
  const borderColor = isGainer
    ? "group-hover:border-neon-green/30"
    : "group-hover:border-red-500/30";
  const bgGradient = isGainer
    ? "from-neon-green/5 to-transparent"
    : "from-red-500/5 to-transparent";

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`col-span-2 lg:col-span-2 p-6 rounded-2xl bg-dark-card border border-white/5 relative overflow-hidden group ${borderColor} transition-all duration-300 flex flex-col justify-center bg-gradient-to-br ${bgGradient}`}
    >
      {/* Background Glow */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 blur-[80px] rounded-full pointer-events-none opacity-20 ${
          isGainer ? "bg-neon-green" : "bg-red-500"
        }`}
      />

      {user ? (
        <div className="relative z-10 w-full">
          <div className="flex justify-between items-start mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm ${
                isGainer
                  ? "bg-neon-green/10 border-neon-green/20 text-neon-green"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {isGainer ? (
                <TrendingUp size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {title}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                  isGainer
                    ? "bg-gradient-to-br from-neon-green/20 to-green-900/50 text-neon-green border border-neon-green/20"
                    : "bg-gradient-to-br from-red-500/20 to-red-900/50 text-red-500 border border-red-500/20"
                }`}
              >
                {getInitials(user.username)}
              </div>
              <div className="min-w-0">
                <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Trader
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                  {user.username}
                </h3>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Realized PnL
              </p>
              <div
                className={`text-2xl md:text-3xl font-mono font-bold tracking-tighter ${colorClass}`}
              >
                {isGainer ? "+" : ""}
                {/* Use Compact Format here too if values are huge */}
                {formatCompactCurrency(user.total_pnl)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-6 text-center opacity-50">
          <div
            className={`mb-3 p-4 rounded-full bg-white/5 ${
              isGainer ? "text-neon-green" : "text-red-500"
            }`}
          >
            <User size={32} />
          </div>
          <h4 className="text-white font-medium text-lg">No {title} Data</h4>
          <p className="text-sm text-gray-500 mt-1">
            {isGainer
              ? "No profitable trades recorded yet."
              : "No realized losses recorded yet."}
          </p>
        </div>
      )}
    </div>
  );
};

const WinLossCard: React.FC<{ avgWin: number; avgLoss: number }> = ({
  avgWin,
  avgLoss,
}) => {
  const maxValue = Math.max(avgWin, avgLoss) * 1.2 || 1;
  return (
    <div className="flex-1 min-w-[100%] lg:min-w-[300px] p-5 md:p-6 rounded-2xl bg-dark-card border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col justify-center">
      <div className="relative z-10">
        <h3 className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-3 md:mb-4">
          Average Performance
        </h3>
        <div className="mb-3 md:mb-4">
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span className="text-gray-400">Avg Win</span>
            <span className="text-neon-green font-mono font-bold">
              ${avgWin.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              style={{ width: `${(avgWin / maxValue) * 100}%` }}
              className="h-full bg-neon-green rounded-full"
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span className="text-gray-400">Avg Loss</span>
            <span className="text-red-500 font-mono font-bold">
              ${avgLoss.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              style={{ width: `${(avgLoss / maxValue) * 100}%` }}
              className="h-full bg-red-500 rounded-full"
            ></div>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 w-full h-full bg-neon-purple/5 blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    </div>
  );
};

const BestAssetCard: React.FC<{ symbol: string; pnl: number }> = ({
  symbol,
  pnl,
}) => (
  <div className="flex-1 min-w-[100%] lg:min-w-[300px] p-5 md:p-6 rounded-2xl bg-gradient-to-br from-dark-card to-black border border-white/5 relative overflow-hidden group hover:border-neon-green/30 transition-all flex items-center justify-between">
    <div className="relative z-10">
      <h3 className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">
        Top Performer
      </h3>
      <div className="text-3xl md:text-4xl font-black text-white tracking-tight truncate">
        {symbol}
      </div>
      <div className="text-neon-green font-mono mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] md:text-xs bg-neon-green/10 px-2 py-0.5 rounded text-neon-green border border-neon-green/20 font-bold tracking-wide">
          NET RETURN
        </span>
        <div className="flex items-center gap-1 font-bold text-base md:text-lg">
          <ArrowUpRight size={18} />
          +${pnl.toLocaleString()}
        </div>
      </div>
    </div>
    <div className="relative z-10 ml-4">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/20 group-hover:scale-110 transition-transform duration-500">
        <TrendingUp size={24} className="text-neon-green md:w-8 md:h-8" />
      </div>
    </div>
    <div className="absolute right-0 bottom-0 w-48 h-48 bg-neon-green/10 rounded-full blur-[60px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
  </div>
);

// --- UTILITIES ---

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

// NEW: Compact formatter for large cards (e.g. $1.2M)
const formatCompactCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(val);
};

export const StatsGrid: React.FC<{ summary: DashboardSummary }> = ({
  summary,
}) => {
  if (isAdminSummary(summary)) {
    // --- ADMIN VIEW ---
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={summary.total_users}
          subValue={<span className="text-neon-blue">Active</span>}
          color="text-neon-blue"
          icon={<User size={40} />}
          className="col-span-1"
        />
        <StatCard
          title="Platform PnL"
          // Use Compact Format to prevent UI breaking on large numbers
          value={formatCompactCurrency(summary.total_platform_pnl)}
          subValue={
            <span
              className={
                summary.total_platform_pnl >= 0
                  ? "text-neon-green"
                  : "text-red-500"
              }
            >
              All Time
            </span>
          }
          color={
            summary.total_platform_pnl >= 0 ? "text-neon-green" : "text-red-500"
          }
          className="col-span-1"
          icon={<Wallet size={40} />}
        />
        <StatCard
          title="Total Trades"
          value={summary.total_trades}
          subValue="Executed"
          color="text-gray-400"
          className="col-span-1"
          icon={<LayoutDashboard size={40} />}
        />
        <StatCard
          title="Active Trades"
          value={summary.active_positions}
          subValue="Global Open"
          color="text-purple-500"
          className="col-span-1"
          icon={<Activity size={40} />}
        />

        <div className="hidden lg:block w-full h-px bg-white/5 col-span-4"></div>

        <UserStatCard
          title="Top Gainer"
          user={summary.top_gainer}
          type="gainer"
        />
        <UserStatCard title="Top Loser" user={summary.top_loser} type="loser" />
      </div>
    );
  } else {
    // --- TRADER VIEW ---
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-4 md:gap-6">
          <StatCard
            title="Net PnL"
            value={formatCurrency(summary.net_realized_pnl)}
            subValue={
              <span
                className={`flex items-center gap-1 ${
                  summary.net_realized_pnl >= 0
                    ? "text-neon-green"
                    : "text-red-500"
                }`}
              >
                {summary.net_realized_pnl >= 0 ? "Profitable" : "Drawdown"}
              </span>
            }
            color={
              summary.net_realized_pnl >= 0 ? "text-neon-green" : "text-red-500"
            }
            className="col-span-2 lg:flex-[1.5] lg:min-w-[280px]"
          />
          <StatCard
            title="Win Rate"
            value={`${summary.win_rate}%`}
            subValue="Ratio"
            color="text-neon-blue"
            icon={<Activity size={40} />}
            className="col-span-1 lg:flex-1"
          />
          <StatCard
            title="Profit Factor"
            value={summary.profit_factor}
            subValue="Risk Score"
            color="text-purple-500"
            className="col-span-1 lg:flex-1"
          />
          <StatCard
            title="Active Positions"
            value={summary.active_positions}
            subValue="Open"
            color="text-white"
            className="col-span-2 lg:flex-1"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <WinLossCard avgWin={summary.avg_win} avgLoss={summary.avg_loss} />
          {summary.best_asset ? (
            <BestAssetCard
              symbol={summary.best_asset.symbol}
              pnl={summary.best_asset.total_pnl}
            />
          ) : (
            <div className="flex-1 min-w-[100%] lg:min-w-[300px] p-5 md:p-6 rounded-2xl bg-dark-card border border-white/5 flex items-center justify-center text-gray-500 min-h-[140px]">
              No asset data available
            </div>
          )}
        </div>
      </div>
    );
  }
};

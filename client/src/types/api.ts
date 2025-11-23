// --- Auth & User ---
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: "trader" | "admin";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// --- Trades ---
export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  quantity: number;
  entry_price: number;
  entry_date: string;
  exit_price: number | null;
  exit_date: string | null;
  pnl: number | null;
  status: "OPEN" | "CLOSED";
  owner?: {
    username: string;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

// --- Analytics ---

export interface ChartDataPoint {
  date: string;
  pnl: number;
  cumulative_pnl: number;
}

// Specific shape for Trader
export interface TraderSummary {
  net_realized_pnl: number;
  profit_factor: number;
  win_rate: number;
  total_closed_trades: number;
  active_positions: number;
  avg_win: number;
  avg_loss: number;
  // UPDATED: Allow null
  best_asset: {
    symbol: string;
    total_pnl: number;
  } | null;
}

// Specific shape for Admin
export interface AdminSummary {
  total_users: number;
  total_trades: number;
  active_positions: number;
  total_platform_pnl: number;
  // UPDATED: Allow null
  top_gainer: {
    username: string;
    email: string;
    total_pnl: number;
  } | null;
  top_loser: {
    username: string;
    email: string;
    total_pnl: number;
  } | null;
}

export type DashboardSummary = TraderSummary | AdminSummary;

export function isAdminSummary(
  summary: DashboardSummary
): summary is AdminSummary {
  return (summary as AdminSummary).total_users !== undefined;
}

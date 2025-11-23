export enum ViewState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD'
}

export type AuthMode = 'LOGIN' | 'SIGNUP';

export interface Trade {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number | null;
  pnl: number | null;
  status: 'OPEN' | 'CLOSED';
  date: string;
}

export interface MarketData {
  time: string;
  value: number;
}
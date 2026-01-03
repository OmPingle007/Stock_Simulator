export interface StockData {
  ticker: string;
  name: string;
  shares: number;
  avgCost: number; // Purchase Price (Dec 1, 2025)
  currentPrice: number; // Current Price (Jan 2, 2026)
  previousClose: number; // For Day's Gain calculation
}

export interface StockConfig {
  ticker: string;
  targetAmount?: number; // Optional user-defined target investment amount in INR
}

export interface PortfolioConfig {
  totalInvestment: number;
  stocks: StockConfig[];
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  totalGainPercent: number;
  dayGain: number;
  dayGainPercent: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
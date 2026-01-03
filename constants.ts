import { PortfolioConfig } from './types';

export const INITIAL_INVESTMENT = 100000;

export const DEFAULT_PORTFOLIO: PortfolioConfig = {
  totalInvestment: 100000,
  stocks: [
    { ticker: 'NSE:TRENT' },
    { ticker: 'NSE:RELIANCE' },
    { ticker: 'NSE:SBIN' },
    { ticker: 'NSE:SAREGAMA' },
    { ticker: 'NSE:BHARTIARTL' },
    { ticker: 'NSE:TATASTEEL' },
    { ticker: 'NSE:HFCL' },
    { ticker: 'NSE:JSWSTEEL' },
    { ticker: 'NSE:JPPOWER' },
  ]
};

export const PURCHASE_DATE = "2025-12-01";
export const CURRENT_DATE = "2026-01-02";
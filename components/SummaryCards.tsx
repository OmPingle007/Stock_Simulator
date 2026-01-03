import React from 'react';
import { PortfolioSummary } from '../types';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const formatPercent = (val: number) => 
    `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Net Worth Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-32">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Net Portfolio Value</div>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900">{formatCurrency(summary.totalValue)}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
            Invested: {formatCurrency(summary.totalInvested)}
        </div>
      </div>

      {/* Total Gain Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-32">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Return</div>
        <div className="flex items-center gap-3">
             <span className={`text-3xl font-semibold ${summary.totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(summary.totalGain)}
             </span>
             <div className={`flex items-center px-2 py-0.5 rounded text-sm font-medium ${summary.totalGain >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {summary.totalGain >= 0 ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
                {formatPercent(summary.totalGainPercent)}
             </div>
        </div>
        <div className="text-xs text-slate-400 mt-1">
            Since Dec 1, 2025
        </div>
      </div>

      {/* Day Gain Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-32">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">Day's Gain</div>
        <div className="flex items-center gap-3">
             <span className={`text-3xl font-semibold ${summary.dayGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(summary.dayGain)}
             </span>
             <div className={`flex items-center px-2 py-0.5 rounded text-sm font-medium ${summary.dayGain >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {summary.dayGain >= 0 ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
                {formatPercent(summary.dayGainPercent)}
             </div>
        </div>
        <div className="text-xs text-slate-400 mt-1">
            vs Previous Close
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
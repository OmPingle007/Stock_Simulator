import React from 'react';
import { StockData } from '../types';

interface PortfolioTableProps {
  data: StockData[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ data }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
  
  const formatPercent = (val: number) => 
    `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4 text-right">Market Price</th>
              <th className="px-6 py-4 text-right">Day's Change</th>
              <th className="px-6 py-4 text-right">Shares</th>
              <th className="px-6 py-4 text-right">Avg Cost</th>
              <th className="px-6 py-4 text-right">Invested</th>
              <th className="px-6 py-4 text-right">Current Value</th>
              <th className="px-6 py-4 text-right">Total Gain/Loss</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {data.map((stock) => {
              const investedVal = stock.shares * stock.avgCost;
              const currentVal = stock.shares * stock.currentPrice;
              const totalGain = currentVal - investedVal;
              const totalGainPercent = (totalGain / investedVal) * 100;
              
              const dayChange = stock.currentPrice - stock.previousClose;
              const dayChangePercent = (dayChange / stock.previousClose) * 100;

              return (
                <tr key={stock.ticker} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded w-fit text-xs mb-1">{stock.ticker}</span>
                      <span className="text-slate-500 text-xs">{stock.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(stock.currentPrice)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex flex-col items-end ${dayChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      <span className="font-medium">{dayChange > 0 ? '+' : ''}{dayChange.toFixed(2)}</span>
                      <span className="text-xs opacity-80">{formatPercent(dayChangePercent)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {stock.shares.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {formatCurrency(stock.avgCost)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                     {formatCurrency(investedVal)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(currentVal)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex flex-col items-end ${totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                       <span className="font-semibold">{totalGain > 0 ? '+' : ''}{formatCurrency(totalGain)}</span>
                       <span className="text-xs bg-opacity-10 px-1.5 rounded mt-0.5 font-medium">
                         {formatPercent(totalGainPercent)}
                       </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
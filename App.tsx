import React, { useEffect, useState, useMemo } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { fetchPortfolioData } from './services/geminiService';
import { StockData, PortfolioSummary, LoadingState, PortfolioConfig } from './types';
import PortfolioTable from './components/PortfolioTable';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import EditPortfolioModal from './components/EditPortfolioModal';
import { RotateCcw, TrendingUp, Settings } from 'lucide-react';
import { DEFAULT_PORTFOLIO, PURCHASE_DATE, CURRENT_DATE } from './constants';

const App: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = async (config = portfolioConfig) => {
    setStatus(LoadingState.LOADING);
    try {
      const stockData = await fetchPortfolioData(config);
      setData(stockData);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfigSave = (newConfig: PortfolioConfig) => {
    setPortfolioConfig(newConfig);
    loadData(newConfig);
  };

  const summary: PortfolioSummary = useMemo(() => {
    if (data.length === 0) {
        return { totalValue: 0, totalInvested: 0, totalGain: 0, totalGainPercent: 0, dayGain: 0, dayGainPercent: 0 };
    }

    let totalValue = 0;
    let totalInvested = 0;
    let totalDayPreviousValue = 0;

    data.forEach(stock => {
      const shares = stock.shares;
      totalValue += shares * stock.currentPrice;
      totalInvested += shares * stock.avgCost;
      totalDayPreviousValue += shares * stock.previousClose;
    });

    const totalGain = totalValue - totalInvested;
    const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
    
    const dayGain = totalValue - totalDayPreviousValue;
    const dayGainPercent = totalDayPreviousValue > 0 ? (dayGain / totalDayPreviousValue) * 100 : 0;

    return {
      totalValue,
      totalInvested,
      totalGain,
      totalGainPercent,
      dayGain,
      dayGainPercent
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Analytics />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
                <TrendingUp size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-800">My Portfolio</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-sm text-slate-500">
             <div className="hidden md:flex flex-col items-end">
                <span>Simulation Date: <span className="font-medium text-slate-900">{CURRENT_DATE}</span></span>
                <span className="text-xs">Purchased: {PURCHASE_DATE}</span>
             </div>
             
             <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium ml-2"
             >
                <Settings size={18} />
                <span className="hidden sm:inline">Edit Portfolio</span>
             </button>

             <button 
                onClick={() => loadData()} 
                disabled={status === LoadingState.LOADING}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                title="Refresh Simulation"
             >
                <RotateCcw size={18} className={status === LoadingState.LOADING ? "animate-spin" : ""} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {status === LoadingState.ERROR && (
           <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
             <p>Failed to load simulated market data. Please check your API key and try again.</p>
             <button onClick={() => loadData()} className="text-sm font-medium underline">Retry</button>
           </div>
        )}

        {status === LoadingState.LOADING && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 animate-pulse">Simulating market conditions...</p>
          </div>
        )}

        {(status === LoadingState.SUCCESS || (status === LoadingState.LOADING && data.length > 0)) && (
          <>
            <SummaryCards summary={summary} />
            <Charts data={data} />
            
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Holdings</h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">INR Currency</span>
            </div>
            <PortfolioTable data={data} />
          </>
        )}
      </main>

      <EditPortfolioModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentConfig={portfolioConfig}
        onSave={handleConfigSave}
      />
    </div>
  );
};

export default App;
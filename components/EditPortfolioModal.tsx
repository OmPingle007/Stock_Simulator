import React, { useState } from 'react';
import { PortfolioConfig, StockConfig } from '../types';
import { X, Plus, Trash2, Save, IndianRupee } from 'lucide-react';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: PortfolioConfig;
  onSave: (config: PortfolioConfig) => void;
}

const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({ isOpen, onClose, currentConfig, onSave }) => {
  const [config, setConfig] = useState<PortfolioConfig>(currentConfig);

  if (!isOpen) return null;

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, totalInvestment: Number(e.target.value) });
  };

  const handleStockChange = (index: number, field: keyof StockConfig, value: string | number) => {
    const newStocks = [...config.stocks];
    // If value is empty string (for amount), set to undefined to let AI decide
    const finalValue = value === '' && field === 'targetAmount' ? undefined : value;
    newStocks[index] = { ...newStocks[index], [field]: finalValue };
    setConfig({ ...config, stocks: newStocks });
  };

  const removeStock = (index: number) => {
    const newStocks = config.stocks.filter((_, i) => i !== index);
    setConfig({ ...config, stocks: newStocks });
  };

  const addStock = () => {
    setConfig({
      ...config,
      stocks: [...config.stocks, { ticker: '', targetAmount: undefined }]
    });
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  // Calculate total currently allocated by user
  const allocatedSum = config.stocks.reduce((sum, stock) => sum + (stock.targetAmount || 0), 0);
  const remaining = config.totalInvestment - allocatedSum;
  const isOverBudget = remaining < 0;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Edit Portfolio</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Total Capital (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
              <input 
                type="number" 
                value={config.totalInvestment} 
                onChange={handleTotalChange}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="100000"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-medium text-slate-700">Stock Allocation</label>
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${isOverBudget ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
               <span>{isOverBudget ? 'Over Budget:' : 'Remaining:'}</span>
               <span>{formatCurrency(Math.abs(remaining))}</span>
            </div>
          </div>

          <div className="space-y-3">
            {config.stocks.map((stock, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Ticker (e.g. NSE:RELIANCE)"
                    value={stock.ticker}
                    onChange={(e) => handleStockChange(index, 'ticker', e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase placeholder:text-slate-400"
                  />
                </div>
                <div className="w-36 relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs mt-0.5">₹</span>
                  <input 
                    type="number" 
                    placeholder="Auto"
                    value={stock.targetAmount || ''}
                    onChange={(e) => handleStockChange(index, 'targetAmount', e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button 
                  onClick={() => removeStock(index)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove stock"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={addStock}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200 w-full justify-center"
          >
            <Plus size={16} />
            Add Stock Row
          </button>

          <div className="mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">
              <span className="font-semibold">Tip:</span> Leave the "₹" amount blank ("Auto") to let the system optimally allocate the remaining budget for that stock based on Dec 1st prices.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Save size={18} />
            Save & Update Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioModal;
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar, CartesianGrid, Legend } from 'recharts';
import { StockData } from '../types';

interface ChartsProps {
  data: StockData[];
}

const COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24', '#5C6BC0'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded text-sm z-50">
        <p className="font-medium text-slate-900">{payload[0].name}</p>
        <p className="text-slate-500">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const Charts: React.FC<ChartsProps> = ({ data }) => {
  // Prepare data for Allocation Pie Chart
  const allocationData = data.map(stock => ({
    name: stock.name.split(' ')[0], // Shorten name
    value: stock.shares * stock.currentPrice
  })).sort((a, b) => b.value - a.value);

  // Prepare data for Performance Bar Chart (Total Gain/Loss)
  const performanceData = data.map(stock => ({
    name: stock.ticker.split(':')[1], // Just ticker symbol
    "Total Gain/Loss": (stock.currentPrice - stock.avgCost) * stock.shares,
    color: (stock.currentPrice - stock.avgCost) >= 0 ? '#10b981' : '#e11d48'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Allocation Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Current Value Distribution</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
         <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Total Gain/Loss</h3>
         <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 11}} 
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value/1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11}}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
              />
              <Bar dataKey="Total Gain/Loss" radius={[4, 4, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Charts;
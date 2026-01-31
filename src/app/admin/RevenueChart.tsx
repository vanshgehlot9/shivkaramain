"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";

interface ChartData {
    label: string;
    income: number;
    expense: number;
}

interface RevenueChartProps {
    data: ChartData[];
    height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl shadow-black/50">
                <p className="text-gray-400 font-bold mb-2 text-xs uppercase tracking-wider">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <div
                                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                                style={{ backgroundColor: entry.color, color: entry.color }}
                            />
                            <span className="text-xs font-bold text-gray-300 capitalize min-w-[60px]">
                                {entry.name}:
                            </span>
                            <span className="text-sm font-black font-mono" style={{ color: entry.color }}>
                                ₹{(entry.value || 0).toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function RevenueChart({ data, height = 300 }: RevenueChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return Array(6).fill(0).map((_, i) => ({
                label: `M${i + 1}`,
                income: 1000 + Math.random() * 5000,
                expense: 500 + Math.random() * 3000
            }));
        }
        return data;
    }, [data]);

    return (
        <div className="w-full relative select-none" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>

                        {/* Glow Filter for Lines */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <CartesianGrid
                        vertical={false}
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="4 4"
                    />

                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                        dy={10}
                    />

                    <YAxis
                        hide={true} // Cleaner look, we have tooltips
                        domain={['auto', 'auto']}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.2 }}
                    />

                    <Area
                        type="monotone"
                        dataKey="expense"
                        name="Expense"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        animationDuration={1500}
                    />

                    <Area
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#ff7a00"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,0,0.5))' }}
                        animationDuration={1500}
                        animationBegin={300}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

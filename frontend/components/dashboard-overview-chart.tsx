'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DashboardOverviewChartProps = {
  data: Array<{
    key: string;
    label: string;
    value: number;
    color: string;
  }>;
};

export function DashboardOverviewChart({ data }: DashboardOverviewChartProps) {
  return (
    <div className="h-[280px] w-full min-w-0 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fc_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-[320px] sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#DCE5EF" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#607086', fontSize: 12, fontWeight: 700 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#607086', fontSize: 12, fontWeight: 700 }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(18, 58, 104, 0.06)' }}
            formatter={(value) => [String(value ?? 0), 'Registros']}
            contentStyle={{ borderRadius: 16, border: '1px solid #DCE5EF', boxShadow: '0 18px 42px rgba(15,23,42,.12)', fontWeight: 700 }}
          />
          <Bar dataKey="value" radius={[10, 10, 4, 4]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

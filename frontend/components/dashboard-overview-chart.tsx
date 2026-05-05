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
    <div className="h-[320px] w-full rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF1" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(29, 91, 255, 0.06)' }}
            formatter={(value) => [String(value ?? 0), 'Registros']}
            contentStyle={{ borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(8,35,63,.12)', fontWeight: 700 }}
          />
          <Bar dataKey="value" radius={[14, 14, 6, 6]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

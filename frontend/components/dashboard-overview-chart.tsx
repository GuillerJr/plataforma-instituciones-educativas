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
    <div className="surface-muted h-[280px] w-full min-w-0 p-3 sm:h-[320px] sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="oklch(92% 0.005 250)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'oklch(54% 0.012 250)', fontSize: 12, fontWeight: 650 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: 'oklch(54% 0.012 250)', fontSize: 12, fontWeight: 650 }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'oklch(97% 0.003 250)' }}
            formatter={(value) => [String(value ?? 0), 'Registros']}
            contentStyle={{ borderRadius: 12, border: 0, boxShadow: '0 18px 50px rgba(0,0,0,.12), rgba(0,0,0,.08) 0 0 0 1px', fontWeight: 650 }}
          />
          <Bar dataKey="value" radius={[6, 6, 3, 3]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

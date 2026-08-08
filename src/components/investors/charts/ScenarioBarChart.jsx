import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatBRL } from '@/data/investors/metrics';

export default function ScenarioBarChart({ data, series, legend, hidden = [], animate = true }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={8} margin={{ top: 8, right: 8, left: 4, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="providers"
          tick={{ fontSize: 12 }}
          label={{ value: legend.xAxis ?? '', position: 'insideBottom', offset: -12, fontSize: 11 }}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatBRL(v, { compact: true })} width={72} />
        <Tooltip
          formatter={(value, name) => [formatBRL(value), name]}
          labelFormatter={(l) => `${l} ${legend.providersSuffix ?? ''}`.trim()}
          contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 13 }}
        />
        <Legend />
        {series
          .filter((s) => !hidden.includes(s.key))
          .map((s) => (
            <Bar key={s.key} dataKey={s.key} name={legend[s.key]} fill={s.color} radius={[6, 6, 0, 0]} isAnimationActive={animate} />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

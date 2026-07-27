import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function FundsDonutChart({ data, colors, animate = true }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          isAnimationActive={animate}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, name) => [`${v}%`, name]}
          contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 13 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

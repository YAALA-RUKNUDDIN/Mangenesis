import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function RiskContributionChart({
  riskPercentage = 82,
  riskLevel = 'HIGH',
  drivers = [],
  height = 240,
}) {
  const data = drivers.map((d) => ({
    name: d.name,
    value: d.percentage,
    color: d.color,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      return (
        <div className="bg-[#131720] border border-[#262F3D] rounded-xl p-2.5 shadow-popover text-xs">
          <div className="font-medium text-slate-200">{d.name}</div>
          <div className="text-blue-400 font-mono mt-0.5 font-semibold">
            {d.value}% Impact
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Radial Donut Visualization */}
      <div className="relative flex items-center justify-center" style={{ width: 220, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              stroke="#131720"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-bold font-mono text-slate-100 leading-none">
            {riskPercentage}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-medium mt-1">
            Shortfall Risk
          </span>
          <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full mt-1 border ${
            riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
              : riskLevel === 'MEDIUM'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
          }`}>
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Driver Legend Cards */}
      <div className="flex-1 w-full space-y-1.5">
        {drivers.map((driver) => (
          <div
            key={driver.name}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: driver.color }}
              />
              <span className="text-slate-300 font-medium">
                {driver.name}
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {driver.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export default function ProductionForecastChart({
  historicalData = [],
  forecastData = [],
  height = 250,
  showHistorical = true,
}) {
  const chartData = [];

  if (showHistorical && historicalData.length > 0) {
    historicalData.forEach((item) => {
      chartData.push({
        date: item.date,
        dayLabel: `Day ${item.day}`,
        target: item.target,
        actual: item.actual,
        predicted: null,
        isForecast: false,
      });
    });
  }

  const lastHistorical = historicalData[historicalData.length - 1];
  if (showHistorical && lastHistorical && forecastData.length > 0) {
    chartData[chartData.length - 1].predicted = lastHistorical.actual;
  }

  forecastData.forEach((item) => {
    chartData.push({
      date: item.date,
      dayLabel: `Day +${item.day}`,
      target: item.target,
      actual: null,
      predicted: item.predicted,
      risk: item.risk,
      isForecast: true,
    });
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-850 border border-slate-700 rounded-lg p-3 shadow-dropdown text-xs min-w-[160px]">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-750 mb-2">
            <span className="font-semibold text-slate-200">{data.date}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {data.isForecast ? 'Forecast' : 'Actual'}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Target:</span>
              <span className="text-slate-200 font-medium">10,000 T</span>
            </div>
            {data.actual !== null && (
              <div className="flex items-center justify-between text-sky-400">
                <span>Actual:</span>
                <span className="font-semibold">{data.actual.toLocaleString()} T</span>
              </div>
            )}
            {data.predicted !== null && (
              <div className="flex items-center justify-between text-accent">
                <span>Predicted:</span>
                <span className="font-semibold">{data.predicted.toLocaleString()} T</span>
              </div>
            )}
            {data.risk && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-750 text-[10px]">
                <span className="text-slate-500">Risk:</span>
                <span
                  className={`font-semibold uppercase ${
                    data.risk === 'high'
                      ? 'text-status-danger'
                      : data.risk === 'medium'
                      ? 'text-status-warning'
                      : 'text-status-success'
                  }`}
                >
                  {data.risk}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1C2230" vertical={false} />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: '#242C3E' }}
            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'Inter' }}
          />

          <YAxis
            domain={[4000, 12000]}
            tickLine={false}
            axisLine={{ stroke: '#242C3E' }}
            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(val) => `${val / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Planned Target Line */}
          <ReferenceLine
            y={10000}
            stroke="#475569"
            strokeDasharray="4 4"
            label={{
              value: '10,000 T TARGET',
              position: 'insideTopLeft',
              fill: '#64748B',
              fontSize: 9,
              fontFamily: 'Inter',
            }}
          />

          {/* Historical Actual Production */}
          {showHistorical && (
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#0EA5E9"
              strokeWidth={2}
              fill="url(#histGradient)"
              dot={{ r: 2, fill: '#0EA5E9' }}
            />
          )}

          {/* AI Predicted Production */}
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#forecastGradient)"
            dot={{ r: 2.5, fill: '#3B82F6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

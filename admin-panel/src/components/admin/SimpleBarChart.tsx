'use client';

interface ChartPoint {
  label: string;
  value: number;
}

export default function SimpleBarChart({ data, valueLabel = '' }: { data: ChartPoint[]; valueLabel?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{d.label}</span>
            <span className="text-slate-300 font-medium">
              {valueLabel}{d.value.toLocaleString('ru-RU')}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

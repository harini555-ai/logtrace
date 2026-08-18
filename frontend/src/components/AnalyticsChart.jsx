import { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { CHART_COLORS } from '../utils/constants'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-base-900 border border-base-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color || entry.payload?.fill }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsChart({ analytics }) {
  const [view, setView] = useState('bar')

  const data = [
    { name: 'ERROR', value: analytics?.errorCount ?? 0 },
    { name: 'WARN', value: analytics?.warnCount ?? 0 },
    { name: 'INFO', value: analytics?.infoCount ?? 0 },
    { name: 'DEBUG', value: analytics?.debugCount ?? 0 },
  ]

  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="bg-base-850 border border-base-700 rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-200">Log Distribution</h3>
        <div className="flex items-center gap-1 bg-base-900 border border-base-700 rounded-lg p-1">
          <button
            onClick={() => setView('bar')}
            className={`p-1.5 rounded-md transition-colors ${view === 'bar' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Bar chart"
          >
            <BarChart3 size={14} />
          </button>
          <button
            onClick={() => setView('pie')}
            className={`p-1.5 rounded-md transition-colors ${view === 'pie' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Pie chart"
          >
            <PieChartIcon size={14} />
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-600">
            No log data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {view === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2436" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={CHART_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {data.filter((d) => d.value > 0).map((entry) => (
                    <Cell key={entry.name} fill={CHART_COLORS[entry.name]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

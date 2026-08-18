import { AlertCircle, Layers, ListTree, Server } from 'lucide-react'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-base-850 border border-base-700 rounded-xl p-4 flex items-center gap-4 hover:border-base-600 transition-colors">
      <div className={`p-3 rounded-lg ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-slate-100 tabular-nums">{value}</p>
      </div>
    </div>
  )
}

export default function StatsCards({ totalLogs, errorCount, activeServices }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        icon={ListTree}
        label="Total Logs"
        value={totalLogs.toLocaleString()}
        accent="bg-blue-500/15 text-blue-400"
      />
      <StatCard
        icon={AlertCircle}
        label="Error Count"
        value={errorCount.toLocaleString()}
        accent="bg-red-500/15 text-red-400"
      />
      <StatCard
        icon={Server}
        label="Active Services"
        value={activeServices.toLocaleString()}
        accent="bg-emerald-500/15 text-emerald-400"
      />
    </div>
  )
}

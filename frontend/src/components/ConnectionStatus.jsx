import { Wifi, WifiOff } from 'lucide-react'

export default function ConnectionStatus({ connected }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
        connected
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-red-500/10 text-red-400 border-red-500/30'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {connected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            connected ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
      </span>
      {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
      {connected ? 'Connected' : 'Disconnected'}
    </div>
  )
}

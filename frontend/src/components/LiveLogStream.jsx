import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Trash2, ArrowDownToLine, Terminal } from 'lucide-react'
import LogRow from './LogRow'

export default function LiveLogStream({ logs, paused, onTogglePause, onClear, onSelectLog, connected }) {
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [logs, autoScroll])

  return (
    <div className="bg-base-850 border border-base-700 rounded-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-700 bg-base-900/60">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Terminal size={16} className="text-brand-400" />
          Live Tail
          <span className="text-xs text-slate-500 font-normal">({logs.length} buffered)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoScroll((v) => !v)}
            title="Toggle auto-scroll"
            className={`p-1.5 rounded-md border transition-colors ${
              autoScroll
                ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                : 'border-base-600 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownToLine size={15} />
          </button>
          <button
            onClick={onTogglePause}
            title={paused ? 'Resume stream' : 'Pause stream'}
            className={`p-1.5 rounded-md border transition-colors ${
              paused
                ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                : 'border-base-600 text-slate-400 hover:text-slate-200'
            }`}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            onClick={onClear}
            title="Clear screen"
            className="p-1.5 rounded-md border border-base-600 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="terminal-scroll flex-1 overflow-y-auto px-1 py-2 font-mono"
        style={{ minHeight: '360px', maxHeight: '480px' }}
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm py-16 gap-1">
            <Terminal size={28} className="mb-2 opacity-40" />
            {connected ? 'Waiting for incoming logs…' : 'Not connected to log stream'}
          </div>
        ) : (
          logs.map((log, idx) => (
            <LogRow key={`${log.id ?? idx}-${log.timestamp}-${idx}`} log={log} onClick={onSelectLog} />
          ))
        )}
      </div>

      {paused && (
        <div className="px-4 py-1.5 bg-yellow-500/10 text-yellow-400 text-xs text-center border-t border-yellow-500/20">
          Stream paused — new logs are being buffered but not displayed
        </div>
      )}
    </div>
  )
}

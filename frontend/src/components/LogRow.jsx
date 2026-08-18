import { LEVEL_STYLES } from '../utils/constants'

export function LevelBadge({ level }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.DEBUG
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {level}
    </span>
  )
}

function formatTime(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  return date.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(date.getMilliseconds()).padStart(3, '0')
}

export default function LogRow({ log, onClick }) {
  const style = LEVEL_STYLES[log.level] || LEVEL_STYLES.DEBUG

  return (
    <div
      onClick={() => onClick(log)}
      className="log-row-enter group flex items-start gap-3 px-3 py-1.5 rounded-md hover:bg-base-800/70 cursor-pointer border-l-2 border-transparent hover:border-brand-500 transition-colors"
    >
      <span className="text-[11px] text-slate-500 font-mono shrink-0 pt-0.5 w-24">{formatTime(log.timestamp)}</span>
      <span className="shrink-0 pt-0.5">
        <LevelBadge level={log.level} />
      </span>
      <span className="text-[11px] text-slate-500 font-mono shrink-0 pt-0.5 max-w-[140px] truncate hidden sm:block">
        {log.serviceName || '—'}
      </span>
      <span className={`text-sm font-mono truncate flex-1 ${style.text} group-hover:text-slate-100`}>
        {log.message}
      </span>
      {log.endpoint && (
        <span className="text-[11px] text-slate-600 font-mono shrink-0 pt-0.5 hidden md:block truncate max-w-[160px]">
          {log.endpoint}
        </span>
      )}
    </div>
  )
}

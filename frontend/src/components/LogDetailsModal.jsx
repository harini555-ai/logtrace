import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { LevelBadge } from './LogRow'

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Clipboard copy failed', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-base-600 text-slate-400 hover:text-slate-100 hover:border-base-500 transition-colors"
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export default function LogDetailsModal({ log, onClose }) {
  if (!log) return null

  const metadata = {
    id: log.id,
    serviceId: log.serviceId,
    serviceName: log.serviceName,
    level: log.level,
    endpoint: log.endpoint,
    clientIp: log.clientIp,
    timestamp: log.timestamp,
  }
  const metadataJson = JSON.stringify(metadata, null, 2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="bg-base-850 border border-base-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-700">
          <div className="flex items-center gap-3">
            <LevelBadge level={log.level} />
            <h2 className="text-sm font-semibold text-slate-100">Log Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-base-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto terminal-scroll px-5 py-4 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 font-medium">Message</p>
            <p className="text-sm font-mono text-slate-200 bg-base-900 border border-base-700 rounded-lg px-3 py-2 break-words">
              {log.message}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Metadata (JSON)</p>
              <CopyButton text={metadataJson} />
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-base-900 border border-base-700 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap">
{metadataJson}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Stack Trace</p>
              {log.stackTrace && <CopyButton text={log.stackTrace} />}
            </div>
            <pre className="text-xs font-mono text-red-300/90 bg-base-900 border border-base-700 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto terminal-scroll">
              {log.stackTrace || 'No stack trace available for this log entry.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

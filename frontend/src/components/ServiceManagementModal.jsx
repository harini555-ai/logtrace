import { useState } from 'react'
import { Check, Copy, Plus, Server, Trash2, X } from 'lucide-react'
import { ENVIRONMENTS } from '../utils/constants'
import { createService, deleteService } from '../api/serviceService'

function CopyInline({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }
  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-slate-100 transition-colors shrink-0">
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  )
}

export default function ServiceManagementModal({ services, onClose, onServicesChanged }) {
  const [serviceName, setServiceName] = useState('')
  const [environment, setEnvironment] = useState('DEV')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!serviceName.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createService({ serviceName: serviceName.trim(), environment })
      setServiceName('')
      await onServicesChanged()
    } catch (err) {
      setError(err.message || 'Failed to create service')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteService(id)
      await onServicesChanged()
    } catch (err) {
      setError(err.message || 'Failed to delete service')
    }
  }

  const curlFor = (service) =>
    `curl -X POST ${apiBase}/logs/ingest \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: ${service.apiKey}" \\
  -d '{
    "level": "ERROR",
    "message": "Payment gateway timeout",
    "stackTrace": "java.net.SocketTimeoutException...",
    "endpoint": "/api/payments/charge"
  }'`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="bg-base-850 border border-base-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-700">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-brand-400" />
            <h2 className="text-sm font-semibold text-slate-100">Manage Services</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-base-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto terminal-scroll px-5 py-4 space-y-5">
          {/* Add new service form */}
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2">
            <input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Service name (e.g. checkout-api)"
              className="flex-1 bg-base-900 border border-base-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="bg-base-900 border border-base-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>{env}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={submitting || !serviceName.trim()}
              className="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={15} />
              Add
            </button>
          </form>
          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Service list */}
          <div className="space-y-2">
            {services.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No services registered yet.</p>
            )}
            {services.map((service) => (
              <div key={service.id} className="border border-base-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-base-900/60">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{service.serviceName}</p>
                    <p className="text-[11px] text-slate-500">{service.environment}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                      className="text-xs px-2.5 py-1 rounded-md border border-base-600 text-slate-300 hover:border-base-500 transition-colors"
                    >
                      {expandedId === service.id ? 'Hide' : 'View'} API Key
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {expandedId === service.id && (
                  <div className="px-3 py-3 space-y-3 border-t border-base-700">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">API Key</p>
                      <div className="flex items-center gap-2 bg-base-900 border border-base-700 rounded-md px-2.5 py-1.5">
                        <code className="text-xs font-mono text-brand-400 truncate flex-1">{service.apiKey}</code>
                        <CopyInline text={service.apiKey} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Sample cURL</p>
                      <pre className="text-[11px] font-mono text-slate-300 bg-base-900 border border-base-700 rounded-md px-2.5 py-2 overflow-x-auto whitespace-pre">
{curlFor(service)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

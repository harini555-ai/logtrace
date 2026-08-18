import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, Server as ServerIcon } from 'lucide-react'
import ConnectionStatus from './components/ConnectionStatus'
import StatsCards from './components/StatsCards'
import LiveLogStream from './components/LiveLogStream'
import FilterBar from './components/FilterBar'
import AnalyticsChart from './components/AnalyticsChart'
import LogDetailsModal from './components/LogDetailsModal'
import ServiceManagementModal from './components/ServiceManagementModal'
import useWebSocket from './hooks/useWebSocket'
import { fetchServices } from './api/serviceService'
import { fetchAnalyticsSummary } from './api/logService'

const MAX_BUFFERED_LOGS = 300
const POLL_INTERVAL_MS = 15000

export default function App() {
  const [services, setServices] = useState([])
  const [liveLogs, setLiveLogs] = useState([])
  const [paused, setPaused] = useState(false)

  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [selectedLevels, setSelectedLevels] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [analytics, setAnalytics] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)
  const [showServiceModal, setShowServiceModal] = useState(false)

  const topic = selectedServiceId ? `/topic/logs/${selectedServiceId}` : '/topic/logs/all'

  const handleIncomingLog = useCallback((log) => {
    setLiveLogs((prev) => [log, ...prev].slice(0, MAX_BUFFERED_LOGS))
  }, [])

  const { connected } = useWebSocket({ topic, paused, onMessage: handleIncomingLog })

  const loadServices = useCallback(async () => {
    try {
      const res = await fetchServices()
      setServices(res.data || [])
    } catch (err) {
      console.error('Failed to load services', err)
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await fetchAnalyticsSummary({ serviceId: selectedServiceId })
      setAnalytics(res.data)
    } catch (err) {
      console.error('Failed to load analytics', err)
    }
  }, [selectedServiceId])

  // Initial + periodic data loads
  useEffect(() => {
    loadServices()
  }, [loadServices])

  useEffect(() => {
    loadAnalytics()
    const interval = setInterval(loadAnalytics, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [loadAnalytics])

  // Reset live buffer when switching the subscribed topic (service filter change)
  useEffect(() => {
    setLiveLogs([])
  }, [selectedServiceId])

  // Client-side filtering of the live buffer (level + search) on top of the
  // server-selected topic (service scope already applied by subscription)
  const displayedLogs = useMemo(() => {
    return liveLogs.filter((log) => {
      if (selectedLevels.length > 0 && !selectedLevels.includes(log.level)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const inMessage = log.message?.toLowerCase().includes(q)
        const inStack = log.stackTrace?.toLowerCase().includes(q)
        if (!inMessage && !inStack) return false
      }
      return true
    })
  }, [liveLogs, selectedLevels, searchQuery])

  const totalLogs = analytics?.totalLogs ?? 0
  const errorCount = analytics?.errorCount ?? 0
  const activeServices = services.length

  return (
    <div className="min-h-screen bg-base-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-base-700 bg-base-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
              <Activity size={16} className="text-brand-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-100 leading-none">LogTrace</h1>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">Distributed Log Aggregator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionStatus connected={connected} />
            <button
              onClick={() => setShowServiceModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium bg-base-850 hover:bg-base-800 border border-base-700 hover:border-base-600 text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ServerIcon size={14} />
              Services
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatsCards totalLogs={totalLogs} errorCount={errorCount} activeServices={activeServices} />

        <FilterBar
          services={services}
          selectedServiceId={selectedServiceId}
          onServiceChange={setSelectedServiceId}
          selectedLevels={selectedLevels}
          onLevelsChange={setSelectedLevels}
          onSearchChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveLogStream
              logs={displayedLogs}
              paused={paused}
              onTogglePause={() => setPaused((p) => !p)}
              onClear={() => setLiveLogs([])}
              onSelectLog={setSelectedLog}
              connected={connected}
            />
          </div>
          <div>
            <AnalyticsChart analytics={analytics} />
          </div>
        </div>
      </main>

      {selectedLog && <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
      {showServiceModal && (
        <ServiceManagementModal
          services={services}
          onClose={() => setShowServiceModal(false)}
          onServicesChanged={loadServices}
        />
      )}
    </div>
  )
}

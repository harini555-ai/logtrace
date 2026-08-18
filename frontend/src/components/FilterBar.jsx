import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { LOG_LEVELS, LEVEL_STYLES } from '../utils/constants'

export default function FilterBar({ services, selectedServiceId, onServiceChange, selectedLevels, onLevelsChange, onSearchChange }) {
  const [searchInput, setSearchInput] = useState('')
  const [levelMenuOpen, setLevelMenuOpen] = useState(false)
  const levelMenuRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearchChange(searchInput)
    }, 400)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  useEffect(() => {
    function handleClickOutside(e) {
      if (levelMenuRef.current && !levelMenuRef.current.contains(e.target)) {
        setLevelMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLevel = (level) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter((l) => l !== level))
    } else {
      onLevelsChange([...selectedLevels, level])
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search message or stack trace…"
          className="w-full bg-base-850 border border-base-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Service dropdown */}
      <select
        value={selectedServiceId ?? ''}
        onChange={(e) => onServiceChange(e.target.value ? Number(e.target.value) : null)}
        className="bg-base-850 border border-base-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 min-w-[160px]"
      >
        <option value="">All Services</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.serviceName} ({s.environment})
          </option>
        ))}
      </select>

      {/* Level multi-select */}
      <div className="relative" ref={levelMenuRef}>
        <button
          onClick={() => setLevelMenuOpen((v) => !v)}
          className="flex items-center justify-between gap-2 bg-base-850 border border-base-700 rounded-lg px-3 py-2 text-sm text-slate-200 min-w-[160px] hover:border-base-600 transition-colors"
        >
          <span>{selectedLevels.length === 0 ? 'All Levels' : `${selectedLevels.length} Level${selectedLevels.length > 1 ? 's' : ''}`}</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        {levelMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-44 bg-base-850 border border-base-700 rounded-lg shadow-xl z-20 p-1.5">
            {LOG_LEVELS.map((level) => {
              const active = selectedLevels.includes(level)
              const style = LEVEL_STYLES[level]
              return (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                    active ? 'bg-base-700' : 'hover:bg-base-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-slate-200">{level}</span>
                  {active && <Check size={13} className="ml-auto text-brand-400" />}
                </button>
              )
            })}
            {selectedLevels.length > 0 && (
              <button
                onClick={() => onLevelsChange([])}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-1 pt-1.5 border-t border-base-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Check(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

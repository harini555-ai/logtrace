export const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG']

export const LEVEL_STYLES = {
  ERROR: {
    badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-500',
    text: 'text-red-400',
  },
  WARN: {
    badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-500',
    text: 'text-yellow-400',
  },
  INFO: {
    badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-500',
    text: 'text-blue-400',
  },
  DEBUG: {
    badge: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    dot: 'bg-gray-500',
    text: 'text-gray-400',
  },
}

export const CHART_COLORS = {
  ERROR: '#ef4444',
  WARN: '#eab308',
  INFO: '#3b82f6',
  DEBUG: '#9ca3af',
}

export const ENVIRONMENTS = ['PROD', 'DEV', 'STAGING']

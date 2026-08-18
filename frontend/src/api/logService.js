import axiosClient from './axiosClient'

/**
 * Fetch a paginated, filterable list of logs.
 * @param {Object} params
 * @param {number} [params.serviceId]
 * @param {string[]} [params.levels]
 * @param {string} [params.query]
 * @param {string} [params.from] ISO date-time
 * @param {string} [params.to] ISO date-time
 * @param {number} [params.page]
 * @param {number} [params.size]
 */
export const fetchLogs = (params = {}) => {
  const searchParams = new URLSearchParams()

  if (params.serviceId) searchParams.append('serviceId', params.serviceId)
  if (params.query) searchParams.append('query', params.query)
  if (params.from) searchParams.append('from', params.from)
  if (params.to) searchParams.append('to', params.to)
  searchParams.append('page', params.page ?? 0)
  searchParams.append('size', params.size ?? 25)

  if (params.levels && params.levels.length > 0) {
    params.levels.forEach((lvl) => searchParams.append('levels', lvl))
  }

  return axiosClient.get(`/logs?${searchParams.toString()}`)
}

export const fetchAnalyticsSummary = (params = {}) => {
  const searchParams = new URLSearchParams()
  if (params.serviceId) searchParams.append('serviceId', params.serviceId)
  if (params.from) searchParams.append('from', params.from)
  if (params.to) searchParams.append('to', params.to)

  return axiosClient.get(`/analytics/summary?${searchParams.toString()}`)
}

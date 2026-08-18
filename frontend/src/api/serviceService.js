import axiosClient from './axiosClient'

export const fetchServices = () => axiosClient.get('/services')

export const createService = (payload) => axiosClient.post('/services', payload)

export const regenerateApiKey = (id) => axiosClient.post(`/services/${id}/regenerate-key`)

export const deleteService = (id) => axiosClient.delete(`/services/${id}`)

import axios from 'axios'

// Production must go through the same-origin /api proxy (vercel.json), otherwise browsers block the auth cookie as third-party
export const API_BASE_URL = import.meta.env.PROD ? '/api' : import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

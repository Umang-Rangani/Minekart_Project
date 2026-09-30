import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://minekart-api.vercel.app',
  withCredentials: true,
})

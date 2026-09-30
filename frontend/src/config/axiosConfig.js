import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://minekart-project.vercel.app',
  withCredentials: true,
})

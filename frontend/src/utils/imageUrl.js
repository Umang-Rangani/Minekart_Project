import { API_BASE_URL } from '../config/axiosConfig'

// Uploaded files are either absolute URLs (Vercel Blob) or paths served by the API (/uploads/...)
export const getImageUrl = (path) => {
  if (!path) {
    return ''
  }

  if (/^(https?:|blob:|data:)/.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

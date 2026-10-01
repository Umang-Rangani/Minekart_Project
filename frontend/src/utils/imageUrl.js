// Uploaded files are either absolute URLs (Vercel Blob) or paths served by the API (/uploads/...)
export const getImageUrl = (path) => {
  if (!path) {
    return ''
  }

  if (/^(https?:|blob:|data:)/.test(path)) {
    return path
  }

  return `${import.meta.env.VITE_API_URL}${path}`
}

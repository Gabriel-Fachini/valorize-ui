import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!baseUrl) {
  throw new Error('Api base url environment variable is required')
}

// Uma única instância simples do Axios
export const api = axios.create({
  baseURL: baseUrl.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
})

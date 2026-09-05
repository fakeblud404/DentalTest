const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export async function readJsonResponse<T = unknown>(response: Response): Promise<T> {
  const body = await response.text()
  let data: unknown

  if (body.trim()) {
    try {
      data = JSON.parse(body)
    } catch {
      throw new Error(
        `API returned a non-JSON response (HTTP ${response.status}). Check that the backend URL is configured correctly.`
      )
    }
  }

  if (!response.ok) {
    const error = data && typeof data === 'object' && 'error' in data
      ? String(data.error)
      : `Request failed (HTTP ${response.status})`
    throw new Error(error)
  }

  if (data === undefined) {
    throw new Error(`API returned an empty response (HTTP ${response.status}).`)
  }

  return data as T
}
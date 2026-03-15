import { createClient } from '@/lib/supabase/client'

const API_BASE = '/api/v1'

interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
  request_id: string
}

interface ApiError {
  error: string
  code: string
  request_id: string
  timestamp: string
}

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    return headers
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers = await this.getAuthHeaders()
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err: ApiError = await res.json()
      throw new Error(err.error || `API error: ${res.status}`)
    }

    const json: ApiResponse<T> = await res.json()
    return json.data
  }

  get<T>(path: string) { return this.request<T>('GET', path) }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body) }
  put<T>(path: string, body?: unknown) { return this.request<T>('PUT', path, body) }
  patch<T>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body) }
  delete<T>(path: string) { return this.request<T>('DELETE', path) }
}

export const api = new ApiClient()

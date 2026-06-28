const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

function getToken() {
  return localStorage.getItem("id_token")
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

async function parseError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => ({} as Record<string, unknown>))
  const message =
    (body && typeof (body as { message?: string }).message === "string"
      ? (body as { message: string }).message
      : null) ?? "Request failed"
  return new ApiError(res.status, message, body)
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) throw await parseError(res)
  return res.json()
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw await parseError(res)
  return res.json()
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw await parseError(res)
  return res.json()
}

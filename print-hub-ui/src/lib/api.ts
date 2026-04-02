const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

function getToken() {
  return localStorage.getItem("id_token")
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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "Request failed")
  }

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "Request failed")
  }

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "Request failed")
  }

  return res.json()
}

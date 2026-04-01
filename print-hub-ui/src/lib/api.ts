const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = localStorage.getItem("auth_token")

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

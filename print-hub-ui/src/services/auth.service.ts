import { apiPost } from "../lib/api"

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  // TODO: adjust fields based on actual API response shape
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  // TODO: update path once confirmed
  return apiPost<LoginResponse>("/admin/auth/signIn", payload)
}

import { apiPost } from "../lib/api"

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
    expiresIn: string
  }
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  // TODO: update path once confirmed
  return apiPost<LoginResponse>("/admin/auth/signIn", payload)
}

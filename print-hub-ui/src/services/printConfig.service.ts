import { apiDelete, apiGet, apiPatch, apiPost } from "../lib/api"

export interface PaperQuality {
  name: string
  gsm: string
  extra: number
}

export interface PrintSize {
  name: string
  width: number
  height: number
  extra: number
}

export interface PrintConfigOptions {
  paperQualities: PaperQuality[]
  sizes: PrintSize[]
}

export interface PrintConfigPricing {
  baseRate: number
}

export interface PrintConfig {
  _id?: string
  name: string
  options: PrintConfigOptions
  pricing: PrintConfigPricing
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type PrintConfigInput = Omit<PrintConfig, "_id" | "createdAt" | "updatedAt">

interface Envelope<T> {
  success?: boolean
  message?: string
  data: T
}

const BASE = "/admin/print-config"

export async function createPrintConfig(payload: PrintConfigInput): Promise<PrintConfig> {
  const res = await apiPost<Envelope<PrintConfig>>(`${BASE}/add`, payload)
  return res.data
}

export async function fetchAllPrintConfigs(): Promise<PrintConfig[]> {
  const res = await apiGet<Envelope<PrintConfig[]>>(`${BASE}/get`)
  return res.data ?? []
}

export async function fetchPrintConfig(id: string): Promise<PrintConfig> {
  const res = await apiGet<Envelope<PrintConfig>>(`${BASE}/get/${id}`)
  return res.data
}

export async function updatePrintConfig(
  id: string,
  payload: Partial<PrintConfigInput>,
): Promise<PrintConfig> {
  const res = await apiPatch<Envelope<PrintConfig>>(`${BASE}/update/${id}`, payload)
  return res.data
}

export async function deletePrintConfig(id: string): Promise<void> {
  await apiDelete<Envelope<unknown>>(`${BASE}/delete/${id}`)
}

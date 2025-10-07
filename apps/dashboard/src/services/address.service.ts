import type { Address, AddressInput } from '@/types/address.types'
import { api } from './api'

interface ListAddressesResponse {
  addresses: Address[]
}

interface CreateAddressResponse {
  message: string
  address: Address
}

interface UpdateAddressResponse {
  message: string
  address: Address
}

interface DeleteAddressResponse {
  message: string
}

interface SetDefaultResponse {
  message: string
}

export const addressService = {
  async list(): Promise<Address[]> {
    const response = await api.get<ListAddressesResponse>('/addresses')
    return response.data.addresses
  },

  async create(input: AddressInput): Promise<Address> {
    const response = await api.post<CreateAddressResponse>('/addresses', input)
    return response.data.address
  },

  async update(id: string, input: AddressInput): Promise<Address> {
    const response = await api.put<UpdateAddressResponse>(`/addresses/${id}`, input)
    return response.data.address
  },

  async remove(id: string): Promise<void> {
    await api.delete<DeleteAddressResponse>(`/addresses/${id}`)
  },

  async setDefault(id: string): Promise<void> {
    await api.post<SetDefaultResponse>(`/addresses/${id}/set-default`)
  },
}

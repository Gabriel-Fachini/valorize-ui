export interface Address {
  id: string
  userId: string
  name: string
  street: string
  number: string
  complement?: string | null
  neighborhood?: string | null
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AddressInput {
  name: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

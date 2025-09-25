export interface Address {
  id: string
  recipientName: string
  phone?: string
  zip: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  country: string
  createdAt: string
  updatedAt: string
}

export type AddressInput = Omit<Address, 'id' | 'createdAt' | 'updatedAt'>

export interface AddressWithDefault extends Address {
  isDefault: boolean
}

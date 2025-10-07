export interface Address {
  id: string
  userId: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AddressInput = Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDefault'>

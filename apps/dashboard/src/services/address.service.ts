import type { Address, AddressInput } from '@/types/address.types'

const STORAGE_KEY = 'valorize_addresses'

interface AddressStore {
  items: Address[]
  defaultId?: string
}

function loadStore(): AddressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AddressStore
  } catch { /* ignore */ }
  return { items: [], defaultId: undefined }
}

function saveStore(store: AddressStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch { /* ignore */ }
}

function genId() {
  return `addr_${Math.random().toString(36).slice(2, 10)}`
}

export const addressService = {
  async list(): Promise<{ items: Address[]; defaultId?: string }> {
    const store = loadStore()
    return { items: store.items, defaultId: store.defaultId }
  },

  async create(input: AddressInput): Promise<Address> {
    const store = loadStore()
    const now = new Date().toISOString()
    const address: Address = { id: genId(), createdAt: now, updatedAt: now, ...input }
    store.items.push(address)
  store.defaultId ??= address.id
    saveStore(store)
    return address
  },

  async update(id: string, input: AddressInput): Promise<Address> {
    const store = loadStore()
    const idx = store.items.findIndex(a => a.id === id)
    if (idx === -1) throw new Error('Endereço não encontrado')
    const now = new Date().toISOString()
    const updated: Address = { ...store.items[idx], ...input, updatedAt: now }
    store.items[idx] = updated
    saveStore(store)
    return updated
  },

  async remove(id: string): Promise<void> {
    const store = loadStore()
    store.items = store.items.filter(a => a.id !== id)
    if (store.defaultId === id) {
      store.defaultId = store.items[0]?.id
    }
    saveStore(store)
  },

  async setDefault(id: string): Promise<void> {
    const store = loadStore()
    if (!store.items.some(a => a.id === id)) throw new Error('Endereço não encontrado')
    store.defaultId = id
    saveStore(store)
  },
}

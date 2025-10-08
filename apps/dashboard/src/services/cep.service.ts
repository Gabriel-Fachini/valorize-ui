import axios from 'axios'

/**
 * ViaCEP API Response
 * https://viacep.com.br/
 */
interface ViaCepResponse {
  cep: string
  logradouro: string // Street
  complemento: string // Complement
  bairro: string // Neighborhood
  localidade: string // City
  uf: string // State
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean // True if CEP not found
}

/**
 * Normalized address data from CEP
 */
export interface CepAddressData {
  street: string
  neighborhood: string
  city: string
  state: string
  complement?: string
}

/**
 * CEP Service for Brazilian postal code lookup
 * Uses ViaCEP API (free, no authentication required)
 */
export const cepService = {
  /**
   * Fetch address data from CEP
   * @param cep - Brazilian postal code (with or without formatting)
   * @returns Address data or null if not found
   */
  async fetchAddressByCep(cep: string): Promise<CepAddressData | null> {
    // Remove non-digit characters
    const cleanCep = cep.replace(/\D/g, '')
    
    // Validate CEP format (must be 8 digits)
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }

    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
        {
          timeout: 5000, // 5 second timeout
        },
      )

      // Check if CEP was not found
      if (response.data.erro) {
        return null
      }

      // Return normalized data
      return {
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
        complement: response.data.complemento || undefined,
      }
    } catch (error) {
      // Network error or timeout
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tempo esgotado ao buscar CEP. Tente novamente.')
        }
        throw new Error('Erro ao buscar CEP. Verifique sua conexão.')
      }
      throw error
    }
  },

  /**
   * Validate if CEP format is correct (8 digits)
   * @param cep - Brazilian postal code
   * @returns true if valid format
   */
  isValidFormat(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '')
    return cleanCep.length === 8
  },
}

/**
 * CNPJ Consultation Service using BrasilAPI
 * Free and public API for Brazilian company data
 */

export interface CNPJResponse {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  data_inicio_atividade: string
  natureza_juridica: string
  descricao_tipo_de_logradouro?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cep?: string
  uf?: string
  codigo_municipio?: number
  municipio?: string
  ddd_telefone_1?: string
  ddd_telefone_2?: string
  ddd_fax?: string
  qualificacao_do_responsavel?: string
  capital_social?: number
  porte?: string
  porte_empresa?: string
  descricao_porte?: string
  opcao_pelo_simples?: boolean
  data_opcao_pelo_simples?: string | null
  data_exclusao_do_simples?: string | null
  opcao_pelo_mei?: boolean
  situacao_especial?: string
  data_situacao_especial?: string | null
  situacao_cadastral: number
  data_situacao_cadastral: string
  motivo_situacao_cadastral?: string
  cnaes_secundarios?: Array<{
    codigo: number
    descricao: string
  }>
  qsa?: Array<{
    identificador_de_socio: number
    nome_socio: string
    cnpj_cpf_do_socio: string
    codigo_qualificacao_socio: number
    percentual_capital_social: number
    data_entrada_sociedade: string
    cpf_representante_legal?: string
    nome_representante_legal?: string
    codigo_qualificacao_representante_legal?: number
  }>
}

/**
 * Formats CNPJ removing special characters (only numbers)
 */
export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, '')
}

/**
 * Formats CNPJ with mask: XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJWithMask(cnpj: string): string {
  const cleaned = formatCNPJ(cnpj)

  if (cleaned.length !== 14) {
    return cleaned
  }

  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

/**
 * Validates CNPJ format (14 digits)
 */
export function isValidCNPJFormat(cnpj: string): boolean {
  const cleaned = formatCNPJ(cnpj)
  return cleaned.length === 14 && /^\d+$/.test(cleaned)
}

/**
 * Queries CNPJ data from BrasilAPI
 * @param cnpj - CNPJ with or without formatting
 * @returns Company data or throws error
 */
export async function consultCNPJ(cnpj: string): Promise<CNPJResponse> {
  const cleanCNPJ = formatCNPJ(cnpj)

  if (!isValidCNPJFormat(cleanCNPJ)) {
    throw new Error('CNPJ deve conter 14 dígitos')
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado')
      }
      if (response.status === 429) {
        throw new Error('Muitas requisições. Tente novamente em alguns segundos')
      }
      throw new Error('Erro ao consultar CNPJ')
    }

    const data: CNPJResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao consultar CNPJ. Verifique sua conexão')
  }
}

/**
 * Maps CNPJ API response to company size
 */
export function mapPorteEmpresa(porte?: string): 'Microempresa' | 'Pequena Empresa' | 'Média Empresa' | 'Grande Empresa' | undefined {
  if (!porte) return undefined

  const porteMap: Record<string, 'Microempresa' | 'Pequena Empresa' | 'Média Empresa' | 'Grande Empresa'> = {
    '00': 'Microempresa',
    '01': 'Microempresa',
    '02': 'Pequena Empresa',
    '03': 'Pequena Empresa',
    '04': 'Média Empresa',
    '05': 'Grande Empresa',
  }

  return porteMap[porte]
}

/**
 * Maps cadastral situation to our enum
 */
export function mapSituacaoCadastral(situacao: number): 'Ativa' | 'Suspensa' | 'Inapta' | 'Baixada' {
  switch (situacao) {
    case 1:
      return 'Ativa'
    case 3:
      return 'Suspensa'
    case 4:
      return 'Inapta'
    case 8:
      return 'Baixada'
    default:
      return 'Ativa'
  }
}

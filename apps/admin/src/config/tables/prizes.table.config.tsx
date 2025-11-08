/**
 * Prizes Table Configuration
 * Configuração declarativa da tabela de gerenciamento de prêmios
 */

import type { Prize } from '@/types/prizes'
import type { TableConfig } from './types'
import { PRIZE_TYPES } from '@/components/prizes/PrizeForm'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const prizesTableConfig: TableConfig<Prize> = {
  // Habilita seleção múltipla de linhas
  selectable: true,

  // Habilita animações de entrada
  animation: true,

  // ============================================================================
  // Configuração de Colunas
  // ============================================================================
  columns: [
    // Imagem do produto (primeira do array)
    {
      id: 'image',
      type: 'image',
      header: '',
      imageAccessor: (row) => row.images?.[0] || '',
      altAccessor: 'name',
      width: 80,
      height: 80,
      objectFit: 'cover',
      enableSorting: false,
    },

    // Nome do prêmio
    {
      id: 'name',
      type: 'string',
      accessor: 'name',
      header: 'Nome',
      display: 'string-bold',
      enableSorting: true,
    },

    // Tipo de prêmio (voucher, experiência, produto)
    {
      id: 'type',
      type: 'badge',
      accessor: 'type',
      header: 'Tipo',
      badgeVariant: () => 'secondary',
      badgeLabel: (value) => {
        // Mapeamento de valores em inglês para português
        const typeMapping: Record<string, string> = {
          'product': 'produto',
          'experience': 'experiencia',
        }

        const normalizedValue = typeMapping[String(value)] || String(value)
        const type = PRIZE_TYPES.find((t) => t.value === normalizedValue)
        return type?.label || String(value)
      },
      enableSorting: true,
    },

    // Categoria do prêmio (campo livre)
    {
      id: 'category',
      type: 'string',
      accessor: 'category',
      header: 'Categoria',
      display: 'string',
      enableSorting: true,
    },

    // Preço em moedas
    {
      id: 'coinPrice',
      type: 'custom',
      header: 'Preço',
      enableSorting: true,
      width: 120,
      cell: (row) => (
        <div className="flex items-center gap-1">
          <i className="ph ph-coin text-yellow-500" />
          <span className="font-medium">{row.coinPrice.toLocaleString('pt-BR')}</span>
        </div>
      ),
    },

    // Estoque
    {
      id: 'stock',
      type: 'custom',
      header: 'Estoque',
      enableSorting: true,
      width: 100,
      cell: (row) => {
        const isLow = row.stock <= 5 && row.stock > 0
        const isOut = row.stock === 0
        return (
          <span
            className={`font-medium ${
              isOut
                ? 'text-red-600'
                : isLow
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}
          >
            {row.stock}
          </span>
        )
      },
    },

    // Status (ativo/inativo) - com switch interativo
    {
      id: 'isActive',
      type: 'custom',
      header: 'Status',
      enableSorting: true,
      width: 100,
      cell: () => {
        // Este handler será injetado via página
        return null
      },
    },

    // Badge Global ou Da Empresa
    {
      id: 'isGlobal',
      type: 'custom',
      header: 'Origem',
      enableSorting: false,
      width: 120,
      cell: (row) => {
        if (!row.companyId) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-help">
                    <i className="ph ph-globe" />
                    Global
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Prêmios globais estão disponíveis para todas as empresas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 cursor-help">
                  <i className="ph ph-buildings" />
                  Empresa
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Prêmio exclusivo da empresa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },

    // Ações (dropdown menu)
    {
      id: 'actions',
      type: 'actions',
      header: 'Ações',
      enableSorting: false,
      enableHiding: false,
      width: 80,
    },
  ],

  // ============================================================================
  // Configuração de Filtros
  // ============================================================================
  filters: [
    // Busca por nome ou marca
    {
      id: 'search',
      type: 'search',
      placeholder: 'Buscar prêmios...',
      icon: 'ph-magnifying-glass',
      clearable: true,
    },

    // Filtro por tipo (voucher, experiência, produto)
    {
      id: 'type',
      type: 'select',
      label: 'Tipo',
      placeholder: 'Todos',
      icon: 'ph-funnel',
      options: [
        { value: 'all', label: 'Todos' },
        ...PRIZE_TYPES.map((type) => ({ value: type.value, label: type.label })),
      ],
    },

    // Filtro por categoria (campo livre)
    {
      id: 'category',
      type: 'search',
      placeholder: 'Filtrar por categoria...',
      icon: 'ph-tag',
      clearable: true,
    },

    // Filtro por status
    {
      id: 'isActive',
      type: 'select',
      label: 'Status',
      placeholder: 'Todos',
      icon: 'ph-toggle-left',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'true', label: 'Ativos' },
        { value: 'false', label: 'Inativos' },
      ],
    },

    // Filtro por tipo (global ou empresa)
    {
      id: 'isGlobal',
      type: 'select',
      label: 'Tipo',
      placeholder: 'Todos',
      icon: 'ph-globe',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'true', label: 'Globais' },
        { value: 'false', label: 'Da Empresa' },
      ],
    },
  ],

  // ============================================================================
  // Configuração de Ações
  // ============================================================================
  actions: {
    // Ações em lote (bulk actions)
    bulk: [
      {
        id: 'bulk-activate',
        label: 'Ativar Selecionados',
        icon: 'ph-check-circle',
        variant: 'default',
      },
      {
        id: 'bulk-deactivate',
        label: 'Desativar Selecionados',
        icon: 'ph-x-circle',
        variant: 'outline',
      },
    ],

    // Ações por linha (row actions)
    row: [
      {
        id: 'view',
        label: 'Ver detalhes',
        icon: 'ph-eye',
        variant: 'default',
      },
      {
        id: 'edit',
        label: 'Editar',
        icon: 'ph-pencil-simple',
        variant: 'default',
        // Será condicionalmente desabilitado na página se for prêmio global
      },
    ],
  },

  // ============================================================================
  // Configuração de Paginação
  // ============================================================================
  pagination: {
    pageSizeOptions: [20, 50, 100],
    defaultPageSize: 20,
    showPageInfo: true,
    showPageSizeSelector: true,
  },

  // ============================================================================
  // Estado Vazio (Empty State)
  // ============================================================================
  emptyState: {
    icon: 'ph-gift',
    title: 'Nenhum prêmio encontrado',
    description: 'Tente ajustar os filtros ou crie um novo prêmio',
  },
}

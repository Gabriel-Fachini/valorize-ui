import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { SortableHeader } from './SortableTableHeader'
import type { RoleWithCounts, RolesFilters } from '@/types/roles'

interface RoleTableColumnsProps {
  onEdit: (role: RoleWithCounts) => void
  onDelete: (role: RoleWithCounts) => void
  onViewDetails: (role: RoleWithCounts) => void
  currentSort?: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
  onSort?: (sortBy: RolesFilters['sortBy'], sortOrder: 'asc' | 'desc') => void
  userPermissions?: string[]
}

export const createRoleTableColumns = (props: RoleTableColumnsProps): ColumnDef<RoleWithCounts>[] => [
  {
    accessorKey: 'name',
    header: () => (
      <SortableHeader
        label="Nome"
        sortKey="name"
        currentSort={props.currentSort}
        onSort={props.onSort}
      />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  } as ColumnDef<RoleWithCounts>,

  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {(row.getValue('description') as string) || '-'}
      </div>
    ),
  } as ColumnDef<RoleWithCounts>,

  {
    accessorKey: 'usersCount',
    header: () => (
      <SortableHeader
        label="Usuários"
        sortKey="usersCount"
        currentSort={props.currentSort}
        onSort={props.onSort}
      />
    ),
    cell: ({ row }) => {
      const count = row.getValue('usersCount') as number
      return (
        <Badge variant="outline">
          {count} usuário{count !== 1 ? 's' : ''}
        </Badge>
      )
    },
  } as ColumnDef<RoleWithCounts>,

  {
    accessorKey: 'permissionsCount',
    header: () => (
      <SortableHeader
        label="Permissões"
        sortKey="permissionsCount"
        currentSort={props.currentSort}
        onSort={props.onSort}
      />
    ),
    cell: ({ row }) => {
      const count = row.getValue('permissionsCount') as number
      return (
        <Badge variant="secondary">
          {count === 0 && ' (nenhuma)'}
          {count} {count > 0 && 'permissões'}
          
        </Badge>
      )
    },
  } as ColumnDef<RoleWithCounts>,

  {
    accessorKey: 'createdAt',
    header: () => (
      <SortableHeader
        label="Data de Criação"
        sortKey="createdAt"
        currentSort={props.currentSort}
        onSort={props.onSort}
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string)
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString('pt-BR')}
        </div>
      )
    },
  } as ColumnDef<RoleWithCounts>,

  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            ⋮
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => props.onViewDetails(row.original)}
            className="cursor-pointer"
          >
            Visualizar
          </DropdownMenuItem>
          {(!props.userPermissions || props.userPermissions.includes('ROLES_UPDATE')) && (
            <DropdownMenuItem
              onClick={() => props.onEdit(row.original)}
              className="cursor-pointer"
            >
              Editar
            </DropdownMenuItem>
          )}
          {(!props.userPermissions || props.userPermissions.includes('ROLES_DELETE')) && (
            <DropdownMenuItem
              onClick={() => props.onDelete(row.original)}
              className="cursor-pointer text-red-600"
            >
              Deletar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  } as ColumnDef<RoleWithCounts>,
]

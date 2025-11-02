import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types/users'
import { Link } from '@tanstack/react-router'

interface UserTableColumnsProps {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onResetPassword?: (user: User) => void
}

export const createUserTableColumns = ({
  onEdit,
  onDelete,
  onResetPassword,
}: UserTableColumnsProps): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'avatar',
    header: '',
    cell: ({ row }) => {
      const user = row.original
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className="flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
      const user = row.original
      return (
        <Link
          to="/users/$userId"
          params={{ userId: user.id }}
          className="font-medium hover:underline"
        >
          {user.name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{row.getValue('email')}</div>
    },
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="text-sm">
          {user.department?.name || <span className="text-muted-foreground">-</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'position',
    header: 'Cargo',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="text-sm">
          {user.position?.name || <span className="text-muted-foreground">-</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <i className="ph ph-dots-three-vertical text-lg" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/users/$userId" params={{ userId: user.id }}>
                <i className="ph ph-eye mr-2" />
                Ver detalhes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <i className="ph ph-pencil-simple mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onResetPassword && (
              <>
                <DropdownMenuItem onClick={() => onResetPassword(user)}>
                  <i className="ph ph-key mr-2" />
                  Redefinir Senha
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
              <i className="ph ph-trash mr-2" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

export { type UserTableColumnsProps }

import { type FC } from 'react'
import { Badge } from '@/components/ui/badge'

interface DomainListProps {
  domains: string[]
  onRemove: (domain: string) => void
  isDisabled?: boolean
}

export const DomainList: FC<DomainListProps> = ({
  domains,
  onRemove,
  isDisabled = false,
}) => {
  if (domains.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <i className="ph ph-globe text-4xl mb-2 block" />
        <p className="text-sm">Nenhum domínio cadastrado</p>
        <p className="text-xs mt-1">Adicione pelo menos um domínio para habilitar o SSO</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Domínios cadastrados ({domains.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {domains.map((domain) => (
          <Badge
            key={domain}
            variant="secondary"
            className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <i className="ph ph-globe text-base" />
            <span className="font-mono">{domain}</span>
            <button
              type="button"
              onClick={() => onRemove(domain)}
              disabled={isDisabled}
              className="ml-1 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Remover domínio ${domain}`}
            >
              <i className="ph ph-x text-base" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

/**
 * Audit Log Details Dialog
 * Dialog para exibir detalhes completos de um log de auditoria
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChangesDiffViewer } from './ChangesDiffViewer'
import type { AuditLog } from '@/types/audit'

interface AuditLogDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log: AuditLog | null
}

/**
 * Formata a data/hora de forma legível
 */
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'medium',
  }).format(date)
}

/**
 * Labels traduzidos para ações
 */
const actionLabels: Record<string, string> = {
  CREATE: 'Criação',
  UPDATE: 'Atualização',
  DELETE: 'Exclusão',
  ACTIVATE: 'Ativação',
  DEACTIVATE: 'Desativação',
  WALLET_CREDIT: 'Crédito na Carteira',
  WALLET_DEBIT: 'Débito na Carteira',
  WALLET_FREEZE: 'Congelamento da Carteira',
  WALLET_UNFREEZE: 'Descongelamento da Carteira',
  CONTACT_ADD: 'Adicionar Contato',
  CONTACT_UPDATE: 'Atualizar Contato',
  CONTACT_DELETE: 'Remover Contato',
  DOMAIN_ADD: 'Adicionar Domínio',
  DOMAIN_DELETE: 'Remover Domínio',
  PLAN_CHANGE: 'Mudança de Plano',
}

/**
 * Labels traduzidos para tipos de entidade
 */
const entityTypeLabels: Record<string, string> = {
  Company: 'Empresa',
  User: 'Usuário',
  Wallet: 'Carteira',
  CompanyWallet: 'Carteira da Empresa',
  CompanyContact: 'Contato da Empresa',
  CompanyPlan: 'Plano da Empresa',
  AllowedDomain: 'Domínio Permitido',
}

export function AuditLogDetailsDialog({
  open,
  onOpenChange,
  log,
}: AuditLogDetailsDialogProps) {
  if (!log) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
          <DialogDescription>
            Visualize as informações completas deste evento de auditoria
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="changes">Alterações</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">ID do Log</p>
                    <p className="text-sm font-mono">{log.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data/Hora</p>
                    <p className="text-sm">{formatDateTime(log.createdAt)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Ação</p>
                    <Badge variant="secondary">
                      {actionLabels[log.action] || log.action}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Entidade</p>
                    <Badge variant="outline">
                      {entityTypeLabels[log.entityType] || log.entityType}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">ID da Entidade</p>
                    <p className="text-sm font-mono">{log.entityId}</p>
                  </div>

                  {log.companyId && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">ID da Empresa</p>
                      <p className="text-sm font-mono">{log.companyId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usuário Responsável</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-sm font-medium">{log.user.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{log.user.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">ID do Usuário</p>
                  <p className="text-sm font-mono">{log.userId}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Alterações */}
          <TabsContent value="changes" className="space-y-4">
            <ChangesDiffViewer changes={log.changes} />
          </TabsContent>

          {/* Tab: Metadata */}
          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Endereço IP</p>
                  <p className="text-sm font-mono">{log.metadata?.ip || '-'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User Agent</p>
                  <p className="text-sm font-mono text-wrap break-all">
                    {log.metadata?.userAgent || '-'}
                  </p>
                </div>

                {log.metadata && Object.keys(log.metadata).length > 2 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Metadata Adicional
                    </p>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(log.metadata).filter(
                            ([key]) => key !== 'ip' && key !== 'userAgent'
                          )
                        ),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

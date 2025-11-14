/**
 * Compliments Network Page
 * Network graph visualization of recognition connections between employees
 */

import { type FC, useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useComplimentsNetwork } from '@/hooks/useComplimentsNetwork'
import type { ComplimentsDashboardFilters, NetworkFilters } from '@/types/compliments'
import { ComplimentsFilters } from '@/components/compliments/ComplimentsFilters'
import { UserMultiSelect } from '@/components/compliments/UserMultiSelect'
import { useDepartments } from '@/hooks/useFilters'
import { Button } from '@/components/ui/button'
import { NetworkGraph } from '@/components/compliments/network'

interface SelectedUser {
  id: string
  name: string
  avatar?: string
}

export const ComplimentsNetworkPage: FC = () => {
  const [filters, setFilters] = useState<ComplimentsDashboardFilters>({})
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFullscreenNotice, setShowFullscreenNotice] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: departments } = useDepartments()

  // Convert ComplimentsDashboardFilters to NetworkFilters
  const networkFilters: NetworkFilters = useMemo(() => {
    // Find department name from ID
    const departmentName = filters.departmentId
      ? departments?.find(d => d.id === filters.departmentId)?.name
      : undefined

    // Convert selected users to comma-separated IDs
    const userIds = selectedUsers.length > 0
      ? selectedUsers.map(u => u.id).join(',')
      : undefined

    return {
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(departmentName && { department: departmentName }),
      ...(userIds && { userIds }),
    }
  }, [filters, departments, selectedUsers])

  // Fetch network data
  const {
    nodes,
    links,
    isLoading,
  } = useComplimentsNetwork(networkFilters)

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
        setShowFullscreenNotice(true)
        // Hide notice after 4 seconds
        setTimeout(() => setShowFullscreenNotice(false), 4000)
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
        setShowFullscreenNotice(false)
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err)
      })
    }
  }, [])

  // Listen for fullscreen changes (e.g., ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)
      if (!isNowFullscreen) {
        setShowFullscreenNotice(false)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-[#1a1a1a] relative">
      {/* Floating Header Card */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-card/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border/50 p-6 pointer-events-auto">
          {/* Title and description */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <i className="ph ph-graph text-2xl text-primary" />
              <h1 className="text-2xl font-bold">Rede de Conexões</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Visualização da rede de reconhecimentos entre colaboradores
            </p>
          </div>

          {/* Filters */}
          <ComplimentsFilters filters={filters} onFiltersChange={setFilters} />

          {/* User Selection */}
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">
              Filtrar por usuários específicos
            </label>
            <UserMultiSelect
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              placeholder="Buscar usuários..."
            />
          </div>
        </div>
      </div>

      {/* Stats Card - Below Header */}
      {!isLoading && nodes.length > 0 && (
        <div className="absolute top-[360px] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="grid grid-cols-2 gap-4 p-5 bg-card/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border/50 pointer-events-auto">
            <div className="text-center px-6">
              <p className="text-3xl font-bold">{nodes.length}</p>
              <p className="text-xs text-muted-foreground">Colaboradores</p>
            </div>
            <div className="text-center px-6">
              <p className="text-3xl font-bold">{links.length}</p>
              <p className="text-xs text-muted-foreground">Conexões</p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Notice */}
      {showFullscreenNotice && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-card/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border/50 px-8 py-6 text-center">
            <i className="ph ph-keyboard text-4xl mb-3 block text-primary" />
            <p className="text-lg font-semibold mb-1">Modo Tela Cheia Ativado</p>
            <p className="text-sm text-muted-foreground">
              Pressione <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs">ESC</kbd> para sair
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Button - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20">
        <Button
          onClick={toggleFullscreen}
          size="lg"
          className="rounded-full shadow-lg"
          variant="default"
          title={isFullscreen ? 'Sair da tela cheia (ESC)' : 'Tela cheia'}
        >
          <i className={`ph ${isFullscreen ? 'ph-arrows-in' : 'ph-arrows-out'} text-xl`} />
        </Button>
      </div>

      {/* Network Graph - Full screen */}
      <div className="absolute inset-0">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Carregando rede...</p>
            </div>
          </div>
        ) : (
          <NetworkGraph nodes={nodes} links={links} />
        )}
      </div>
    </div>
  )
}

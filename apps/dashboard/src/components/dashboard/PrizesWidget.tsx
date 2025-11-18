import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePrizes } from '@/hooks/usePrizes'
import { PrizesMiniCard } from '@/components/prizes/PrizesMiniCard'

export const PrizesWidget = () => {
  const navigate = useNavigate()
  const { data: prizesData, isLoading, isError } = usePrizes(
    { sortBy: 'popular' },
    1,
    4
  )

  const handleViewAllPrizes = () => {
    navigate({ to: '/prizes' })
  }

  // Estados de loading e erro
  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
            <i className="ph-duotone ph-gift text-white text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Prêmios Disponíveis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resgate com suas moedas
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200/50 dark:bg-white/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
            <i className="ph-duotone ph-gift text-white text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Prêmios Disponíveis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resgate com suas moedas
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <i className="ph-duotone ph-warning-circle text-5xl text-red-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">
            Erro ao carregar prêmios. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  const prizes = prizesData?.prizes || []

  return (
    <div className="bg-white/70 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
            <i className="ph-duotone ph-gift text-white text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Prêmios Disponíveis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resgate com suas moedas
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAllPrizes}
          className="hidden sm:flex items-center gap-2"
        >
          Ver Todos
          <i className="ph ph-arrow-right"></i>
        </Button>
      </div>

      {/* Grid de prêmios */}
      {prizes.length > 0 ? (
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {prizes.map((prize, index) => (
              <PrizesMiniCard
                key={prize.id}
                prize={prize}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <i className="ph-duotone ph-gift text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum prêmio disponível no momento
          </p>
        </div>
      )}

      {/* CTA Mobile */}
      <Button
        variant="outline"
        onClick={handleViewAllPrizes}
        className="w-full sm:hidden flex items-center justify-center gap-2"
      >
        Ver Todos os Prêmios
        <i className="ph ph-arrow-right"></i>
      </Button>
    </div>
  )
}

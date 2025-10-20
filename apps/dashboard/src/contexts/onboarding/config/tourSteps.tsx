import type { StepType } from '@reactour/tour'
import { getSelectorForDevice, isMobile } from '../utils/device'
import { FEEDBACK_FORM_URL } from './constants'

export const getTourSteps = (): StepType[] => {
  const isMobileView = isMobile()
  
  return [
    {
      selector: '[data-tour="welcome"]',
      content: 'Bem vindo ao Valorize! Vamos fazer um tour rápido para ajudá-lo a começar.',
      position: 'center',
    },
    {
      selector: isMobileView ? '#mobile-sidebar' : 'aside[role="complementary"]',
      content: 'Esta é a sua barra de navegação. Use-a para acessar diferentes seções do aplicativo. Clique nos itens da barra para navegar durante o tour!',
      position: 'right',
    },
    {
      selector: getSelectorForDevice('balance-cards', isMobileView),
      content: 'Aqui estão seus saldos! 🎁 Moedas para Elogiar (renovam toda semana) e ✨ Moedas Resgatáveis (acumuladas dos elogios recebidos).',
      position: 'bottom',
    },
    {
      selector: getSelectorForDevice('home', isMobileView),
      content: '👆 Clique em "Início" para conhecer a página inicial',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: getSelectorForDevice('praises', isMobileView),
      content: '👆 Clique em "Elogios" para conhecer o sistema de reconhecimento',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: '[data-tour="praises-stats"]',
      content: 'Aqui você vê suas estatísticas: elogios enviados, recebidos e total de pontos acumulados! 📊',
      position: 'bottom',
    },
    {
      selector: '[data-tour="praises-feed"]',
      content: 'Este é o feed de reconhecimentos. Você pode ver todos os elogios, filtrar por enviados ou recebidos, e interagir com as postagens. 💬',
      position: 'top',
    },
    {
      selector: '[data-tour="praises-fab"]',
      content: 'Use este botão flutuante para enviar elogios rapidamente! Reconheça seus colegas em poucos cliques. ✨',
      position: 'left',
    },
    {
      selector: getSelectorForDevice('transactions', isMobileView),
      content: '👆 Clique em "Transações" para explorar seu histórico financeiro',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: '[data-tour="transactions-page"]',
      content: 'Esta é sua página de transações! Aqui você vê todas as movimentações de moedas: elogios enviados, recebidos e resgates de prêmios. 💰',
      position: 'bottom',
    },
    {
      selector: '[data-tour="transactions-balance"]',
      content: 'Resumo dos seus saldos atuais. As moedas para elogiar renovam semanalmente, enquanto as resgatáveis acumulam conforme você recebe reconhecimentos! 📊',
      position: 'bottom',
    },
    {
      selector: '[data-tour="transactions-feed"]',
      content: 'Aqui está todo o histórico de transações! Você pode filtrar por tipo de moeda (elogios ou resgates) e por período. Use "Carregar mais" para ver transações antigas. 📋',
      position: 'left',
    },
    {
      selector: getSelectorForDevice('prizes', isMobileView),
      content: '👆 Clique em "Prêmios" para ver o que você pode resgatar',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: '[data-tour="prizes-grid"]',
      content: 'Navegue pelos prêmios disponíveis! Clique em um produto para ver detalhes completos e fazer o resgate. 🎁',
      position: 'top',
    },
    {
      selector: '[data-tour="prizes-filters"]',
      content: 'Use os filtros para encontrar prêmios por categoria, faixa de preço ou busca por nome. Você pode ordenar por novidades, preço ou nome. 🔍',
      position: 'bottom',
    },
    {
      selector: getSelectorForDevice('redemptions', isMobileView),
      content: '👆 Clique em "Resgates" para acompanhar seus prêmios',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: '[data-tour="redemptions-page"]',
      content: 'Esta é sua página de resgates! Aqui você acompanha todos os prêmios que resgatou e o status de processamento de cada um. 📦',
      position: 'bottom',
    },
    {
      selector: '[data-tour="redemptions-filters"]',
      content: 'Use estes filtros para encontrar resgates específicos! Você pode buscar por nome do produto, filtrar por status (pendente, processando, concluído, cancelado) e por período. 🔍',
      position: 'bottom',
    },
    {
      selector: '[data-tour="redemptions-list"]',
      content: 'Aqui está a lista dos seus resgates! Cada card mostra o produto, valor gasto, data e status atual. Clique em um resgate para ver detalhes completos e a timeline de rastreamento! 📋',
      position: 'top',
    },
    {
      selector: getSelectorForDevice('profile', isMobileView),
      content: '👆 Clique em "Configurações" para personalizar sua experiência',
      position: 'right',
      stepInteraction: true,
    },
    {
      selector: '[data-tour="settings-tabs"]',
      content: 'Aqui você pode editar seu perfil, ajustar preferências de tema e acessibilidade, e gerenciar endereços de entrega. ⚙️',
      position: 'bottom',
    },
    {
      selector: '[data-tour="settings-tour-control"]',
      content: 'Sempre que quiser refazer este tour, volte aqui e clique em "Reiniciar Tour"! 🔄',
      position: 'top',
    },
    {
      selector: '#tour-completion-modal',
      content: () => (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎉 Parabéns! Tour Concluído
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Você concluiu o tour do Valorize! Agora você está pronto para começar a usar todas as funcionalidades.
          </p>
          <div className="pt-4 space-y-3">
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              📝 Enviar Feedback sobre o Tour
            </a>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('onboarding:complete'))
              }}
              className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      ),
      position: 'center',
      padding: 0,
      styles: {
        popover: (base: React.CSSProperties) => ({
          ...base,
          maxWidth: '450px',
          backgroundColor: 'var(--tour-bg-color)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }),
        maskWrapper: (base: React.CSSProperties) => ({
          ...base,
          color: '#000',
          opacity: 0.7,
          zIndex: 90,
        }),
      },
    },
  ]
}

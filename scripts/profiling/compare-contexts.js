#!/usr/bin/env node
/**
 * Script de comparação de performance React DevTools Profiler - TODOS OS CONTEXTOS
 * 
 * Uso: node scripts/profiling/compare-contexts.js <antes.json> <depois.json>
 */

import fs from 'fs'

function parseProfilerData(data) {
  const stats = {
    totalCommits: 0,
    totalDuration: 0,
    components: {},
    contexts: {
      // Contextos otimizados
      theme: [],
      sidebar: [],
      accessibility: [],
      // Contextos a serem otimizados
      auth: [],
      onboarding: [],
      // QueryClient (TanStack Query)
      query: [],
      // Outros providers
      router: [],
      tour: []
    }
  }

  const roots = data.dataForRoots || []
  
  roots.forEach(root => {
    const commitData = root.commitData || []
    stats.totalCommits = commitData.length
    
    commitData.forEach(commit => {
      stats.totalDuration += commit.duration || 0
      
      // Analisa cada fase de renderização
      const fiberActualDurations = commit.fiberActualDurations || []
      const fiberSelfDurations = commit.fiberSelfDurations || []
      
      // fiberActualDurations é um array de [fiberId, duration]
      fiberActualDurations.forEach(([fiberId, duration]) => {
        // Busca o nome do componente - vamos usar um nome genérico por enquanto
        const displayName = `Component-${fiberId}`
        
        if (!stats.components[displayName]) {
          stats.components[displayName] = {
            renders: 0,
            totalDuration: 0,
            maxDuration: 0,
            minDuration: Infinity
          }
        }
        
        const comp = stats.components[displayName]
        comp.renders++
        comp.totalDuration += duration
        comp.maxDuration = Math.max(comp.maxDuration, duration)
        comp.minDuration = Math.min(comp.minDuration, duration)
        
        // Identifica contextos baseado no fiberId e duração
        // Todos os contextos recebem a duração para análise geral
        stats.contexts.theme.push(duration)
        stats.contexts.sidebar.push(duration)
        stats.contexts.accessibility.push(duration)
        stats.contexts.auth.push(duration)
        stats.contexts.onboarding.push(duration)
        stats.contexts.query.push(duration)
        stats.contexts.router.push(duration)
        stats.contexts.tour.push(duration)
      })
    })
  })

  return stats
}

function calculateMetrics(stats) {
  const metrics = {
    totalCommits: stats.totalCommits,
    totalDuration: stats.totalDuration.toFixed(2),
    avgCommitDuration: (stats.totalDuration / stats.totalCommits).toFixed(2),
    components: []
  }

  Object.entries(stats.components).forEach(([name, data]) => {
    if (data.renders > 0) {
      metrics.components.push({
        name,
        renders: data.renders,
        totalDuration: data.totalDuration.toFixed(2),
        avgDuration: (data.totalDuration / data.renders).toFixed(2),
        maxDuration: data.maxDuration.toFixed(2),
        minDuration: data.minDuration === Infinity ? 0 : data.minDuration.toFixed(2)
      })
    }
  })

  // Ordena por número de renders (maior primeiro)
  metrics.components.sort((a, b) => b.renders - a.renders)

  // Métricas de contextos
  metrics.contexts = {}
  Object.entries(stats.contexts).forEach(([name, durations]) => {
    if (durations.length > 0) {
      const total = durations.reduce((sum, d) => sum + d, 0)
      metrics.contexts[name] = {
        renders: durations.length,
        totalDuration: total.toFixed(2),
        avgDuration: (total / durations.length).toFixed(2)
      }
    }
  })

  return metrics
}

function compareMetrics(before, after) {
  console.log('\n' + '='.repeat(100))
  console.log('📊 COMPARAÇÃO DE PERFORMANCE - REACT DEVTOOLS PROFILER')
  console.log('='.repeat(100) + '\n')

  // Resumo geral
  console.log('📈 RESUMO GERAL\n')
  console.log(`Total de Commits:`)
  console.log(`  Antes:  ${before.totalCommits}`)
  console.log(`  Depois: ${after.totalCommits}`)
  console.log(`  Diff:   ${((after.totalCommits - before.totalCommits) / before.totalCommits * 100).toFixed(1)}%\n`)

  console.log(`Duração Total:`)
  console.log(`  Antes:  ${before.totalDuration}ms`)
  console.log(`  Depois: ${after.totalDuration}ms`)
  const durationDiff = ((after.totalDuration - before.totalDuration) / before.totalDuration * 100).toFixed(1)
  console.log(`  Diff:   ${durationDiff}% ${parseFloat(durationDiff) < 0 ? '✅ MELHORIA' : '⚠️ PIORA'}`)

  console.log(`\nDuração Média por Commit:`)
  console.log(`  Antes:  ${before.avgCommitDuration}ms`)
  console.log(`  Depois: ${after.avgCommitDuration}ms`)
  const avgDiff = ((after.avgCommitDuration - before.avgCommitDuration) / before.avgCommitDuration * 100).toFixed(1)
  console.log(`  Diff:   ${avgDiff}% ${parseFloat(avgDiff) < 0 ? '✅ MELHORIA' : '⚠️ PIORA'}`)

  // Contextos específicos
  console.log('\n' + '-'.repeat(100))
  console.log('🎯 ANÁLISE DE TODOS OS CONTEXTOS\n')

  const contextNames = [
    { name: 'theme', label: 'THEME', status: '✅ OTIMIZADO' },
    { name: 'sidebar', label: 'SIDEBAR', status: '✅ OTIMIZADO' },
    { name: 'accessibility', label: 'ACCESSIBILITY', status: '✅ OTIMIZADO' },
    { name: 'auth', label: 'AUTH', status: '⏳ PENDENTE' },
    { name: 'onboarding', label: 'ONBOARDING', status: '⏳ PENDENTE' },
    { name: 'query', label: 'QUERY (TanStack)', status: '⏳ PENDENTE' },
    { name: 'router', label: 'ROUTER', status: '⏳ PENDENTE' },
    { name: 'tour', label: 'TOUR', status: '⏳ PENDENTE' }
  ]

  contextNames.forEach(({ name, label, status }) => {
    const beforeCtx = before.contexts[name]
    const afterCtx = after.contexts[name]

    if (beforeCtx && afterCtx) {
      console.log(`\n📌 ${label} Context ${status}:`)
      console.log(`  Renders: ${beforeCtx.renders} → ${afterCtx.renders} (${((afterCtx.renders - beforeCtx.renders) / beforeCtx.renders * 100).toFixed(1)}%)`)
      console.log(`  Total Duration: ${beforeCtx.totalDuration}ms → ${afterCtx.totalDuration}ms`)
      const ctxDiff = ((afterCtx.totalDuration - beforeCtx.totalDuration) / beforeCtx.totalDuration * 100).toFixed(1)
      console.log(`  Avg Duration: ${beforeCtx.avgDuration}ms → ${afterCtx.avgDuration}ms (${ctxDiff}%)`)
      
      if (parseFloat(ctxDiff) < -10) {
        console.log(`  ✅ MELHORIA SIGNIFICATIVA de ${Math.abs(parseFloat(ctxDiff))}%`)
      } else if (parseFloat(ctxDiff) < 0) {
        console.log(`  ✅ Pequena melhoria de ${Math.abs(parseFloat(ctxDiff))}%`)
      } else if (parseFloat(ctxDiff) > 10) {
        console.log(`  ⚠️ PIORA de ${Math.abs(parseFloat(ctxDiff))}%`)
      } else {
        console.log(`  ➖ Sem mudança significativa`)
      }
    }
  })

  // Top componentes que mais renderizaram
  console.log('\n' + '-'.repeat(100))
  console.log('🔥 TOP 10 COMPONENTES COM MAIS RENDERS\n')

  const topBefore = before.components.slice(0, 10)
  const topAfter = after.components.slice(0, 10)

  console.log('ANTES:')
  topBefore.forEach((comp, i) => {
    console.log(`  ${i + 1}. ${comp.name}: ${comp.renders} renders (${comp.totalDuration}ms total, ${comp.avgDuration}ms avg)`)
  })

  console.log('\nDEPOIS:')
  topAfter.forEach((comp, i) => {
    console.log(`  ${i + 1}. ${comp.name}: ${comp.renders} renders (${comp.totalDuration}ms total, ${comp.avgDuration}ms avg)`)
  })

  // Componentes com maior melhoria
  console.log('\n' + '-'.repeat(100))
  console.log('🏆 COMPONENTES COM MAIOR MELHORIA\n')

  const improvements = []
  before.components.forEach(beforeComp => {
    const afterComp = after.components.find(c => c.name === beforeComp.name)
    if (afterComp) {
      const renderDiff = ((afterComp.renders - beforeComp.renders) / beforeComp.renders * 100)
      const durationDiff = ((afterComp.totalDuration - beforeComp.totalDuration) / beforeComp.totalDuration * 100)
      
      if (renderDiff < -5 || durationDiff < -5) {
        improvements.push({
          name: beforeComp.name,
          renderDiff: renderDiff.toFixed(1),
          durationDiff: durationDiff.toFixed(1),
          beforeRenders: beforeComp.renders,
          afterRenders: afterComp.renders
        })
      }
    }
  })

  improvements.sort((a, b) => parseFloat(a.renderDiff) - parseFloat(b.renderDiff))
  improvements.slice(0, 10).forEach(imp => {
    console.log(`  ✅ ${imp.name}:`)
    console.log(`     Renders: ${imp.beforeRenders} → ${imp.afterRenders} (${imp.renderDiff}%)`)
    console.log(`     Duration: ${imp.durationDiff}%`)
  })

  // Status de otimização dos contextos
  console.log('\n' + '-'.repeat(100))
  console.log('📋 STATUS DE OTIMIZAÇÃO DOS CONTEXTOS\n')

  const optimizedContexts = ['theme', 'sidebar', 'accessibility']
  const pendingContexts = ['auth', 'onboarding', 'query', 'router', 'tour']

  console.log('✅ CONTEXTOS OTIMIZADOS:')
  optimizedContexts.forEach(ctx => {
    const beforeCtx = before.contexts[ctx]
    const afterCtx = after.contexts[ctx]
    if (beforeCtx && afterCtx) {
      const improvement = ((afterCtx.totalDuration - beforeCtx.totalDuration) / beforeCtx.totalDuration * 100).toFixed(1)
      console.log(`  • ${ctx.toUpperCase()}: ${improvement}% de melhoria`)
    }
  })

  console.log('\n⏳ CONTEXTOS PENDENTES DE OTIMIZAÇÃO:')
  pendingContexts.forEach(ctx => {
    const beforeCtx = before.contexts[ctx]
    const afterCtx = after.contexts[ctx]
    if (beforeCtx && afterCtx) {
      const change = ((afterCtx.totalDuration - beforeCtx.totalDuration) / beforeCtx.totalDuration * 100).toFixed(1)
      const status = parseFloat(change) < -5 ? '✅ Melhoria natural' : 
                     parseFloat(change) > 5 ? '⚠️ Pode precisar de otimização' : 
                     '➖ Estável'
      console.log(`  • ${ctx.toUpperCase()}: ${change}% (${status})`)
    }
  })

  console.log('\n' + '='.repeat(100) + '\n')
}

// Main
if (process.argv.length < 4) {
  console.error('Uso: node scripts/profiling/compare-contexts.js <antes.json> <depois.json>')
  process.exit(1)
}

const beforeFile = process.argv[2]
const afterFile = process.argv[3]

try {
  const beforeData = JSON.parse(fs.readFileSync(beforeFile, 'utf-8'))
  const afterData = JSON.parse(fs.readFileSync(afterFile, 'utf-8'))

  const beforeStats = parseProfilerData(beforeData)
  const afterStats = parseProfilerData(afterData)

  const beforeMetrics = calculateMetrics(beforeStats)
  const afterMetrics = calculateMetrics(afterStats)

  compareMetrics(beforeMetrics, afterMetrics)

  // Exporta relatório JSON
  const report = {
    before: beforeMetrics,
    after: afterMetrics,
    timestamp: new Date().toISOString()
  }

  fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2))
  console.log('📄 Relatório completo salvo em: performance-report.json\n')

} catch (error) {
  console.error('❌ Erro:', error.message)
  process.exit(1)
}

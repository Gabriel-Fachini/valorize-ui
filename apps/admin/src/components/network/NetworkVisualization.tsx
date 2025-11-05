import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
// Tipagens de D3 foram adicionadas ao workspace; removido o @ts-expect-error
import { useTheme } from '@/hooks/useTheme'
import { PageHeader } from '@/components/layout/PageHeader'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Input } from '@/components/ui'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

type NodeType = {
  id: number
  name: string
  role: string
  department: string
  complimentsGiven: number
  complimentsReceived: number
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type LinkType = d3.SimulationLinkDatum<NodeType> & {
  value: number
  compliments: string[]
}

const NetworkVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [hoveredNode, setHoveredNode] = useState<NodeType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const { isDark } = useTheme()

  // Dados de exemplo - você substituirá isso com dados da sua API
  const [networkData] = useState<{ nodes: NodeType[]; links: LinkType[] }>(
    {
      nodes: [
        { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Senior', department: 'Engenharia', complimentsGiven: 15, complimentsReceived: 12 },
        { id: 2, name: 'Carlos Mendes', role: 'Product Manager', department: 'Produto', complimentsGiven: 20, complimentsReceived: 18 },
        { id: 3, name: 'Maria Santos', role: 'UX Designer', department: 'Design', complimentsGiven: 8, complimentsReceived: 15 },
        { id: 4, name: 'João Oliveira', role: 'Desenvolvedor Junior', department: 'Engenharia', complimentsGiven: 10, complimentsReceived: 8 },
        { id: 5, name: 'Paula Costa', role: 'Tech Lead', department: 'Engenharia', complimentsGiven: 25, complimentsReceived: 22 },
        { id: 6, name: 'Ricardo Lima', role: 'Data Scientist', department: 'Data', complimentsGiven: 12, complimentsReceived: 10 },
        { id: 7, name: 'Fernanda Alves', role: 'Scrum Master', department: 'Produto', complimentsGiven: 18, complimentsReceived: 16 },
        { id: 8, name: 'Bruno Dias', role: 'DevOps Engineer', department: 'Engenharia', complimentsGiven: 14, complimentsReceived: 11 },
        { id: 9, name: 'Lucia Ferreira', role: 'QA Engineer', department: 'Engenharia', complimentsGiven: 9, complimentsReceived: 12 },
        { id: 10, name: 'Roberto Souza', role: 'Backend Developer', department: 'Engenharia', complimentsGiven: 11, complimentsReceived: 13 },
        { id: 11, name: 'Amanda Rocha', role: 'Frontend Developer', department: 'Engenharia', complimentsGiven: 13, complimentsReceived: 14 },
        { id: 12, name: 'Pedro Martins', role: 'Product Designer', department: 'Design', complimentsGiven: 7, complimentsReceived: 9 }
      ],
      links: [
        { source: 1, target: 2, value: 3, compliments: ['Ótima liderança', 'Visão estratégica', 'Comunicação clara'] },
        // aumentado para um peso alto (9) para ampliar contraste
        { source: 1, target: 5, value: 9, compliments: ['Mentoria excelente', 'Conhecimento técnico', 'Paciência', 'Disponibilidade', 'Inspiração'] },
        { source: 2, target: 3, value: 4, compliments: ['Designs incríveis', 'Criatividade', 'Atenção aos detalhes', 'Colaboração'] },
        { source: 2, target: 7, value: 2, compliments: ['Organização', 'Facilitação eficaz'] },
        { source: 3, target: 2, value: 3, compliments: ['Visão de produto', 'Priorização clara', 'Empatia com usuário'] },
        { source: 3, target: 12, value: 2, compliments: ['Trabalho em equipe', 'Inovação'] },
        { source: 4, target: 1, value: 2, compliments: ['Ajuda com código', 'Revisões detalhadas'] },
        { source: 4, target: 5, value: 3, compliments: ['Mentoria', 'Paciência', 'Conhecimento'] },
        { source: 5, target: 1, value: 4, compliments: ['Proatividade', 'Qualidade de código', 'Colaboração', 'Dedicação'] },
        { source: 5, target: 8, value: 2, compliments: ['Infraestrutura sólida', 'Automação eficiente'] },
        { source: 6, target: 2, value: 2, compliments: ['Insights valiosos', 'Análise precisa'] },
        { source: 6, target: 5, value: 1, compliments: ['Liderança técnica'] },
        { source: 7, target: 2, value: 3, compliments: ['Parceria', 'Visão clara', 'Comunicação'] },
        { source: 7, target: 5, value: 2, compliments: ['Gestão de equipe', 'Suporte técnico'] },
        { source: 8, target: 5, value: 3, compliments: ['Liderança', 'Decisões técnicas', 'Arquitetura'] },
        { source: 8, target: 10, value: 2, compliments: ['APIs robustas', 'Performance'] },
        { source: 9, target: 1, value: 2, compliments: ['Código limpo', 'Testes bem escritos'] },
        { source: 9, target: 4, value: 1, compliments: ['Evolução rápida'] },
        { source: 10, target: 8, value: 2, compliments: ['DevOps excellence', 'Disponibilidade'] },
        { source: 10, target: 11, value: 3, compliments: ['Integração perfeita', 'Comunicação', 'Colaboração'] },
        { source: 11, target: 10, value: 2, compliments: ['APIs bem documentadas', 'Suporte backend'] },
        { source: 11, target: 3, value: 2, compliments: ['Designs funcionais', 'Prototipagem'] },
        { source: 12, target: 3, value: 3, compliments: ['Mentoria em design', 'Feedback construtivo', 'Colaboração'] }
      ]
    }
  )

  useEffect(() => {
    if (!svgRef.current) return

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove()

  const width = 900
  const height = 600

    // Filtrar nós baseado na busca e departamento
    const filteredNodes = networkData.nodes.filter((node) => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.role.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = filterDepartment === 'all' || node.department === filterDepartment
      return matchesSearch && matchesDept
    })

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id))
    const getEndpointId = (ep: string | number | NodeType): number => {
      if (typeof ep === 'number') return ep
      if (typeof ep === 'string') return Number(ep)
      return ep.id
    }
    const filteredLinks = networkData.links.filter((link) => {
      const sourceId = getEndpointId(link.source)
      const targetId = getEndpointId(link.target)
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId)
    })

    // Mesclar ligações bidirecionais em uma aresta não direcionada única
    const mergedLinksMap = new Map<string, LinkType>()
    for (const l of filteredLinks) {
      const s = getEndpointId(l.source)
      const t = getEndpointId(l.target)
      const [a, b] = s < t ? [s, t] : [t, s]
      const key = `${a}-${b}`
      const existing = mergedLinksMap.get(key)
      if (existing) {
        existing.value += l.value
        // concatena elogios mantendo simples
        existing.compliments = [...existing.compliments, ...l.compliments]
      } else {
        mergedLinksMap.set(key, { source: a, target: b, value: l.value, compliments: [...l.compliments] })
      }
    }
    const mergedLinks = Array.from(mergedLinksMap.values())

    // Configurar SVG
    const svg = d3.select(svgRef.current as SVGSVGElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    // Adicionar zoom
    const g = svg.append('g')

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString())
      })
    svg.call(zoomBehavior)

    // Cores por departamento (adapta para modo escuro/claro)
    const lightColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    const darkColors = ['#60A5FA', '#34D399', '#FBBF24', '#A78BFA']
    const colorRange = isDark ? darkColors : lightColors
    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(['Engenharia', 'Produto', 'Design', 'Data'])
      .range(colorRange)

  // Escala para tamanho dos nós baseado em elogios
  const maxCompliments = d3.max(filteredNodes, (d: NodeType) => d.complimentsReceived + d.complimentsGiven) ?? 1
    const nodeScale = d3.scaleLinear<number, number>()
      .domain([0, maxCompliments])
      .range([20, 40])

    // Configurar simulação de força (tipada)
    const simulation = d3.forceSimulation<NodeType>(filteredNodes)
      .force('link', d3.forceLink<NodeType, LinkType>(mergedLinks)
        .id((d: NodeType) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody<NodeType>().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<NodeType>().radius((d: NodeType) => nodeScale(d.complimentsReceived + d.complimentsGiven) + 5))

    // Removidas setas dos links para reduzir ruído visual

    // Escala para largura das arestas baseada no peso (valor)
    const maxLinkValue = d3.max(mergedLinks, (d: LinkType) => d.value) ?? 1
    const minLinkValue = d3.min(mergedLinks, (d: LinkType) => d.value) ?? 0
    const linkWidthScale = d3.scaleLinear<number, number>()
      .domain([minLinkValue, maxLinkValue])
      .range([1, 6])

    // Adicionar links
    const link = g.append('g')
      .selectAll<SVGLineElement, LinkType>('line')
      .data(mergedLinks)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: LinkType) => linkWidthScale(d.value))
      // sem marcador de seta

    // Labels das arestas (mostram o peso/quantidade de elogios)
    const linkLabels = g.append('g')
      .selectAll<SVGTextElement, LinkType>('text')
      .data(mergedLinks)
      .enter().append('text')
      .text((d: LinkType) => String(d.value))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', isDark ? '#e5e7eb' : '#111827')
      .attr('stroke', isDark ? '#000000' : '#ffffff')
      .attr('stroke-width', 0.8)
      .attr('paint-order', 'stroke')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')

    // Adicionar nós
    const node = g.append('g')
      .selectAll<SVGGElement, NodeType>('g')
      .data(filteredNodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation))

    // Círculos dos nós
    node.append('circle')
      .attr('r', (d: NodeType) => nodeScale(d.complimentsReceived + d.complimentsGiven))
      .attr('fill', (d: NodeType) => colorScale(d.department))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (this: SVGCircleElement, _event: MouseEvent, d: NodeType) {
        setHoveredNode(d)
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', nodeScale(d.complimentsReceived + d.complimentsGiven) * 1.2)
      })
      .on('mouseout', function (this: SVGCircleElement, _event: MouseEvent) {
        setHoveredNode(null)
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', () => {
            const datum = d3.select(this).datum() as NodeType
            return nodeScale(datum.complimentsReceived + datum.complimentsGiven)
          })
      })
      .on('click', (_event: MouseEvent, d: NodeType) => {
        setSelectedNode(d)
      })

    // Labels dos nós
    node.append('text')
      .text((d: NodeType) => d.name)
      .attr('x', 0)
      .attr('y', (d: NodeType) => nodeScale(d.complimentsReceived + d.complimentsGiven) + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      // Melhor contraste: cor do texto depende do tema e adiciona contorno (stroke) para legibilidade sobre círculos
      .attr('fill', isDark ? '#e6eef8' : '#0f172a')
      .attr('stroke', isDark ? '#000000' : '#ffffff')
      .attr('stroke-width', 0.6)
      .attr('paint-order', 'stroke')
      .style('pointer-events', 'none')

    // Função de drag
    function drag(sim: d3.Simulation<NodeType, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, NodeType, NodeType | d3.SubjectPosition>) {
        if (!event.active) sim.alphaTarget(0.3).restart()
        const subj = event.subject as NodeType
        subj.fx = subj.x
        subj.fy = subj.y
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, NodeType, NodeType | d3.SubjectPosition>) {
        const subj = event.subject as NodeType
        subj.fx = event.x
        subj.fy = event.y
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, NodeType, NodeType | d3.SubjectPosition>) {
        if (!event.active) sim.alphaTarget(0)
        const subj = event.subject as NodeType
        subj.fx = null
        subj.fy = null
      }

      return d3.drag<SVGGElement, NodeType>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    // Atualizar posições
    simulation.on('tick', () => {
      link
        .attr('x1', (d: LinkType) => (d.source as NodeType).x as number)
        .attr('y1', (d: LinkType) => (d.source as NodeType).y as number)
        .attr('x2', (d: LinkType) => (d.target as NodeType).x as number)
        .attr('y2', (d: LinkType) => (d.target as NodeType).y as number)

      // posiciona os labels das arestas no ponto médio
      linkLabels
        .attr('x', (d: LinkType) => (((d.source as NodeType).x! + (d.target as NodeType).x!) / 2))
        .attr('y', (d: LinkType) => (((d.source as NodeType).y! + (d.target as NodeType).y!) / 2))

      node.attr('transform', (d: NodeType) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [networkData, searchTerm, filterDepartment, isDark])

  // Obter departamentos únicos
  const departments = ['all', ...Array.from(new Set(networkData.nodes.map((n) => n.department)))]

  return (
    <>
      <PageHeader
        title="Rede de Elogios"
        description="Exploração das conexões e interações de elogios entre pessoas"
        right={<ThemeToggle />}
        icon='ph-network'
      />

      {/* Controles */}
      <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[260px]">
            <Input
              name="search"
              label="Buscar pessoa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome ou cargo..."
              inputMode="search"
              size="sm"
            />
          </div>

          <div className="min-w-[220px] w-[220px]">
            <div className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Departamento</div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === 'all' ? 'Todos' : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

          {/* Legenda */}
          <div className="mt-4 flex gap-5 text-sm text-gray-500 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Engenharia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Produto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Design</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span>Data</span>
            </div>
          </div>
        </div>

        {/* Container principal */}
        <div className="flex gap-5 mt-5">
          {/* Visualização */}
          <div className="bg-white dark:bg-card rounded-lg p-5 shadow-sm flex-1">
            <svg ref={svgRef} className="w-full h-[600px]"></svg>
            <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-300">💡 Arraste os nós para reorganizar • Scroll para zoom • Clique para ver detalhes</div>
          </div>

          {/* Painel de detalhes */}
          <div className="w-72">
            {/* Info do nó hover */}
            {hoveredNode && (
              <div className="bg-white dark:bg-card rounded-lg p-4 mb-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">{hoveredNode.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{hoveredNode.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{hoveredNode.department}</p>
                <div className="flex gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Elogios dados:</span>
                    <span className="font-semibold ml-1 text-green-600">{hoveredNode.complimentsGiven}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Recebidos:</span>
                    <span className="font-semibold ml-1 text-blue-500">{hoveredNode.complimentsReceived}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Detalhes do nó selecionado */}
            {selectedNode && (
              <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Detalhes</h3>
                  <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">×</button>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{selectedNode.role} • {selectedNode.department}</p>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Conexões de Elogios</h5>
                  {networkData.links
                    .filter((link) => (link.source === selectedNode.id) || (link.target === selectedNode.id))
                    .map((link, idx) => {
                      const otherNodeId = link.source === selectedNode.id ? link.target : link.source
                      const otherNode = networkData.nodes.find((n) => n.id === (otherNodeId as number))
                      const isGiver = link.source === selectedNode.id
                      const relatedLinks = networkData.links.filter((l) => (l.source === selectedNode.id) || (l.target === selectedNode.id))
                      const hasBorder = idx < relatedLinks.length - 1

                      return (
                        <div key={idx} className={`${hasBorder ? 'border-b border-gray-200 dark:border-gray-700 pb-3 mb-3' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{isGiver ? '→' : '←'} {otherNode?.name}</span>
                            <span className="text-xs text-gray-400 italic">({link.value} elogios)</span>
                          </div>
                          <div className="ml-3">
                            {link.compliments.slice(0, 2).map((compliment, i) => (
                              <div key={i} className="text-sm text-gray-600 dark:text-gray-300 mb-0.5">• {compliment}</div>
                            ))}
                            {link.compliments.length > 2 && (
                              <div className="text-sm text-gray-400 italic">+{link.compliments.length - 2} mais...</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="text-lg font-bold text-green-600">{selectedNode.complimentsGiven}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Elogios dados</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="text-lg font-bold text-blue-500">{selectedNode.complimentsReceived}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Elogios recebidos</div>
                  </div>
                </div>
              </div>
            )}

            {!hoveredNode && !selectedNode && (
              <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm text-center text-gray-400">
                <p className="text-sm">Passe o mouse ou clique em um nó para ver mais detalhes</p>
              </div>
            )}
          </div>
        </div>
    </>
  )
}

export default NetworkVisualization

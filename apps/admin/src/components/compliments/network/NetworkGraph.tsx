import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useTheme } from '@/hooks/useTheme'
import type { NetworkNode, NetworkLink } from '@/types/compliments'

interface NetworkGraphProps {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

// D3 node type with simulation properties
type D3Node = NetworkNode & {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  index?: number
}

// D3 link type
type D3Link = d3.SimulationLinkDatum<D3Node> & NetworkLink

interface TooltipData {
  node: D3Node
  x: number
  y: number
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const { isDark } = useTheme()

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove()

    const { width, height } = dimensions

    // Copy nodes to avoid mutating props
    const d3Nodes: D3Node[] = nodes.map(n => ({ ...n }))

    // Merge bidirectional links into single undirected edges
    const mergedLinksMap = new Map<string, D3Link>()
    for (const l of links) {
      const [a, b] = l.source < l.target ? [l.source, l.target] : [l.target, l.source]
      const key = `${a}-${b}`
      const existing = mergedLinksMap.get(key)
      if (existing) {
        existing.value += l.value
        existing.compliments = [...existing.compliments, ...l.compliments]
      } else {
        mergedLinksMap.set(key, {
          source: a,
          target: b,
          value: l.value,
          compliments: [...l.compliments]
        })
      }
    }
    const mergedLinks = Array.from(mergedLinksMap.values())

    // Setup SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    // Add zoom
    const g = svg.append('g')

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString())
      })
    svg.call(zoomBehavior)

    // Get unique departments for color scale
    const departments = Array.from(new Set(nodes.map(n => n.department)))
    const lightColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4']
    const darkColors = ['#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F87171', '#22D3EE']
    const colorRange = isDark ? darkColors : lightColors
    const colorScale = d3.scaleOrdinal<string, string>()
      .domain(departments)
      .range(colorRange)

    // Scale for node size based on total compliments
    const maxCompliments = d3.max(d3Nodes, (d: D3Node) => d.complimentsReceived + d.complimentsGiven) ?? 1
    const nodeScale = d3.scaleLinear<number, number>()
      .domain([0, maxCompliments])
      .range([25, 50])

    // Setup force simulation
    const simulation = d3.forceSimulation<D3Node>(d3Nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(mergedLinks)
        .id((d: D3Node) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody<D3Node>().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>().radius((d: D3Node) => nodeScale(d.complimentsReceived + d.complimentsGiven) + 10))

    // Scale for link width based on value
    const maxLinkValue = d3.max(mergedLinks, (d: D3Link) => d.value) ?? 1
    const minLinkValue = d3.min(mergedLinks, (d: D3Link) => d.value) ?? 0
    const linkWidthScale = d3.scaleLinear<number, number>()
      .domain([minLinkValue, maxLinkValue])
      .range([2, 8])

    // Add links
    const link = g.append('g')
      .selectAll<SVGLineElement, D3Link>('line')
      .data(mergedLinks)
      .enter().append('line')
      .attr('stroke', isDark ? '#555' : '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: D3Link) => linkWidthScale(d.value))

    // Link labels (show weight/number of compliments)
    const linkLabels = g.append('g')
      .selectAll<SVGTextElement, D3Link>('text')
      .data(mergedLinks)
      .enter().append('text')
      .text((d: D3Link) => String(d.value))
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('fill', isDark ? '#e5e7eb' : '#111827')
      .attr('stroke', isDark ? '#000000' : '#ffffff')
      .attr('stroke-width', 1)
      .attr('paint-order', 'stroke')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')

    // Add defs for circular clip paths (for avatars)
    const defs = svg.append('defs')
    d3Nodes.forEach((d) => {
      const clipId = `clip-${d.id}`
      defs.append('clipPath')
        .attr('id', clipId)
        .append('circle')
        .attr('r', nodeScale(d.complimentsReceived + d.complimentsGiven))
    })

    // Add nodes
    const node = g.append('g')
      .selectAll<SVGGElement, D3Node>('g')
      .data(d3Nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation))

    // Background circle (for nodes without avatar or as border)
    node.append('circle')
      .attr('r', (d: D3Node) => nodeScale(d.complimentsReceived + d.complimentsGiven))
      .attr('fill', (d: D3Node) => d.avatar ? '#fff' : colorScale(d.department))
      .attr('stroke', (d: D3Node) => colorScale(d.department))
      .attr('stroke-width', 4)
      .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, d: D3Node) {
        setTooltip({
          node: d,
          x: event.pageX,
          y: event.pageY
        })
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', nodeScale(d.complimentsReceived + d.complimentsGiven) * 1.3)
          .attr('stroke-width', 6)
      })
      .on('mousemove', function (this: SVGCircleElement, event: MouseEvent, d: D3Node) {
        setTooltip({
          node: d,
          x: event.pageX,
          y: event.pageY
        })
      })
      .on('mouseout', function (this: SVGCircleElement, _event: MouseEvent, d: D3Node) {
        setTooltip(null)
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', nodeScale(d.complimentsReceived + d.complimentsGiven))
          .attr('stroke-width', 4)
      })

    // Avatar images (only for nodes with avatar)
    node.filter((d: D3Node) => !!d.avatar)
      .append('image')
      .attr('href', (d: D3Node) => d.avatar!)
      .attr('x', (d: D3Node) => -nodeScale(d.complimentsReceived + d.complimentsGiven))
      .attr('y', (d: D3Node) => -nodeScale(d.complimentsReceived + d.complimentsGiven))
      .attr('width', (d: D3Node) => nodeScale(d.complimentsReceived + d.complimentsGiven) * 2)
      .attr('height', (d: D3Node) => nodeScale(d.complimentsReceived + d.complimentsGiven) * 2)
      .attr('clip-path', (d: D3Node) => `url(#clip-${d.id})`)
      .style('pointer-events', 'none')

    // Node labels
    node.append('text')
      .text((d: D3Node) => d.name)
      .attr('x', 0)
      .attr('y', (d: D3Node) => nodeScale(d.complimentsReceived + d.complimentsGiven) + 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', isDark ? '#e6eef8' : '#0f172a')
      .attr('stroke', isDark ? '#000000' : '#ffffff')
      .attr('stroke-width', 0.8)
      .attr('paint-order', 'stroke')
      .style('pointer-events', 'none')

    // Drag function
    function drag(sim: d3.Simulation<D3Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node | d3.SubjectPosition>) {
        if (!event.active) sim.alphaTarget(0.3).restart()
        const subj = event.subject as D3Node
        subj.fx = subj.x
        subj.fy = subj.y
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node | d3.SubjectPosition>) {
        const subj = event.subject as D3Node
        subj.fx = event.x
        subj.fy = event.y
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node | d3.SubjectPosition>) {
        if (!event.active) sim.alphaTarget(0)
        const subj = event.subject as D3Node
        subj.fx = null
        subj.fy = null
      }

      return d3.drag<SVGGElement, D3Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d: D3Link) => (d.source as D3Node).x as number)
        .attr('y1', (d: D3Link) => (d.source as D3Node).y as number)
        .attr('x2', (d: D3Link) => (d.target as D3Node).x as number)
        .attr('y2', (d: D3Link) => (d.target as D3Node).y as number)

      linkLabels
        .attr('x', (d: D3Link) => (((d.source as D3Node).x! + (d.target as D3Node).x!) / 2))
        .attr('y', (d: D3Link) => (((d.source as D3Node).y! + (d.target as D3Node).y!) / 2))

      node.attr('transform', (d: D3Node) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, links, dimensions, isDark])

  if (nodes.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <i className="ph ph-graph text-6xl mb-4 opacity-50" />
          <p>Nenhum dado de rede disponível</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full"></svg>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-center text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
        💡 Arraste os nós • Scroll para zoom • Passe o mouse para detalhes
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y + 15,
          }}
        >
          <div className="bg-card/95 backdrop-blur-sm border rounded-lg shadow-xl p-4 max-w-xs">
            <h3 className="text-sm font-semibold mb-1">{tooltip.node.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{tooltip.node.role}</p>
            <p className="text-xs text-muted-foreground mb-3">{tooltip.node.department}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="text-base font-bold text-green-600">{tooltip.node.complimentsGiven}</div>
                <div className="text-[10px] text-muted-foreground">Dados</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="text-base font-bold text-blue-500">{tooltip.node.complimentsReceived}</div>
                <div className="text-[10px] text-muted-foreground">Recebidos</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// FILE: src/app/component/pedigree-chart/pedigree-chart.component.ts
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { PedigreeNode } from '../../models/pedigree-node.model';

// ---------------------------
// Types enrichis pour D3
// ---------------------------
interface D3PedigreeNode extends PedigreeNode, d3.SimulationNodeDatum {}
interface D3Link extends d3.SimulationLinkDatum<D3PedigreeNode> {
  source: D3PedigreeNode;
  target: D3PedigreeNode;
}


@Component({
  selector: 'app-pedigree-chart',
  standalone: true,
  imports: [],
  templateUrl: './pedigree-chart.component.html',
  styleUrls: ['./pedigree-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PedigreeChartComponent implements OnChanges {
  @Input() data: PedigreeNode[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.createChart();
    }
  }

  // ---------------------------
  // Création du graphique D3
  // ---------------------------
  private createChart(): void {
    const container = this.elementRef.nativeElement.querySelector('.pedigree-container');
    d3.select(container).select('svg').remove(); // Reset du graphique

    if (!this.data || this.data.length === 0) return;

    const nodes: D3PedigreeNode[] = JSON.parse(JSON.stringify(this.data)); // Copie profonde
    const links = this.buildLinks(nodes);

    const { width, height } = this.getContainerDimensions(container);
    const svg = this.createSvg(container, width, height);
    const chartArea = svg.append('g');

    this.addArrowMarker(chartArea);

    const simulation = this.createSimulation(nodes, links, width, height);
    const linkElements = this.createLinks(chartArea, simulation);
    const nodeElements = this.createNodes(chartArea, nodes, container, simulation);

    this.addZoom(svg, chartArea);
    this.startSimulation(simulation, linkElements, nodeElements);
  }

  // ---------------------------
  // Génération des liens à partir des parents
  // ---------------------------


  private buildLinks(nodes: D3PedigreeNode[]): { source: string; target: string }[] {
    const links: { source: string; target: string }[] = [];
    nodes.forEach(node => {
      node.parents?.forEach(parentId => {
        if (nodes.find(n => n.id === parentId)) {
          links.push({ source: parentId, target: node.id });
        }
      });
    });
    return links;
  }

  // ---------------------------
  // Dimensions du conteneur
  // ---------------------------
  private getContainerDimensions(container: HTMLElement) {
    return {
      width: container.clientWidth,
      height: container.clientHeight || 500
    };
  }

  // ---------------------------
  // Création SVG principal
  // ---------------------------
  private createSvg(container: HTMLElement, width: number, height: number) {
    return d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }

  // ---------------------------
  // Définition du marqueur flèche
  // ---------------------------
  private addArrowMarker(chartArea: d3.Selection<SVGGElement, unknown, null, undefined>) {
    chartArea.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 23)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#ccc');
  }

  // ---------------------------
  // Création simulation D3
  // ---------------------------



  private createSimulation(
    nodes: D3PedigreeNode[],
    links: { source: string; target: string }[],
    width: number,
    height: number
  ) {
    return d3.forceSimulation<D3PedigreeNode>(nodes)
      .force('link', d3.forceLink<D3PedigreeNode, { source: string; target: string }>(links)
        .id(d => d.id)
        .distance(120)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('y', d3.forceY().strength(0.03));
  }

  // ---------------------------
  // Création des liens SVG
  // ---------------------------
  private createLinks(
    chartArea: d3.Selection<SVGGElement, unknown, null, undefined>,
    simulation: d3.Simulation<D3PedigreeNode, D3Link>
  ) {
    return chartArea.selectAll<SVGLineElement, D3Link>('.link')
      .data(simulation.force<d3.ForceLink<D3PedigreeNode, D3Link>>('link')!.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrowhead)');
  }

  // ---------------------------
  // Création des nœuds SVG
  // ---------------------------
  
  private createNodes(
    chartArea: d3.Selection<SVGGElement, unknown, null, undefined>,
    nodes: D3PedigreeNode[],
    container: HTMLElement,
    simulation: d3.Simulation<D3PedigreeNode, D3Link>
  ) {
    const nodeGroup = chartArea.selectAll<SVGGElement, D3PedigreeNode>('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    nodeGroup.append('circle')
      .attr('r', 12)
      .style('fill', d => d.hasMarker ? 'var(--color-success, #10B981)' : 'var(--color-primary, #3B82F6)')
      .style('stroke', d => d.hasMarker ? '#059669' : '#2563EB')
      .style('stroke-width', '2px');

    nodeGroup.append('text')
      .attr('dy', '0.35em')
      .attr('y', 28)
      .style('text-anchor', 'middle')
      .text(d => d.name);

    const tooltip = d3.select(container).append('div').attr('class', 'tooltip');

    nodeGroup
      .on('mouseover', (event: MouseEvent, d: D3PedigreeNode) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`ID: <strong>${d.id}</strong><br>Marqueur: <strong>${d.hasMarker ? 'Oui' : 'Non'}</strong>`)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

    nodeGroup.call(this.makeDrag(simulation));

    return nodeGroup;
  }

  // ---------------------------
  // Fonction de drag D3
  // ---------------------------


  private makeDrag(simulation: d3.Simulation<D3PedigreeNode, D3Link>) {
    const dragstarted = (event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    const dragged = (event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) => {
      d.fx = event.x;
      d.fy = event.y;
    };
    const dragended = (event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    return d3.drag<SVGGElement, D3PedigreeNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // ---------------------------
  // Zoom D3
  // ---------------------------



  private addZoom(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    chartArea: d3.Selection<SVGGElement, unknown, null, undefined>) {
    
      const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      chartArea.attr('transform', event.transform.toString());
    });
    svg.call(zoom);
  }

  // ---------------------------
  // Simulation tick
  // ---------------------------
  private startSimulation(
    simulation: d3.Simulation<D3PedigreeNode, D3Link>,
    linkElements: d3.Selection<SVGLineElement, D3Link, SVGGElement, unknown>,
    nodeElements: d3.Selection<SVGGElement, D3PedigreeNode, SVGGElement, unknown>
  ) {
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }
}

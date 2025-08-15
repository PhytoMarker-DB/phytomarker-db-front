// FILE: src\app\component\pedigree-chart\pedigree-chart.component.ts
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { PedigreeNode } from '../../models/pedigree-node.model';


// Interface pour les nœuds, incluant les propriétés de position de la simulation D3.
interface D3PedigreeNode extends PedigreeNode, d3.SimulationNodeDatum {}

// Interface pour les liens, assurant que `source` et `target` sont des nœuds de notre type.
interface D3Link extends d3.SimulationLinkDatum<D3PedigreeNode> {
  // D3 remplace les ID par des références aux objets nœuds complets.
  source: D3PedigreeNode;
  target: D3PedigreeNode;
}

@Component({
  selector: 'app-pedigree-chart',
  standalone: true,
  imports: [],
  templateUrl: './pedigree-chart.component.html',
  styleUrl: './pedigree-chart.component.scss',
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

  private createChart(): void {
    const container = this.elementRef.nativeElement.querySelector('.pedigree-container');
    d3.select(container).select('svg').remove();


    if (!this.data || this.data.length === 0) return;

    // Utiliser notre type enrichi dès le départ.
    const nodes: D3PedigreeNode[] = JSON.parse(JSON.stringify(this.data)); // Copie profonde pour éviter la mutation de l'input.

    const links: { source: string; target: string }[] = [];
    nodes.forEach(node => {
      if (node.parents) {
        node.parents.forEach(parentId => {
          if (nodes.find(n => n.id === parentId)) {
            links.push({ source: parentId, target: node.id });
          }
        });
      }
    });

    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const chartArea = svg.append('g');

    chartArea.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 23)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#ccc');

    // Typer explicitement la simulation.
    const simulation: d3.Simulation<D3PedigreeNode, D3Link> = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<D3PedigreeNode, { source: string, target: string }>(links).id(d => d.id).distance(120).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('y', d3.forceY().strength(0.03));

    // Typer la sélection de liens. `simulation.links()` renvoie le type D3Link correct.
    const link = chartArea.selectAll<SVGLineElement, D3Link>('.link')
      .data(simulation.force<d3.ForceLink<D3PedigreeNode, D3Link>>('link')!.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrowhead)');

    // Typer la sélection de groupes de nœuds.
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
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`ID: <strong>${d.id}</strong><br>Marqueur: <strong>${d.hasMarker ? 'Oui' : 'Non'}</strong>`)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Typer explicitement la fonction de drag.
    const drag = (simulation: d3.Simulation<D3PedigreeNode, D3Link>) => {
        function dragstarted(event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event: d3.D3DragEvent<SVGGElement, D3PedigreeNode, D3PedigreeNode>, d: D3PedigreeNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3.drag<SVGGElement, D3PedigreeNode>().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }
    nodeGroup.call(drag(simulation));

    // Typer explicitement la fonction de zoom.
    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      chartArea.attr('transform', event.transform.toString());
    });
    svg.call(zoom);

    simulation.on('tick', () => {
      // TypeScript sait maintenant que d.source et d.target sont des objets D3PedigreeNode avec les propriétés x et y.
      link
        .attr('x1', d => d.source.x!) // L'opérateur '!' indique à TS que la valeur ne sera jamais null/undefined ici.
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      // TypeScript sait que d est un D3PedigreeNode avec les propriétés x et y.
      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }
}
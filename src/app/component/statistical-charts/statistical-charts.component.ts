// FILE: src\app\component\statistical-charts\statistical-charts.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Plant } from '../../models/plant.model';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // CORRECTION: Importer NgxChartsModule
import { CommonModule } from '@angular/common';
import * as d3 from 'd3'; // CORRECTION: Importer d3

// Le format de données pour un seul box plot
export interface ChartData {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
}

@Component({
  selector: 'app-statistical-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule], // CORRECTION: Ajouter NgxChartsModule ici
  templateUrl: './statistical-charts.component.html',
  styleUrls: ['./statistical-charts.component.scss']
})
export class StatisticalChartsComponent implements OnChanges {
  @Input() searchResults: Plant[] = [];

  // Données pour les graphiques
  boxPlotData: ChartData[] = [];
  markerFrequencyData: { name: string, value: number }[] = [];

  // Stocker les interprétations
  boxPlotInterpretation: string = '';
  markerFrequencyInterpretation: string = '';

  // Options de configuration
  view: [number, number] = [400, 300];
  // CORRECTION: Utiliser un nom de schéma de couleurs valide
  colorScheme: string = 'vivid'; 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResults'] && this.searchResults) {
      this.transformDataForCharts();
    }
  }

  private transformDataForCharts(): void {
    if (this.searchResults.length === 0) {
      this.boxPlotData = [];
      this.markerFrequencyData = [];
      return;
    }

    this.prepareBoxPlotData();
    this.prepareMarkerFrequencyData();
  }

  private prepareBoxPlotData(): void {
    const scores = this.searchResults
      .map(p => p.mildewResistanceScore)
      .filter((s): s is number => s !== null && s !== undefined); // S'assurer que les valeurs sont des nombres
    
    if (scores.length < 1) {
      this.boxPlotData = [];
      return;
    }

    // CORRECTION: Formater les données comme attendu par ngx-charts-box-chart
    // On crée une série de valeurs pour que le composant puisse calculer les statistiques.
    this.boxPlotData = [{
      name: 'Score Mildiou',
      series: scores.map((score, index) => ({
        name: String(index), // Le nom de chaque point de donnée n'est pas important ici
        value: score
      }))
    }];
  }

  private prepareMarkerFrequencyData(): void {
    const markerCounts = new Map<string, number>();
    this.searchResults.forEach(plant => {
      plant.genotypes.forEach(genotype => {
        const name = genotype.marker.name;
        markerCounts.set(name, (markerCounts.get(name) || 0) + 1);
      });
    });

    this.markerFrequencyData = Array.from(markerCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  private generateInterpretations(): void {
    const plantCount = this.searchResults.length;

    // --- Interprétation pour le Box Plot ---
    const scores = this.searchResults
      .map(p => p.mildewResistanceScore)
      .filter((s): s is number => s !== null && s !== undefined);

    if (scores.length > 0) {
      const median = d3.quantile(scores.sort((a, b) => a - b), 0.5) ?? 0;
      let biologicalMeaning = '';
      if (median >= 4.0) {
        biologicalMeaning = 'Cela indique une forte résistance globale au mildiou dans cette population.';
      } else if (median < 2.5) {
        biologicalMeaning = 'Cela suggère une susceptibilité générale au mildiou dans ce groupe.';
      } else {
        biologicalMeaning = 'La résistance de ce groupe est modérée.';
      }
      this.boxPlotInterpretation = `Ce graphique résume la distribution des scores pour ${scores.length} plante(s). La médiane est de ${median.toFixed(1)}. ${biologicalMeaning}`;
    }

    // --- Interprétation pour la Fréquence des Marqueurs ---
    if (this.markerFrequencyData.length > 0) {
      const topMarker = this.markerFrequencyData[0];
      this.markerFrequencyInterpretation = `Sur les ${plantCount} plantes sélectionnées, le marqueur le plus fréquent est "${topMarker.name}", présent chez ${topMarker.value} individus. Biologiquement, une haute fréquence peut indiquer une ascendance commune ou une forte pression de sélection pour les gènes liés à ce marqueur.`;
    } else {
        this.markerFrequencyInterpretation = `Aucun des marqueurs recherchés n'a été trouvé dans les ${plantCount} plantes de cette sélection.`;
    }
  }
}
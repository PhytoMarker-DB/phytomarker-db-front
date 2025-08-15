// FILE: src\app\pages\search-page\search-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Importer Observable et of
import { Plant } from '../../models/plant.model';
import { PlantService } from '../../services/plant.service';
import { RouterLink } from '@angular/router';
import { SearchCriteria } from '../../models/search-criteria.model';
import { StatisticalChartsComponent } from '../../component/statistical-charts/statistical-charts.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatisticalChartsComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  searchForm: FormGroup;
  searchResults$ = new BehaviorSubject<Plant[]>([]);
  isLoading = false;
  searchError: string | null = null;
  
  // CORRECTION : Utiliser des Observables simples pour les options.
  // 'of([])' fournit une valeur initiale pour éviter les erreurs.
  varieties$!: Observable<string[]>;
  markers$!: Observable<string[]>;
  mildewScores: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private plantService: PlantService) {
    this.searchForm = this.fb.group({
      variety: [null],
      minMildewScore: [null],
      markerNames: [[]] 
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.onSearch();
  }

  loadFilterOptions(): void {
    // Assigner directement les Observables retournés par le service.
    // Le 'async' pipe dans le template s'occupera de la souscription.
    this.varieties$ = this.plantService.getVarieties();
    this.markers$ = this.plantService.getMarkerNames();
  }
  
  // Le reste des méthodes (onSearch, onExport) est correct et reste inchangé.
  onSearch(): void {
    this.isLoading = true;
    this.searchError = null;
    const formValue = this.searchForm.value;

    const criteria: SearchCriteria = {
      variety: formValue.variety || undefined,
      minMildewScore: formValue.minMildewScore || undefined,
      markerNames: formValue.markerNames && formValue.markerNames.length > 0 ? formValue.markerNames : undefined
    };

    this.plantService.searchPlants(criteria).subscribe({
      next: (results) => {
        this.searchResults$.next(results);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur de recherche:", err);
        this.searchError = "La recherche a échoué. Veuillez vérifier que le serveur est bien démarré.";
        this.isLoading = false;
        this.searchResults$.next([]);
      }
    });
  }

  onExport(): void {
    const formValue = this.searchForm.value;
    const criteria: SearchCriteria = {
      variety: formValue.variety || undefined,
      minMildewScore: formValue.minMildewScore || undefined,
      markerNames: formValue.markerNames && formValue.markerNames.length > 0 ? formValue.markerNames : undefined
    };
    this.plantService.exportPlants(criteria);
  }
}
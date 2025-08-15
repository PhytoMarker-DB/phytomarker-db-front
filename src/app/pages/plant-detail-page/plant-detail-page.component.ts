// FILE: src\app\pages\plant-detail-page\plant-detail-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlantService } from '../../services/plant.service';
import { PlantDetail } from '../../models/plant-detail.model';
import { PedigreeNode } from '../../models/pedigree-node.model';
import { PedigreeChartComponent } from '../../component/pedigree-chart/pedigree-chart.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-plant-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PedigreeChartComponent, DatePipe],
  templateUrl: './plant-detail-page.component.html',
  styleUrl: './plant-detail-page.component.scss'
})
export class PlantDetailPageComponent implements OnInit {
  plant: PlantDetail | null = null;
  isLoading = true;
  error: string | null = null;
  pedigreeData: PedigreeNode[] = [];

  constructor(private route: ActivatedRoute, private plantService: PlantService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.loadPlantData(id);
    } else {
      this.error = "Aucun identifiant de plante n'a été fourni.";
      this.isLoading = false;
    }
  }

  loadPlantData(id: number): void {
    this.isLoading = true;
    this.error = null;

    // Utiliser forkJoin pour lancer les deux appels en parallèle
    forkJoin({
      details: this.plantService.getPlantById(id),
      pedigree: this.plantService.getPedigree(id)
    }).subscribe({
      next: ({ details, pedigree }) => {
        this.plant = details;
        this.pedigreeData = pedigree;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger les détails de la plante. Vérifiez l'ID et la connexion au serveur.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
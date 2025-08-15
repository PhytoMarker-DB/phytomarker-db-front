// FILE: src\app\pages\data-entry-page\data-entry-page.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantService } from '../../services/plant.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-data-entry-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './data-entry-page.component.html',
  styleUrls: ['./data-entry-page.component.scss']
})
export class DataEntryPageComponent {
  entryForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService
  ) {
    this.entryForm = this.fb.group({
      name: ['', Validators.required],
      variety: ['', Validators.required],
      mildewResistanceScore: [null, [Validators.min(0), Validators.max(5)]], // Validation avancée
      parent1Id: [null],
      parent2Id: [null]
    });
  }

  onSubmit(): void {
    this.entryForm.markAllAsTouched();

    if (this.entryForm.invalid) {
      this.errorMessage = "Le formulaire contient des erreurs. Veuillez les corriger.";
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.plantService.createPlant(this.entryForm.value).subscribe({
      next: (newPlant: any) => {
        this.successMessage = `Plante "${newPlant.name}" créée avec succès (ID: ${newPlant.id}) !`;
        this.isSubmitting = false;
        this.entryForm.reset();
      },
      error: (err) => {
        this.errorMessage = "Une erreur est survenue lors de la création de la plante. Vérifiez les données et la connexion au serveur.";
        this.isSubmitting = false;
        console.error("Erreur de création:", err);
      }
    });
  }
}
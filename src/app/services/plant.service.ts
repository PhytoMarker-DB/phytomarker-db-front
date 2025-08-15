// FILE: src\app\services\plant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Plant } from '../models/plant.model';
import { PlantDetail } from '../models/plant-detail.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { PedigreeNode } from '../models/pedigree-node.model';

export type NewPlantData = Partial<Plant>;

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getPlantById(id: number): Observable<PlantDetail> {
    return this.http.get<PlantDetail>(`${this.apiUrl}/plants/${id}`);
  }

  getPedigree(id: number): Observable<PedigreeNode[]> {
    return this.http.get<PedigreeNode[]>(`${this.apiUrl}/plants/${id}/pedigree`);
  }

  searchPlants(criteria: SearchCriteria): Observable<Plant[]> {
    let params = new HttpParams();
    if (criteria.variety) {
      params = params.set('variety', criteria.variety);
    }
    if (criteria.minMildewScore !== undefined && criteria.minMildewScore !== null) {
      params = params.set('minMildewScore', criteria.minMildewScore.toString());
    }
    if (criteria.markerNames && criteria.markerNames.length > 0) {
      criteria.markerNames.forEach(name => {
        params = params.append('markerNames', name);
      });
    }
    return this.http.get<Plant[]>(`${this.apiUrl}/plants/search`, { params }).pipe(
      catchError(this.handleError<Plant[]>('searchPlants', []))
    );
  }

  exportPlants(criteria: SearchCriteria): void {
    let params = new HttpParams();
    // ... (la logique des paramètres reste la même)
    this.http.get(`${this.apiUrl}/plants/search/export`, { params, responseType: 'blob' })
      .subscribe(blob => saveAs(blob, 'export_plants.csv'));
  }

  getVarieties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/plants/varieties`).pipe(
      catchError(this.handleError<string[]>('getVarieties', []))
    );
  }
  
  getMarkerNames(): Observable<string[]> {
    // CORRECTION: L'URL doit pointer vers '/api/markers', et non '/api/plants/markers'.
    return this.http.get<string[]>(`${this.apiUrl}/markers`).pipe(
      catchError(this.handleError<string[]>('getMarkerNames', []))
    );
  }

  createPlant(plantData: NewPlantData): Observable<Plant> {
    return this.http.post<Plant>(`${this.apiUrl}/plants`, plantData);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
// FILE: src\app\app.routes.ts
import { Routes } from '@angular/router';
import {SearchPageComponent} from './pages/search-page/search-page.component';
import {PlantDetailPageComponent} from './pages/plant-detail-page/plant-detail-page.component';
import {DataEntryPageComponent} from './pages/data-entry-page/data-entry-page.component';

export const routes: Routes = [

  {
    path: 'search',
    component: SearchPageComponent
  },
  {
    path: 'plant/:id',
    component: PlantDetailPageComponent
  },
  { path: 'data-entry', component: DataEntryPageComponent },
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/search'
  },
];
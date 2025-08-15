import { Genotype } from './genotype.model';
import { PhenotypeObservation } from './phenotype-observation.model';

export interface PlantDetail {
  id: number;
  name: string;
  variety: string;

  parent1Id?: number;
  parent2Id?: number;

  genotypes: Genotype[];

  observations: PhenotypeObservation[];
}

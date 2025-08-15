import {Marker} from './marker.model';

export interface Plant {
  id: number;
  name: string;
  variety: string;
  mildewResistanceScore: number;
  genotypes: { marker: { name: string } }[];
}

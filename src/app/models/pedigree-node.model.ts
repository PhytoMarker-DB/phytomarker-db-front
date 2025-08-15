export interface PedigreeNode {
  id: string;
  name: string;
  parents?: string[];
  hasMarker?: boolean;
}

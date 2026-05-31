import { Categorie } from './categorie';

export interface Snack {
  id_snack: number;
  nom: string;
  prix: number;
  stock: number;
  id_categorie: number | null;
  categorie?: Categorie | null;
}

export type SnackCreateDto = Omit<Snack, 'id_snack' | 'categorie'>;
export type SnackUpdateDto = Partial<SnackCreateDto>;

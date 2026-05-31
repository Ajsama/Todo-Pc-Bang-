export interface Poste {
  id_poste: number;
  numero_poste: string | null;
  statut: string | null;
  type: string | null;
}

export type PosteCreateDto = Omit<Poste, 'id_poste'>;
export type PosteUpdateDto = Partial<PosteCreateDto>;

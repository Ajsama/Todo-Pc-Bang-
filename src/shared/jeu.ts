export interface Jeu {
  id_jeu: number;
  titre: string;
  editeur: string | null;
  genre: string | null;
  annee: number | null;
}

export type JeuCreateDto = Omit<Jeu, 'id_jeu'>;
export type JeuUpdateDto = Partial<JeuCreateDto>;

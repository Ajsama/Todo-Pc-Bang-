export interface Abonnement {
  id_abonnement: number;
  type: string;
  prix: number | null;
  duree: number | null;
}

export interface Client {
  id_client: number;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  id_abonnement: number | null;
  abonnement?: Abonnement | null;
}

export type ClientCreateDto = Omit<Client, 'id_client' | 'abonnement'>;
export type ClientUpdateDto = Partial<ClientCreateDto>;

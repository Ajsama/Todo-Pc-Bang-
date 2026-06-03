// =====================================================================
//  CONTRAT PARTAGÉ (shared) : les TYPES du Client
//  Couche : SHARED = utilisé par le front ET le back (un seul vocabulaire).
//  Rôle   : décrire la forme des données. Les "Dto" = ce qu'on envoie pour
//           créer/modifier (sans l'id, généré par la base).
//    - ClientCreateDto = un Client SANS id_client ni abonnement (création)
//    - ClientUpdateDto = pareil mais tous les champs optionnels (modif partielle)
// =====================================================================
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

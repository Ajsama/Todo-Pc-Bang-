export interface DashboardStats {
  nbClients: number;
  nbPostes: number;
  nbReservations: number;
  nbSnacks: number;
  nbJeux: number;
  reservationsParStatut: { statut: string; count: number }[];
  postesParStatut: { statut: string; count: number }[];
}

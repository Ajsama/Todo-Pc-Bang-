import { PrismaClient } from "@prisma/client";
import { DashboardStats } from "src/shared/dashboard";

export class DashboardRepository {
  private db = new PrismaClient();

  async getStats(): Promise<DashboardStats> {
    const nbClients = await this.db.client.count();
    const nbPostes = await this.db.poste.count();
    const nbReservations = await this.db.reservation.count();
    const nbSnacks = await this.db.snack.count();
    const nbJeux = await this.db.jeu.count();

    const groupReservations = await this.db.reservation.groupBy({
      by: ['statut'],
      _count: { id_reservation: true },
    });
    const reservationsParStatut = groupReservations.map(g => ({
      statut: g.statut ?? 'Inconnu',
      count: g._count.id_reservation,
    }));

    const groupPostes = await this.db.poste.groupBy({
      by: ['statut'],
      _count: { id_poste: true },
    });
    const postesParStatut = groupPostes.map(g => ({
      statut: g.statut ?? 'Inconnu',
      count: g._count.id_poste,
    }));

    return {
      nbClients,
      nbPostes,
      nbReservations,
      nbSnacks,
      nbJeux,
      reservationsParStatut,
      postesParStatut,
    };
  }
}

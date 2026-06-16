import { PrismaClient } from "@prisma/client";
import { Reservation, ReservationCreateDto, ReservationUpdateDto } from "src/shared/reservation";

export class ReservationRepository {
  private db = new PrismaClient();

  async getReservations(): Promise<Reservation[]> {
    return this.db.reservation.findMany({
      include: { client: true, poste: true },
      orderBy: { date_debut: 'desc' }
    });
  }
/*
  SELECT *
  FROM reservation
  LEFT JOIN client ON reservation.id_client = client.id_client
  LEFT JOIN poste  ON reservation.id_poste  = poste.id_poste
  ORDER BY reservation.date_debut DESC;
  
*/

  async addReservation(dto: ReservationCreateDto): Promise<Reservation> {
    // TRANSACTION (tout ou rien) :
    // 1) on cree la reservation
    // 2) on passe le poste reserve en "Occupe"
    // Si une des deux operations echoue, Prisma annule l'autre (rollback).
    // Sans ca, on risquerait un poste marque "Libre" alors qu'il est reserve.
    const [reservation] = await this.db.$transaction([
      this.db.reservation.create({
        data: dto,
        include: { client: true, poste: true }
      }),
      this.db.poste.update({
        where: { id_poste: dto.id_poste },
        data: { statut: "Occupe" }
      })
    ]);
    return reservation;
  }

  async updateReservation(id: number, dto: ReservationUpdateDto): Promise<Reservation> {
    return this.db.reservation.update({
      where: { id_reservation: id },
      data: dto,
      include: { client: true, poste: true }
    });
  }

  async deleteReservation(id: number): Promise<void> {
    await this.db.reservation.delete({ where: { id_reservation: id } });
  }
}

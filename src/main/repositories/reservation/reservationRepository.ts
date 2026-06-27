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

  async addReservation(dto: ReservationCreateDto): Promise<Reservation> {
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

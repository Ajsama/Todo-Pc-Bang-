import { ipcRenderer } from "electron";
import { IReservationService } from "src/shared/interfaces/IReservationService";
import { Reservation, ReservationCreateDto, ReservationUpdateDto } from "src/shared/reservation";

export function reservationService(): IReservationService {
  return {
    async getReservations(): Promise<Reservation[]> {
      return await ipcRenderer.invoke('reservation:getReservations');
    },
    async addReservation(reservation: ReservationCreateDto): Promise<Reservation> {
      return await ipcRenderer.invoke('reservation:addReservation', reservation);
    },
    async updateReservation(id: number, reservation: ReservationUpdateDto): Promise<Reservation> {
      return await ipcRenderer.invoke('reservation:updateReservation', id, reservation);
    },
    async deleteReservation(id: number): Promise<void> {
      return await ipcRenderer.invoke('reservation:deleteReservation', id);
    }
  };
}

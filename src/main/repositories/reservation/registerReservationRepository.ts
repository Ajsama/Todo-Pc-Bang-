import { ipcMain } from "electron";
import { ReservationRepository } from "./reservationRepository";
import { ReservationCreateDto, ReservationUpdateDto } from "src/shared/reservation";

export const registerReservationRepository = () => {
  const repo = new ReservationRepository();

  ipcMain.handle('reservation:getReservations', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getReservations()));
    } catch (error) {
      console.error('[reservation:getReservations]', error);
      throw new Error('Impossible de charger les réservations');
    }
  });

  ipcMain.handle('reservation:addReservation', async (_, reservation: ReservationCreateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.addReservation(reservation)));
    } catch (error) {
      console.error('[reservation:addReservation]', error);
      throw new Error('Impossible de créer la réservation');
    }
  });

  ipcMain.handle('reservation:updateReservation', async (_, id: number, reservation: ReservationUpdateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.updateReservation(id, reservation)));
    } catch (error) {
      console.error('[reservation:updateReservation]', error);
      throw new Error(`Impossible de modifier la réservation #${id}`);
    }
  });

  ipcMain.handle('reservation:deleteReservation', async (_, id: number) => {
    try {
      await repo.deleteReservation(id);
    } catch (error) {
      console.error('[reservation:deleteReservation]', error);
      throw new Error(`Impossible de supprimer la réservation #${id}`);
    }
  });
};

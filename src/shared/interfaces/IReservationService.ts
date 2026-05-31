import { Reservation, ReservationCreateDto, ReservationUpdateDto } from "../reservation";

export interface IReservationService {
  getReservations(): Promise<Reservation[]>;
  addReservation(reservation: ReservationCreateDto): Promise<Reservation>;
  updateReservation(id: number, reservation: ReservationUpdateDto): Promise<Reservation>;
  deleteReservation(id: number): Promise<void>;
}

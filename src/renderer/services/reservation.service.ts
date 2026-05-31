import { Injectable } from '@angular/core';
import { Reservation, ReservationCreateDto, ReservationUpdateDto } from 'src/shared/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  getReservations(): Promise<Reservation[]> {
    return window.electronService.reservations.getReservations();
  }
  addReservation(dto: ReservationCreateDto): Promise<Reservation> {
    return window.electronService.reservations.addReservation(dto);
  }
  updateReservation(id: number, dto: ReservationUpdateDto): Promise<Reservation> {
    return window.electronService.reservations.updateReservation(id, dto);
  }
  deleteReservation(id: number): Promise<void> {
    return window.electronService.reservations.deleteReservation(id);
  }
}

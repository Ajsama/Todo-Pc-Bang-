import { Component, signal, computed, OnInit } from '@angular/core';
import { Reservation } from 'src/shared/reservation';
import { ReservationService } from '../../services/reservation.service';
import { ReservationFormComponent } from './reservation-form.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [ReservationFormComponent],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservations = signal<Reservation[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  reservationSelectionnee = signal<Reservation | null>(null);

  nombreReservations = computed(() => this.reservations().length);

  constructor(private reservationService: ReservationService) {}

  async ngOnInit() {
    await this.chargerReservations();
  }

  async chargerReservations() {
    this.chargement.set(true);
    const data = await this.reservationService.getReservations();
    this.reservations.set(data);
    this.chargement.set(false);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('fr-FR');
  }

  ouvrirFormulaire() {
    this.reservationSelectionnee.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.reservationSelectionnee.set(null);
  }

  modifierReservation(reservation: Reservation) {
    this.reservationSelectionnee.set(reservation);
    this.afficherFormulaire.set(true);
  }

  async supprimerReservation(id: number) {
    if (!confirm('Supprimer cette réservation ?')) return;
    await this.reservationService.deleteReservation(id);
    const liste = this.reservations().filter(r => r.id_reservation !== id);
    this.reservations.set(liste);
  }

  async onSauvegarde(reservation: Reservation) {
    await this.chargerReservations();
    this.fermerFormulaire();
  }
}

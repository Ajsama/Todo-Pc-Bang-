import { Component, signal, computed, OnInit } from '@angular/core';
import { Reservation } from 'src/shared/reservation';
import { ReservationService } from '../../services/reservation.service';
import { ReservationFormComponent } from './reservation-form.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [ReservationFormComponent],
  template: `
    <div class="page-header">
      <h1>Réservations <span class="count">({{ nombreReservations() }})</span></h1>
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter une réservation</button>
    </div>

    @if (afficherFormulaire()) {
      <app-reservation-form
        [reservationAModifier]="reservationSelectionnee()"
        (sauvegarde)="onSauvegarde($event)"
        (annulation)="fermerFormulaire()"
      />
    }

    @if (chargement()) {
      <p>Chargement...</p>
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Poste</th>
            <th>Date début</th>
            <th>Durée (h)</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (r of reservations(); track r.id_reservation) {
            <tr>
              <td>{{ r.client?.prenom }} {{ r.client?.nom }}</td>
              <td>{{ r.poste?.numero_poste }}</td>
              <td>{{ formatDate(r.date_debut) }}</td>
              <td>{{ r.duree }}h</td>
              <td><span [class]="'badge badge-' + r.statut">{{ r.statut }}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" (click)="modifierReservation(r)">Modifier</button>
                <button class="btn btn-sm btn-danger" (click)="supprimerReservation(r.id_reservation)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty">Aucune réservation.</td></tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .count { color: #888; font-weight: normal; font-size: 1rem; }
    .table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
    .table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; }
    .table th { background: #f8f9fa; font-weight: 600; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }
    .badge-EnCours { background: #cce5ff; color: #004085; }
    .badge-Confirmee { background: #d4edda; color: #155724; }
    .badge-Terminee { background: #e2e3e5; color: #383d41; }
    .badge-EnAttente { background: #fff3cd; color: #856404; }
    .badge-Annulee { background: #f8d7da; color: #721c24; }
    .empty { text-align: center; color: #888; padding: 24px; }
    .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 0.8rem; margin-right: 4px; }
  `]
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

import { Component, input, output, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Reservation, ReservationCreateDto, ReservationUpdateDto } from 'src/shared/reservation';
import { Client } from 'src/shared/client';
import { Poste } from 'src/shared/poste';
import { ReservationService } from '../../services/reservation.service';
import { ClientService } from '../../services/client.service';
import { PosteService } from '../../services/poste.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-overlay">
      <div class="form-card">
        <h2>{{ reservationAModifier() ? 'Modifier la réservation' : 'Ajouter une réservation' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Client *</label>
            <select formControlName="id_client">
              <option value="">-- Sélectionner un client --</option>
              @for (client of clients(); track client.id_client) {
                <option [value]="client.id_client">{{ client.prenom }} {{ client.nom }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Poste *</label>
            <select formControlName="id_poste">
              <option value="">-- Sélectionner un poste --</option>
              @for (poste of postes(); track poste.id_poste) {
                <option [value]="poste.id_poste">{{ poste.numero_poste }} ({{ poste.type }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Date de début *</label>
            <input formControlName="date_debut" type="datetime-local" />
          </div>
          <div class="form-group">
            <label>Durée (heures) *</label>
            <input formControlName="duree" type="number" min="1" />
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select formControlName="statut">
              <option value="EnAttente">En attente</option>
              <option value="Confirmee">Confirmée</option>
              <option value="EnCours">En cours</option>
              <option value="Terminee">Terminée</option>
              <option value="Annulee">Annulée</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="annulation.emit()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || enCours">
              {{ enCours ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .form-card { background: white; border-radius: 12px; padding: 32px; width: 480px; max-width: 90vw; max-height: 90vh; overflow-y: auto; }
    h2 { margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-weight: 500; font-size: 0.9rem; }
    .form-group input, .form-group select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class ReservationFormComponent implements OnInit {
  reservationAModifier = input<Reservation | null>(null);
  sauvegarde = output<Reservation>();
  annulation = output<void>();

  clients = signal<Client[]>([]);
  postes = signal<Poste[]>([]);
  enCours = false;

  form = this.fb.group({
    id_client: ['', Validators.required],
    id_poste: ['', Validators.required],
    date_debut: ['', Validators.required],
    duree: [1, [Validators.required, Validators.min(1)]],
    statut: ['EnAttente']
  });

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private posteService: PosteService
  ) {}

  async ngOnInit() {
    const clients = await this.clientService.getClients();
    this.clients.set(clients);

    const postes = await this.posteService.getPostes();
    this.postes.set(postes);

    const reservation = this.reservationAModifier();
    if (reservation) {
      const dateStr = reservation.date_debut
        ? new Date(reservation.date_debut).toISOString().slice(0, 16)
        : '';
      this.form.patchValue({
        id_client: reservation.id_client?.toString() ?? '',
        id_poste: reservation.id_poste?.toString() ?? '',
        date_debut: dateStr,
        duree: reservation.duree ?? 1,
        statut: reservation.statut ?? 'EnAttente'
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const reservation = this.reservationAModifier();
    const dto = {
      id_client: Number(values.id_client),
      id_poste: Number(values.id_poste),
      date_debut: new Date(values.date_debut!),
      duree: Number(values.duree),
      statut: values.statut!
    };
    if (reservation) {
      const updated = await this.reservationService.updateReservation(reservation.id_reservation, dto as ReservationUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.reservationService.addReservation(dto as ReservationCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}

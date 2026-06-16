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
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
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

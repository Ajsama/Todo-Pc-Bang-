import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Client, ClientCreateDto, ClientUpdateDto } from 'src/shared/client';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-overlay">
      <div class="form-card">
        <h2>{{ clientAModifier() ? 'Modifier le client' : 'Ajouter un client' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom *</label>
            <input formControlName="nom" placeholder="Nom" />
            @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
              <span class="error">Le nom est requis</span>
            }
          </div>
          <div class="form-group">
            <label>Prénom *</label>
            <input formControlName="prenom" placeholder="Prénom" />
            @if (form.get('prenom')?.invalid && form.get('prenom')?.touched) {
              <span class="error">Le prénom est requis</span>
            }
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input formControlName="email" type="email" placeholder="Email" />
            @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
              <span class="error">L'email est requis</span>
            }
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <span class="error">Format d'email invalide</span>
            }
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input formControlName="telephone" placeholder="Téléphone" />
            @if (form.get('telephone')?.invalid && form.get('telephone')?.touched) {
              <span class="error">Le téléphone est requis</span>
            }
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
    .form-card { background: white; border-radius: 12px; padding: 32px; width: 440px; max-width: 90vw; }
    h2 { margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-weight: 500; font-size: 0.9rem; }
    .form-group input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; }
    .error { color: #dc3545; font-size: 0.8rem; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class ClientFormComponent implements OnInit {
  clientAModifier = input<Client | null>(null);
  sauvegarde = output<Client>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private clientService: ClientService) {}

  ngOnInit() {
    const client = this.clientAModifier();
    if (client) {
      this.form.patchValue({
        nom: client.nom ?? '',
        prenom: client.prenom ?? '',
        email: client.email ?? '',
        telephone: client.telephone ?? ''
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const client = this.clientAModifier();
    if (client) {
      const updated = await this.clientService.updateClient(client.id_client, values as ClientUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.clientService.addClient(values as ClientCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}

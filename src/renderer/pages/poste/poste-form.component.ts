import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Poste, PosteCreateDto, PosteUpdateDto } from 'src/shared/poste';
import { PosteService } from '../../services/poste.service';

@Component({
  selector: 'app-poste-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-overlay">
      <div class="form-card">
        <h2>{{ posteAModifier() ? 'Modifier le poste' : 'Ajouter un poste' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Numéro de poste *</label>
            <input formControlName="numero_poste" placeholder="Ex: P01" />
            @if (form.get('numero_poste')?.invalid && form.get('numero_poste')?.touched) {
              <span class="error">Le numéro est requis</span>
            }
          </div>
          <div class="form-group">
            <label>Type</label>
            <select formControlName="type">
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label>Statut *</label>
            <select formControlName="statut">
              <option value="Libre">Libre</option>
              <option value="Occupe">Occupé</option>
              <option value="Maintenance">Maintenance</option>
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
    .form-card { background: white; border-radius: 12px; padding: 32px; width: 440px; max-width: 90vw; }
    h2 { margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-weight: 500; font-size: 0.9rem; }
    .form-group input, .form-group select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; }
    .error { color: #dc3545; font-size: 0.8rem; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PosteFormComponent implements OnInit {
  posteAModifier = input<Poste | null>(null);
  sauvegarde = output<Poste>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    numero_poste: ['', Validators.required],
    type: [''],
    statut: ['Libre', Validators.required]
  });

  constructor(private fb: FormBuilder, private posteService: PosteService) {}

  ngOnInit() {
    const poste = this.posteAModifier();
    if (poste) {
      this.form.patchValue({
        numero_poste: poste.numero_poste ?? '',
        type: poste.type ?? '',
        statut: poste.statut ?? 'Libre'
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const poste = this.posteAModifier();
    if (poste) {
      const updated = await this.posteService.updatePoste(poste.id_poste, values as PosteUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.posteService.addPoste(values as PosteCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}

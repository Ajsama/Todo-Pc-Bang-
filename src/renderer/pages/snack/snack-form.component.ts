import { Component, input, output, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Snack, SnackCreateDto, SnackUpdateDto } from 'src/shared/snack';
import { Categorie } from 'src/shared/categorie';
import { SnackService } from '../../services/snack.service';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-snack-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-overlay">
      <div class="form-card">
        <h2>{{ snackAModifier() ? 'Modifier le snack' : 'Ajouter un snack' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom *</label>
            <input formControlName="nom" placeholder="Ex: Coca-Cola" />
            @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
              <span class="error">Le nom est requis</span>
            }
          </div>
          <div class="form-group">
            <label>Prix (€) *</label>
            <input formControlName="prix" type="number" step="0.01" min="0" />
            @if (form.get('prix')?.invalid && form.get('prix')?.touched) {
              <span class="error">Le prix doit être positif</span>
            }
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input formControlName="stock" type="number" min="0" />
          </div>
          <div class="form-group">
            <label>Catégorie</label>
            <select formControlName="id_categorie">
              <option [ngValue]="null">-- Aucune --</option>
              @for (cat of categories(); track cat.id_categorie) {
                <option [ngValue]="cat.id_categorie">{{ cat.nom }}</option>
              }
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
export class SnackFormComponent implements OnInit {
  snackAModifier = input<Snack | null>(null);
  sauvegarde = output<Snack>();
  annulation = output<void>();

  categories = signal<Categorie[]>([]);
  enCours = false;

  form = this.fb.group({
    nom: ['', Validators.required],
    prix: [0, [Validators.required, Validators.min(0)]],
    stock: [0, Validators.min(0)],
    id_categorie: [null as number | null]
  });

  constructor(
    private fb: FormBuilder,
    private snackService: SnackService,
    private categorieService: CategorieService
  ) {}

  async ngOnInit() {
    const cats = await this.categorieService.getCategories();
    this.categories.set(cats);

    const snack = this.snackAModifier();
    if (snack) {
      this.form.patchValue({
        nom: snack.nom,
        prix: snack.prix,
        stock: snack.stock,
        id_categorie: snack.id_categorie
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const dto = {
      nom: values.nom!,
      prix: Number(values.prix),
      stock: Number(values.stock),
      id_categorie: values.id_categorie ?? null
    };
    const snack = this.snackAModifier();
    if (snack) {
      const updated = await this.snackService.updateSnack(snack.id_snack, dto as SnackUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.snackService.addSnack(dto as SnackCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}

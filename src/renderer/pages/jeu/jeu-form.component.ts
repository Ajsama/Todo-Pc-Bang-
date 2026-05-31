import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Jeu, JeuCreateDto, JeuUpdateDto } from 'src/shared/jeu';
import { JeuService } from '../../services/jeu.service';

@Component({
  selector: 'app-jeu-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-overlay">
      <div class="form-card">
        <h2>{{ jeuAModifier() ? 'Modifier le jeu' : 'Ajouter un jeu' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Titre *</label>
            <input formControlName="titre" placeholder="Ex: League of Legends" />
            @if (form.get('titre')?.invalid && form.get('titre')?.touched) {
              <span class="error">Le titre est requis</span>
            }
          </div>
          <div class="form-group">
            <label>Éditeur</label>
            <input formControlName="editeur" placeholder="Ex: Riot Games" />
          </div>
          <div class="form-group">
            <label>Genre</label>
            <select formControlName="genre">
              <option value="">-- Aucun --</option>
              <option value="FPS">FPS</option>
              <option value="MOBA">MOBA</option>
              <option value="RPG">RPG</option>
              <option value="Stratégie">Stratégie</option>
              <option value="Sport">Sport</option>
              <option value="Course">Course</option>
            </select>
          </div>
          <div class="form-group">
            <label>Année de sortie</label>
            <input formControlName="annee" type="number" min="1970" max="2100" />
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
export class JeuFormComponent implements OnInit {
  jeuAModifier = input<Jeu | null>(null);
  sauvegarde = output<Jeu>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    titre: ['', Validators.required],
    editeur: [''],
    genre: [''],
    annee: [null as number | null]
  });

  constructor(private fb: FormBuilder, private jeuService: JeuService) {}

  ngOnInit() {
    const jeu = this.jeuAModifier();
    if (jeu) {
      this.form.patchValue({
        titre: jeu.titre,
        editeur: jeu.editeur ?? '',
        genre: jeu.genre ?? '',
        annee: jeu.annee
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const dto = {
      titre: values.titre!,
      editeur: values.editeur || null,
      genre: values.genre || null,
      annee: values.annee ? Number(values.annee) : null
    };
    const jeu = this.jeuAModifier();
    if (jeu) {
      const updated = await this.jeuService.updateJeu(jeu.id_jeu, dto as JeuUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.jeuService.addJeu(dto as JeuCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}

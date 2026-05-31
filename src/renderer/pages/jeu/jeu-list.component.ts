import { Component, signal, computed, OnInit } from '@angular/core';
import { Jeu } from 'src/shared/jeu';
import { JeuService } from '../../services/jeu.service';
import { JeuFormComponent } from './jeu-form.component';

@Component({
  selector: 'app-jeu-list',
  standalone: true,
  imports: [JeuFormComponent],
  template: `
    <div class="page-header">
      <h1>Jeux <span class="count">({{ nombreJeux() }})</span></h1>
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter un jeu</button>
    </div>

    @if (afficherFormulaire()) {
      <app-jeu-form
        [jeuAModifier]="jeuSelectionne()"
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
            <th>Titre</th>
            <th>Éditeur</th>
            <th>Genre</th>
            <th>Année</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (j of jeux(); track j.id_jeu) {
            <tr>
              <td><strong>{{ j.titre }}</strong></td>
              <td>{{ j.editeur ?? '—' }}</td>
              <td>{{ j.genre ?? '—' }}</td>
              <td>{{ j.annee ?? '—' }}</td>
              <td>
                <button class="btn btn-sm btn-secondary" (click)="modifierJeu(j)">Modifier</button>
                <button class="btn btn-sm btn-danger" (click)="supprimerJeu(j.id_jeu)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">Aucun jeu enregistré.</td></tr>
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
    .empty { text-align: center; color: #888; padding: 24px; }
    .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 0.8rem; margin-right: 4px; }
  `]
})
export class JeuListComponent implements OnInit {
  jeux = signal<Jeu[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  jeuSelectionne = signal<Jeu | null>(null);

  nombreJeux = computed(() => this.jeux().length);

  constructor(private jeuService: JeuService) {}

  async ngOnInit() {
    await this.chargerJeux();
  }

  async chargerJeux() {
    this.chargement.set(true);
    const data = await this.jeuService.getJeux();
    this.jeux.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.jeuSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.jeuSelectionne.set(null);
  }

  modifierJeu(j: Jeu) {
    this.jeuSelectionne.set(j);
    this.afficherFormulaire.set(true);
  }

  async supprimerJeu(id: number) {
    if (!confirm('Supprimer ce jeu ?')) return;
    await this.jeuService.deleteJeu(id);
    this.jeux.set(this.jeux().filter(j => j.id_jeu !== id));
  }

  async onSauvegarde(_jeu: Jeu) {
    await this.chargerJeux();
    this.fermerFormulaire();
  }
}

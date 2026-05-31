import { Component, signal, computed, OnInit } from '@angular/core';
import { Snack } from 'src/shared/snack';
import { SnackService } from '../../services/snack.service';
import { SnackFormComponent } from './snack-form.component';

@Component({
  selector: 'app-snack-list',
  standalone: true,
  imports: [SnackFormComponent],
  template: `
    <div class="page-header">
      <h1>Snacks <span class="count">({{ nombreSnacks() }})</span></h1>
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter un snack</button>
    </div>

    @if (afficherFormulaire()) {
      <app-snack-form
        [snackAModifier]="snackSelectionne()"
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
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (s of snacks(); track s.id_snack) {
            <tr>
              <td><strong>{{ s.nom }}</strong></td>
              <td>{{ s.categorie?.nom ?? '—' }}</td>
              <td>{{ s.prix.toFixed(2) }} €</td>
              <td>{{ s.stock }}</td>
              <td>
                <button class="btn btn-sm btn-secondary" (click)="modifierSnack(s)">Modifier</button>
                <button class="btn btn-sm btn-danger" (click)="supprimerSnack(s.id_snack)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">Aucun snack enregistré.</td></tr>
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
export class SnackListComponent implements OnInit {
  snacks = signal<Snack[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  snackSelectionne = signal<Snack | null>(null);

  nombreSnacks = computed(() => this.snacks().length);

  constructor(private snackService: SnackService) {}

  async ngOnInit() {
    await this.chargerSnacks();
  }

  async chargerSnacks() {
    this.chargement.set(true);
    const data = await this.snackService.getSnacks();
    this.snacks.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.snackSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.snackSelectionne.set(null);
  }

  modifierSnack(s: Snack) {
    this.snackSelectionne.set(s);
    this.afficherFormulaire.set(true);
  }

  async supprimerSnack(id: number) {
    if (!confirm('Supprimer ce snack ?')) return;
    try {
      await this.snackService.deleteSnack(id);
      this.snacks.set(this.snacks().filter(s => s.id_snack !== id));
    } catch (e) {
      alert('Impossible de supprimer ce snack (il est peut-être référencé dans une commande).');
    }
  }

  async onSauvegarde(_snack: Snack) {
    await this.chargerSnacks();
    this.fermerFormulaire();
  }
}

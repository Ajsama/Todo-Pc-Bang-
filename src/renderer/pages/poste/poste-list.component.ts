import { Component, signal, computed, OnInit } from '@angular/core';
import { Poste } from 'src/shared/poste';
import { PosteService } from '../../services/poste.service';
import { PosteFormComponent } from './poste-form.component';

@Component({
  selector: 'app-poste-list',
  standalone: true,
  imports: [PosteFormComponent],
  template: `
    <div class="page-header">
      <h1>Postes <span class="count">({{ nombrePostes() }})</span></h1>
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter un poste</button>
    </div>

    @if (afficherFormulaire()) {
      <app-poste-form
        [posteAModifier]="posteSelectionne()"
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
            <th>N° Poste</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (poste of postes(); track poste.id_poste) {
            <tr>
              <td><strong>{{ poste.numero_poste }}</strong></td>
              <td>{{ poste.type }}</td>
              <td>
                <span [class]="'badge badge-' + poste.statut">{{ poste.statut }}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-secondary" (click)="modifierPoste(poste)">Modifier</button>
                <button class="btn btn-sm btn-danger" (click)="supprimerPoste(poste.id_poste)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4" class="empty">Aucun poste enregistré.</td></tr>
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
    .badge-Libre { background: #d4edda; color: #155724; }
    .badge-Occupe { background: #f8d7da; color: #721c24; }
    .badge-Maintenance { background: #fff3cd; color: #856404; }
    .empty { text-align: center; color: #888; padding: 24px; }
    .btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 0.8rem; margin-right: 4px; }
  `]
})
export class PosteListComponent implements OnInit {
  postes = signal<Poste[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  posteSelectionne = signal<Poste | null>(null);

  nombrePostes = computed(() => this.postes().length);

  constructor(private posteService: PosteService) {}

  async ngOnInit() {
    await this.chargerPostes();
  }

  async chargerPostes() {
    this.chargement.set(true);
    const data = await this.posteService.getPostes();
    this.postes.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.posteSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.posteSelectionne.set(null);
  }

  modifierPoste(poste: Poste) {
    this.posteSelectionne.set(poste);
    this.afficherFormulaire.set(true);
  }

  async supprimerPoste(id: number) {
    if (!confirm('Supprimer ce poste ?')) return;
    await this.posteService.deletePoste(id);
    const liste = this.postes().filter(p => p.id_poste !== id);
    this.postes.set(liste);
  }

  async onSauvegarde(poste: Poste) {
    await this.chargerPostes();
    this.fermerFormulaire();
  }
}

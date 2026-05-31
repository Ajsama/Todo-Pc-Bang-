import { Component, signal, computed, OnInit, effect } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from 'src/shared/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Tableau de bord</h1>
    @if (chargement()) {
      <p>Chargement...</p>
    } @else {
      @if (stats(); as s) {
        <div class="grid">
          <div class="card"><div class="val">{{ s.nbClients }}</div><div class="label">Clients</div></div>
          <div class="card"><div class="val">{{ s.nbPostes }}</div><div class="label">Postes</div></div>
          <div class="card"><div class="val">{{ s.nbReservations }}</div><div class="label">Réservations</div></div>
          <div class="card"><div class="val">{{ s.nbSnacks }}</div><div class="label">Snacks</div></div>
          <div class="card"><div class="val">{{ s.nbJeux }}</div><div class="label">Jeux</div></div>
          <div class="card"><div class="val">{{ total() }}</div><div class="label">Total entrées</div></div>
        </div>

        <h2>Réservations par statut</h2>
        <ul class="liste">
          @for (r of s.reservationsParStatut; track r.statut) {
            <li><span class="puce">{{ r.statut }}</span> {{ r.count }} réservation(s)</li>
          } @empty {
            <li>Aucune réservation enregistrée.</li>
          }
        </ul>

        <h2>Postes par statut</h2>
        <ul class="liste">
          @for (p of s.postesParStatut; track p.statut) {
            <li><span class="puce">{{ p.statut }}</span> {{ p.count }} poste(s)</li>
          } @empty {
            <li>Aucun poste enregistré.</li>
          }
        </ul>
      }
    }
  `,
  styles: [`
    h1 { margin-bottom: 24px; }
    h2 { margin: 24px 0 12px; font-size: 1.1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
    .card { background: #1a1a2e; color: white; border-radius: 12px; padding: 24px; text-align: center; }
    .val { font-size: 2.2rem; font-weight: bold; color: #e94560; }
    .label { color: #ccc; margin-top: 8px; font-size: 0.9rem; }
    .liste { list-style: none; padding: 0; }
    .liste li { padding: 8px 12px; background: #f8f9fa; border-radius: 6px; margin-bottom: 6px; }
    .puce { display: inline-block; background: #e94560; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; margin-right: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  chargement = signal(true);

  total = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    return s.nbClients + s.nbPostes + s.nbReservations + s.nbSnacks + s.nbJeux;
  });

  constructor(private dashboardService: DashboardService) {
    effect(() => console.log('Le total des entrées a changé, nouvelle valeur :', this.total()));
  }

  async ngOnInit() {
    const s = await this.dashboardService.getStats();
    this.stats.set(s);
    this.chargement.set(false);
  }
}

import { Component, signal, computed, OnInit } from '@angular/core';
import { Client } from 'src/shared/client';
import { ClientService } from '../../services/client.service';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import { ClientFormComponent } from './client-form.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [ClientCardComponent, ClientFormComponent],
  template: `
    <div class="page-header">
      <h1>Clients <span class="count">({{ nombreClients() }})</span></h1>
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter un client</button>
    </div>

    @if (afficherFormulaire()) {
      <app-client-form
        [clientAModifier]="clientSelectionne()"
        (sauvegarde)="onSauvegarde($event)"
        (annulation)="fermerFormulaire()"
      />
    }

    @if (chargement()) {
      <p>Chargement...</p>
    } @else {
      <div class="grid">
        @for (client of clients(); track client.id_client) {
          <app-client-card
            [client]="client"
            (edit)="modifierClient($event)"
            (delete)="supprimerClient($event)"
          />
        } @empty {
          <p class="empty">Aucun client enregistré.</p>
        }
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .count { color: #888; font-weight: normal; font-size: 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .empty { color: #888; text-align: center; padding: 32px; }
    .btn-primary { background: #e94560; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; }
  `]
})
export class ClientListComponent implements OnInit {
  clients = signal<Client[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  clientSelectionne = signal<Client | null>(null);

  nombreClients = computed(() => this.clients().length);

  constructor(private clientService: ClientService) {}

  async ngOnInit() {
    await this.chargerClients();
  }

  async chargerClients() {
    this.chargement.set(true);
    const data = await this.clientService.getClients();
    this.clients.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.clientSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.clientSelectionne.set(null);
  }

  async modifierClient(id: number) {
    const client = await this.clientService.getClientById(id);
    this.clientSelectionne.set(client);
    this.afficherFormulaire.set(true);
  }

  async supprimerClient(id: number) {
    if (!confirm('Supprimer ce client ?')) return;
    await this.clientService.deleteClient(id);
    const liste = this.clients().filter(c => c.id_client !== id);
    this.clients.set(liste);
  }

  async onSauvegarde(client: Client) {
    await this.chargerClients();
    this.fermerFormulaire();
  }
}

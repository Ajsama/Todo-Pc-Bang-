import { Component, signal, computed, OnInit } from '@angular/core';
import { Client } from 'src/shared/client';
import { ClientService } from '../../services/client.service';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import { ClientFormComponent } from './client-form.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [ClientCardComponent, ClientFormComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
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

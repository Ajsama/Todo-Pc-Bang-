// =====================================================================
//  FLUX CLIENT — ÉTAPE 1/6 : LE COMPOSANT LISTE (là où vit le bouton)
//  Couche : RENDERER (Angular, ce que l'utilisateur voit à l'écran)
//  Rôle   : afficher la liste des clients + ouvrir le formulaire.
//  C'est le POINT DE DÉPART du flux "Ajouter un client".
//  La réponse de la base revient ici à la fin (ÉTAPE 7, voir onSauvegarde).
// =====================================================================
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
      <!-- LE BOUTON. (click) = "au clic, appelle la méthode ouvrirFormulaire()". C'est ce que le prof demandera de retrouver. -->
      <button class="btn btn-primary" (click)="ouvrirFormulaire()">+ Ajouter un client</button>
    </div>

    <!-- @if : on affiche le formulaire enfant SEULEMENT si le signal afficherFormulaire vaut true.
         [clientAModifier] = donnée passée VERS le bas (null = création).
         (sauvegarde)/(annulation) = événements qui REMONTENT de l'enfant (ÉTAPE 7). -->
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
        <!-- @for : une carte par client. clients() est un SIGNAL : dès qu'il change, la boucle se redessine seule.
             (edit)/(delete) : la carte émet un id, et c'est la liste (parent) qui agit. -->
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
  // Les SIGNALS = des "boîtes" réactives. Quand on change leur valeur avec .set(),
  // tout le HTML qui les lit se redessine automatiquement. C'est le coeur d'Angular moderne.
  clients = signal<Client[]>([]);              // la liste affichée
  chargement = signal(true);                   // true = on affiche "Chargement..."
  afficherFormulaire = signal(false);          // true = le formulaire est ouvert
  clientSelectionne = signal<Client | null>(null); // le client à modifier (null = création)

  nombreClients = computed(() => this.clients().length); // calcul auto à partir du signal clients

  // Angular INJECTE automatiquement le service (ÉTAPE 3) dans le constructeur.
  constructor(private clientService: ClientService) {}

  // ngOnInit() s'exécute automatiquement à l'ouverture de la page -> on charge les clients.
  async ngOnInit() {
    await this.chargerClients();
  }

  // LECTURE (Read) : retraverse les 6 couches en mode "getClients" et remplit le signal.
  async chargerClients() {
    this.chargement.set(true);
    const data = await this.clientService.getClients(); // -> service -> pont -> back -> base
    this.clients.set(data);   // on remplit le signal -> la grille @for se redessine
    this.chargement.set(false);
  }

  // Méthode appelée par LE BOUTON "+ Ajouter un client".
  ouvrirFormulaire() {
    this.clientSelectionne.set(null);    // null => on est en CRÉATION (pas une modif)
    this.afficherFormulaire.set(true);   // true => le @if affiche le formulaire
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

  // SUPPRESSION (Delete) : déclenchée par le bouton "Supprimer" d'une carte.
  async supprimerClient(id: number) {
    if (!confirm('Supprimer ce client ?')) return;   // popup de confirmation
    await this.clientService.deleteClient(id);        // -> retraverse les 6 couches (DELETE)
    const liste = this.clients().filter(c => c.id_client !== id); // on retire le client de la liste locale
    this.clients.set(liste);   // on met à jour le signal -> l'écran enlève la carte
  }

  // ÉTAPE 7 (LE RETOUR) : le formulaire a émis "sauvegarde" -> on recharge la liste et on ferme.
  async onSauvegarde(client: Client) {
    await this.chargerClients();   // on recharge tout depuis la base -> le nouveau client apparaît
    this.fermerFormulaire();
  }
}

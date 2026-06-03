// =====================================================================
//  FLUX CLIENT — ÉTAPE 3/6 : LE SERVICE ANGULAR (standardiste du front)
//  Couche : RENDERER (Angular). DERNIÈRE étape avant de quitter le front.
//  Rôle   : classe TRÈS FINE qui ne fait QUE transmettre l'appel au pont.
//           Aucune logique métier ici, juste un point de passage centralisé.
//  window.electronService = l'objet posé sur la page par le PONT (ÉTAPE 4b).
// =====================================================================
import { Injectable } from '@angular/core';
import { Client, ClientCreateDto, ClientUpdateDto } from 'src/shared/client';

@Injectable({ providedIn: 'root' }) // injectable partout dans l'appli (singleton)
export class ClientService {
  getClients(): Promise<Client[]> {
    return window.electronService.clients.getClients();
  }
  getClientById(id: number): Promise<Client | null> {
    return window.electronService.clients.getClientById(id);
  }
  // Appelé par le formulaire. On délègue au pont Preload (ÉTAPE 4).
  addClient(dto: ClientCreateDto): Promise<Client> {
    return window.electronService.clients.addClient(dto);
  }
  updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return window.electronService.clients.updateClient(id, dto);
  }
  deleteClient(id: number): Promise<void> {
    return window.electronService.clients.deleteClient(id);
  }
}

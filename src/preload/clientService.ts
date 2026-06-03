// =====================================================================
//  FLUX CLIENT — ÉTAPE 4/6 : LE PONT (Preload), côté envoi
//  Couche : PRELOAD = le SEUL pont autorisé entre RENDERER et MAIN.
//  Rôle   : franchir la frontière entre les 2 processus Electron via IPC.
//  ipcRenderer.invoke('client:addClient', client) ENVOIE un message nommé
//  'client:addClient' et ATTEND la réponse. Cette "étiquette" doit être
//  IDENTIQUE à celle écoutée côté back (ipcMain.handle, ÉTAPE 5).
// =====================================================================
import { ipcRenderer } from "electron";
import { IClientService } from "src/shared/interfaces/IClientService";
import { Client, ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export function clientService(): IClientService {
  return {
    async getClients(): Promise<Client[]> {
      return await ipcRenderer.invoke('client:getClients');
    },
    async getClientById(id: number): Promise<Client | null> {
      return await ipcRenderer.invoke('client:getClientById', id);
    },
    // IPC = Inter-Process Communication. C'est LE passage front -> back.
    async addClient(client: ClientCreateDto): Promise<Client> {
      return await ipcRenderer.invoke('client:addClient', client);
    },
    async updateClient(id: number, client: ClientUpdateDto): Promise<Client> {
      return await ipcRenderer.invoke('client:updateClient', id, client);
    },
    async deleteClient(id: number): Promise<void> {
      return await ipcRenderer.invoke('client:deleteClient', id);
    }
  };
}

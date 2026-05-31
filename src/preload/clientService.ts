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

import { ipcMain } from "electron";
import { ClientRepository } from "./clientRepository";
import { ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export const registerClientRepository = () => {
  const repo = new ClientRepository();

  ipcMain.handle('client:getClients', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getClients()));
    } catch (error) {
      console.error('[client:getClients]', error);
      throw new Error('Impossible de charger les clients');
    }
  });

  ipcMain.handle('client:getClientById', async (_, id: number) => {
    try {
      const client = await repo.getClientById(id);
      return client ? JSON.parse(JSON.stringify(client)) : null;
    } catch (error) {
      console.error('[client:getClientById]', error);
      throw new Error(`Impossible de charger le client #${id}`);
    }
  });

  ipcMain.handle('client:addClient', async (_, client: ClientCreateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.addClient(client)));
    } catch (error) {
      console.error('[client:addClient]', error);
      throw new Error('Impossible de créer le client');
    }
  });

  ipcMain.handle('client:updateClient', async (_, id: number, client: ClientUpdateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.updateClient(id, client)));
    } catch (error) {
      console.error('[client:updateClient]', error);
      throw new Error(`Impossible de modifier le client #${id}`);
    }
  });

  ipcMain.handle('client:deleteClient', async (_, id: number) => {
    try {
      await repo.deleteClient(id);
    } catch (error) {
      console.error('[client:deleteClient]', error);
      throw new Error(`Impossible de supprimer le client #${id}`);
    }
  });
};

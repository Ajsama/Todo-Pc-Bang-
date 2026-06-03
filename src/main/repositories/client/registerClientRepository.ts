// =====================================================================
//  FLUX CLIENT — ÉTAPE 5/6 : LE "REGISTER" (l'oreille IPC côté back)
//  Couche : MAIN (Node, coulisses). Branché au démarrage via
//           registerRepositories() appelé dans main.ts.
//  Rôle   : ipcMain.handle('client:addClient', ...) ÉCOUTE l'étiquette
//           envoyée par le pont (ÉTAPE 4) et délègue au Repository (ÉTAPE 6).
//  Le nom 'client:addClient' doit être IDENTIQUE des deux côtés.
// =====================================================================
import { ipcMain } from "electron";
import { ClientRepository } from "./clientRepository";
import { ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export const registerClientRepository = () => {
  const repo = new ClientRepository(); // une instance qui parle à la base

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

  // CRÉATION : reçoit le "client" envoyé par le front. Le "_" est l'expéditeur (ignoré).
  ipcMain.handle('client:addClient', async (_, client: ClientCreateDto) => {
    try {
      // repo.addClient = le VRAI travail (ÉTAPE 6).
      // JSON.parse(JSON.stringify(...)) = on "sérialise" l'objet Prisma pour qu'il
      // traverse proprement le pont IPC (on enlève les types non transférables).
      return JSON.parse(JSON.stringify(await repo.addClient(client)));
    } catch (error) {
      // Gestion d'erreur : on logge la vraie erreur côté back, on renvoie un message clair au front.
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

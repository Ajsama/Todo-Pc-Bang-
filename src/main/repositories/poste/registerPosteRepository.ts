import { ipcMain } from "electron";
import { PosteRepository } from "./posteRepository";
import { PosteCreateDto, PosteUpdateDto } from "src/shared/poste";

export const registerPosteRepository = () => {
  const repo = new PosteRepository();

  ipcMain.handle('poste:getPostes', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getPostes()));
    } catch (error) {
      console.error('[poste:getPostes]', error);
      throw new Error('Impossible de charger les postes');
    }
  });

  ipcMain.handle('poste:addPoste', async (_, poste: PosteCreateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.addPoste(poste)));
    } catch (error) {
      console.error('[poste:addPoste]', error);
      throw new Error('Impossible de créer le poste');
    }
  });

  ipcMain.handle('poste:updatePoste', async (_, id: number, poste: PosteUpdateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.updatePoste(id, poste)));
    } catch (error) {
      console.error('[poste:updatePoste]', error);
      throw new Error(`Impossible de modifier le poste #${id}`);
    }
  });

  ipcMain.handle('poste:deletePoste', async (_, id: number) => {
    try {
      await repo.deletePoste(id);
    } catch (error) {
      console.error('[poste:deletePoste]', error);
      throw new Error(`Impossible de supprimer le poste #${id}`);
    }
  });
};

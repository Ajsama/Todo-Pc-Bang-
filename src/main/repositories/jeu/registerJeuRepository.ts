import { ipcMain } from "electron";
import { JeuRepository } from "./jeuRepository";
import { JeuCreateDto, JeuUpdateDto } from "src/shared/jeu";

export const registerJeuRepository = () => {
  const repo = new JeuRepository();

  ipcMain.handle('jeu:getJeux', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getJeux()));
    } catch (error) {
      console.error('[jeu:getJeux]', error);
      throw new Error('Impossible de charger les jeux');
    }
  });

  ipcMain.handle('jeu:addJeu', async (_, dto: JeuCreateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.addJeu(dto)));
    } catch (error) {
      console.error('[jeu:addJeu]', error);
      throw new Error('Impossible de créer le jeu');
    }
  });

  ipcMain.handle('jeu:updateJeu', async (_, id: number, dto: JeuUpdateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.updateJeu(id, dto)));
    } catch (error) {
      console.error('[jeu:updateJeu]', error);
      throw new Error(`Impossible de modifier le jeu #${id}`);
    }
  });

  ipcMain.handle('jeu:deleteJeu', async (_, id: number) => {
    try {
      await repo.deleteJeu(id);
    } catch (error) {
      console.error('[jeu:deleteJeu]', error);
      throw new Error(`Impossible de supprimer le jeu #${id}`);
    }
  });
};

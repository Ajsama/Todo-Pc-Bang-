import { ipcMain } from "electron";
import { CategorieRepository } from "./categorieRepository";

export const registerCategorieRepository = () => {
  const repo = new CategorieRepository();

  ipcMain.handle('categorie:getCategories', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getCategories()));
    } catch (error) {
      console.error('[categorie:getCategories]', error);
      throw new Error('Impossible de charger les catégories');
    }
  });
};

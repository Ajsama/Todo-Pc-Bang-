import { ipcRenderer } from "electron";
import { ICategorieService } from "src/shared/interfaces/ICategorieService";
import { Categorie } from "src/shared/categorie";

export function categorieService(): ICategorieService {
  return {
    async getCategories(): Promise<Categorie[]> {
      return await ipcRenderer.invoke('categorie:getCategories');
    }
  };
}

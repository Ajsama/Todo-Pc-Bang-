import { ipcRenderer } from "electron";
import { IPosteService } from "src/shared/interfaces/IPosteService";
import { Poste, PosteCreateDto, PosteUpdateDto } from "src/shared/poste";

export function posteService(): IPosteService {
  return {
    async getPostes(): Promise<Poste[]> {
      return await ipcRenderer.invoke('poste:getPostes');
    },
    async addPoste(poste: PosteCreateDto): Promise<Poste> {
      return await ipcRenderer.invoke('poste:addPoste', poste);
    },
    async updatePoste(id: number, poste: PosteUpdateDto): Promise<Poste> {
      return await ipcRenderer.invoke('poste:updatePoste', id, poste);
    },
    async deletePoste(id: number): Promise<void> {
      return await ipcRenderer.invoke('poste:deletePoste', id);
    }
  };
}

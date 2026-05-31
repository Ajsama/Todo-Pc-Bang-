import { ipcRenderer } from "electron";
import { IJeuService } from "src/shared/interfaces/IJeuService";
import { Jeu, JeuCreateDto, JeuUpdateDto } from "src/shared/jeu";

export function jeuService(): IJeuService {
  return {
    async getJeux(): Promise<Jeu[]> {
      return await ipcRenderer.invoke('jeu:getJeux');
    },
    async addJeu(dto: JeuCreateDto): Promise<Jeu> {
      return await ipcRenderer.invoke('jeu:addJeu', dto);
    },
    async updateJeu(id: number, dto: JeuUpdateDto): Promise<Jeu> {
      return await ipcRenderer.invoke('jeu:updateJeu', id, dto);
    },
    async deleteJeu(id: number): Promise<void> {
      return await ipcRenderer.invoke('jeu:deleteJeu', id);
    }
  };
}

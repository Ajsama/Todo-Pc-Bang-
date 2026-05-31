import { ipcRenderer } from "electron";
import { ISnackService } from "src/shared/interfaces/ISnackService";
import { Snack, SnackCreateDto, SnackUpdateDto } from "src/shared/snack";

export function snackService(): ISnackService {
  return {
    async getSnacks(): Promise<Snack[]> {
      return await ipcRenderer.invoke('snack:getSnacks');
    },
    async addSnack(dto: SnackCreateDto): Promise<Snack> {
      return await ipcRenderer.invoke('snack:addSnack', dto);
    },
    async updateSnack(id: number, dto: SnackUpdateDto): Promise<Snack> {
      return await ipcRenderer.invoke('snack:updateSnack', id, dto);
    },
    async deleteSnack(id: number): Promise<void> {
      return await ipcRenderer.invoke('snack:deleteSnack', id);
    }
  };
}

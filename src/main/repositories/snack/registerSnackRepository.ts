import { ipcMain } from "electron";
import { SnackRepository } from "./snackRepository";
import { SnackCreateDto, SnackUpdateDto } from "src/shared/snack";

export const registerSnackRepository = () => {
  const repo = new SnackRepository();

  ipcMain.handle('snack:getSnacks', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getSnacks()));
    } catch (error) {
      console.error('[snack:getSnacks]', error);
      throw new Error('Impossible de charger les snacks');
    }
  });

  ipcMain.handle('snack:addSnack', async (_, dto: SnackCreateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.addSnack(dto)));
    } catch (error) {
      console.error('[snack:addSnack]', error);
      throw new Error('Impossible de créer le snack');
    }
  });

  ipcMain.handle('snack:updateSnack', async (_, id: number, dto: SnackUpdateDto) => {
    try {
      return JSON.parse(JSON.stringify(await repo.updateSnack(id, dto)));
    } catch (error) {
      console.error('[snack:updateSnack]', error);
      throw new Error(`Impossible de modifier le snack #${id}`);
    }
  });

  ipcMain.handle('snack:deleteSnack', async (_, id: number) => {
    try {
      await repo.deleteSnack(id);
    } catch (error) {
      console.error('[snack:deleteSnack]', error);
      throw new Error(`Impossible de supprimer le snack #${id} (il est peut-être référencé dans une commande)`);
    }
  });
};

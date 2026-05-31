import { ipcMain } from "electron";
import { DashboardRepository } from "./dashboardRepository";

export const registerDashboardRepository = () => {
  const repo = new DashboardRepository();

  ipcMain.handle('dashboard:getStats', async () => {
    try {
      return JSON.parse(JSON.stringify(await repo.getStats()));
    } catch (error) {
      console.error('[dashboard:getStats]', error);
      throw new Error('Impossible de calculer les statistiques du dashboard');
    }
  });
};

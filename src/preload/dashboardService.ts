import { ipcRenderer } from "electron";
import { IDashboardService } from "src/shared/interfaces/IDashboardService";
import { DashboardStats } from "src/shared/dashboard";

export function dashboardService(): IDashboardService {
  return {
    async getStats(): Promise<DashboardStats> {
      return await ipcRenderer.invoke('dashboard:getStats');
    }
  };
}

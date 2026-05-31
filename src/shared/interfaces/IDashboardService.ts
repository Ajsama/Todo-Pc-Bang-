import { DashboardStats } from "../dashboard";

export interface IDashboardService {
  getStats(): Promise<DashboardStats>;
}

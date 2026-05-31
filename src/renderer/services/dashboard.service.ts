import { Injectable } from '@angular/core';
import { DashboardStats } from 'src/shared/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getStats(): Promise<DashboardStats> {
    return window.electronService.dashboard.getStats();
  }
}

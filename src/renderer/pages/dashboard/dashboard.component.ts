import { Component, signal, computed, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from 'src/shared/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  chargement = signal(true);

  total = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    return s.nbClients + s.nbPostes + s.nbReservations + s.nbSnacks + s.nbJeux;
  });

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit() {
    const s = await this.dashboardService.getStats();
    this.stats.set(s);
    this.chargement.set(false);
  }
}

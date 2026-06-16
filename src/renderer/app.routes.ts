import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientListComponent } from './pages/client/client-list.component';
import { PosteListComponent } from './pages/poste/poste-list.component';
import { ReservationListComponent } from './pages/reservation/reservation-list.component';
import { SnackListComponent } from './pages/snack/snack-list.component';
import { JeuListComponent } from './pages/jeu/jeu-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'postes', component: PosteListComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'snacks', component: SnackListComponent },
  { path: 'jeux', component: JeuListComponent }
];

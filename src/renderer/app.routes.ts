// =====================================================================
//  NAVIGATION : la table qui relie une URL à un composant-page.
//  Quand on clique sur un lien de la navbar (routerLink="/clients"),
//  Angular regarde ici quel composant afficher dans <router-outlet />.
// =====================================================================
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientListComponent } from './pages/client/client-list.component';
import { PosteListComponent } from './pages/poste/poste-list.component';
import { ReservationListComponent } from './pages/reservation/reservation-list.component';
import { SnackListComponent } from './pages/snack/snack-list.component';
import { JeuListComponent } from './pages/jeu/jeu-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // page d'accueil -> dashboard
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },      // URL /clients -> page liste des clients
  { path: 'postes', component: PosteListComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'snacks', component: SnackListComponent },
  { path: 'jeux', component: JeuListComponent }
];

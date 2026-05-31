import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="brand">PC Bang Manager</div>
      <ul>
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/clients" routerLinkActive="active">Clients</a></li>
        <li><a routerLink="/postes" routerLinkActive="active">Postes</a></li>
        <li><a routerLink="/reservations" routerLinkActive="active">Réservations</a></li>
        <li><a routerLink="/snacks" routerLinkActive="active">Snacks</a></li>
        <li><a routerLink="/jeux" routerLinkActive="active">Jeux</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar { display: flex; align-items: center; background: #1a1a2e; padding: 0 24px; height: 60px; gap: 32px; }
    .brand { font-size: 1.2rem; font-weight: bold; color: #e94560; }
    ul { display: flex; list-style: none; gap: 16px; margin: 0; padding: 0; }
    a { color: #ccc; text-decoration: none; padding: 4px 10px; border-radius: 4px; }
    a:hover, a.active { color: white; background: #e94560; }
  `]
})
export class NavbarComponent {}

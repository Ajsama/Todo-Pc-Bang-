import { Component, input, output } from '@angular/core';
import { Client } from 'src/shared/client';

@Component({
  selector: 'app-client-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">
        <strong>{{ client().prenom }} {{ client().nom }}</strong>
        @if (client().abonnement) {
          <span class="badge">{{ client().abonnement!.type }}</span>
        }
      </div>
      <div class="card-body">
        <p>{{ client().email }}</p>
        <p>{{ client().telephone }}</p>
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" (click)="edit.emit(client().id_client)">Modifier</button>
        <button class="btn btn-danger" (click)="delete.emit(client().id_client)">Supprimer</button>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .badge { background: #e94560; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
    .card-body p { margin: 4px 0; color: #666; font-size: 0.9rem; }
    .card-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-danger { background: #dc3545; color: white; }
  `]
})
export class ClientCardComponent {
  client = input.required<Client>();
  edit = output<number>();
  delete = output<number>();
}

import { Component, input, output } from '@angular/core';
import { Client } from 'src/shared/client';

@Component({
  selector: 'app-client-card',
  standalone: true,
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css'
})
export class ClientCardComponent {
  client = input.required<Client>();
  edit = output<number>();
  delete = output<number>();
}

import { Injectable } from '@angular/core';
import { Client, ClientCreateDto, ClientUpdateDto } from 'src/shared/client';

@Injectable({ providedIn: 'root' })
export class ClientService {
  getClients(): Promise<Client[]> {
    return window.electronService.clients.getClients();
  }
  getClientById(id: number): Promise<Client | null> {
    return window.electronService.clients.getClientById(id);
  }
  addClient(dto: ClientCreateDto): Promise<Client> {
    return window.electronService.clients.addClient(dto);
  }
  updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return window.electronService.clients.updateClient(id, dto);
  }
  deleteClient(id: number): Promise<void> {
    return window.electronService.clients.deleteClient(id);
  }
}

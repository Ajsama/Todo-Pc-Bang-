import { Client, ClientCreateDto, ClientUpdateDto } from "../client";

export interface IClientService {
  getClients(): Promise<Client[]>;
  getClientById(id: number): Promise<Client | null>;
  addClient(client: ClientCreateDto): Promise<Client>;
  updateClient(id: number, client: ClientUpdateDto): Promise<Client>;
  deleteClient(id: number): Promise<void>;
}

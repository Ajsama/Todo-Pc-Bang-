import { PrismaClient } from "@prisma/client";
import { Client, ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export class ClientRepository {
  private db = new PrismaClient();

  async getClients(): Promise<Client[]> {
    return this.db.client.findMany({ include: { abonnement: true } });
  }

  async getClientById(id: number): Promise<Client | null> {
    return this.db.client.findUnique({ where: { id_client: id }, include: { abonnement: true } });
  }

  async addClient(dto: ClientCreateDto): Promise<Client> {
    return this.db.client.create({ data: dto, include: { abonnement: true } });
  }

  async updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return this.db.client.update({ where: { id_client: id }, data: dto, include: { abonnement: true } });
  }

  async deleteClient(id: number): Promise<void> {
    await this.db.client.delete({ where: { id_client: id } });
  }
}

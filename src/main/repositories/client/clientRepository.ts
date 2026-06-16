import { PrismaClient } from "@prisma/client";
import { Client, ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export class ClientRepository {
  private db = new PrismaClient();

  async getClients(): Promise<Client[]> {
    // SQL équivalent :
    // SELECT * FROM client
    // LEFT JOIN abonnement ON client.id_abonnement = abonnement.id_abonnement;
    return this.db.client.findMany({ include: { abonnement: true } });
  }

  async getClientById(id: number): Promise<Client | null> {
    return this.db.client.findUnique({ where: { id_client: id }, include: { abonnement: true } });
  }

  async addClient(dto: ClientCreateDto): Promise<Client> {
    // SQL équivalent : INSERT INTO client (...) VALUES (...);
    return this.db.client.create({ data: dto, include: { abonnement: true } });
  }

  async updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return this.db.client.update({ where: { id_client: id }, data: dto, include: { abonnement: true } });
  }

  async deleteClient(id: number): Promise<void> {
    await this.db.client.delete({ where: { id_client: id } });
  }
}

// =====================================================================
//  FLUX CLIENT — ÉTAPE 6/6 : LE REPOSITORY (la vraie requête à la base)
//  Couche : MAIN. Dernière étape : on parle à SQLite via Prisma (l'ORM).
//  Prisma TRADUIT ces appels JS en SQL (create=INSERT, findMany=SELECT,
//  update=UPDATE, delete=DELETE). include = jointure pour ramener l'objet lié.
//  La structure des tables est définie dans prisma/schema.prisma.
// =====================================================================
import { PrismaClient } from "@prisma/client";
import { Client, ClientCreateDto, ClientUpdateDto } from "src/shared/client";

export class ClientRepository {
  private db = new PrismaClient(); // le client Prisma = la connexion à la base

  // SELECT * FROM Client (+ l'abonnement lié de chaque client)
  async getClients(): Promise<Client[]> {
    return this.db.client.findMany({ include: { abonnement: true } });
  }

  // SELECT ... WHERE id_client = ? (un seul client)
  async getClientById(id: number): Promise<Client | null> {
    return this.db.client.findUnique({ where: { id_client: id }, include: { abonnement: true } });
  }

  // INSERT INTO Client (...) VALUES (...) — renvoie la ligne créée (avec son nouvel id).
  async addClient(dto: ClientCreateDto): Promise<Client> {
    return this.db.client.create({ data: dto, include: { abonnement: true } });
  }

  // UPDATE Client SET ... WHERE id_client = ?
  async updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return this.db.client.update({ where: { id_client: id }, data: dto, include: { abonnement: true } });
  }

  // DELETE FROM Client WHERE id_client = ?
  async deleteClient(id: number): Promise<void> {
    await this.db.client.delete({ where: { id_client: id } });
  }
}

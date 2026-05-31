import { PrismaClient } from "@prisma/client";
import { Jeu, JeuCreateDto, JeuUpdateDto } from "src/shared/jeu";

export class JeuRepository {
  private db = new PrismaClient();

  async getJeux(): Promise<Jeu[]> {
    return this.db.jeu.findMany({ orderBy: { titre: 'asc' } });
  }

  async addJeu(dto: JeuCreateDto): Promise<Jeu> {
    return this.db.jeu.create({ data: dto });
  }

  async updateJeu(id: number, dto: JeuUpdateDto): Promise<Jeu> {
    return this.db.jeu.update({ where: { id_jeu: id }, data: dto });
  }

  async deleteJeu(id: number): Promise<void> {
    await this.db.jeu.delete({ where: { id_jeu: id } });
  }
}

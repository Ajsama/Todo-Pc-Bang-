import { PrismaClient } from "@prisma/client";
import { Poste, PosteCreateDto, PosteUpdateDto } from "src/shared/poste";

export class PosteRepository {
  private db = new PrismaClient();

  async getPostes(): Promise<Poste[]> {
    return this.db.poste.findMany();
  }

  async addPoste(dto: PosteCreateDto): Promise<Poste> {
    return this.db.poste.create({ data: dto as any });
  }

  async updatePoste(id: number, dto: PosteUpdateDto): Promise<Poste> {
    return this.db.poste.update({ where: { id_poste: id }, data: dto as any });
  }

  async deletePoste(id: number): Promise<void> {
    await this.db.poste.delete({ where: { id_poste: id } });
  }
}

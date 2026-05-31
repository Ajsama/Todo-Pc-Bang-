import { PrismaClient } from "@prisma/client";
import { Snack, SnackCreateDto, SnackUpdateDto } from "src/shared/snack";

export class SnackRepository {
  private db = new PrismaClient();

  async getSnacks(): Promise<Snack[]> {
    return this.db.snack.findMany({
      include: { categorie: true },
      orderBy: { nom: 'asc' },
    });
  }

  async addSnack(dto: SnackCreateDto): Promise<Snack> {
    return this.db.snack.create({ data: dto, include: { categorie: true } });
  }

  async updateSnack(id: number, dto: SnackUpdateDto): Promise<Snack> {
    return this.db.snack.update({
      where: { id_snack: id },
      data: dto,
      include: { categorie: true },
    });
  }

  async deleteSnack(id: number): Promise<void> {
    await this.db.snack.delete({ where: { id_snack: id } });
  }
}

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

  private valider(dto: SnackCreateDto | SnackUpdateDto): void {
    if (dto.prix !== undefined && dto.prix < 0) {
      throw new Error('Le prix ne peut pas être négatif');
    }
    if (dto.stock !== undefined && dto.stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }
  }

  async addSnack(dto: SnackCreateDto): Promise<Snack> {
    this.valider(dto);
    return this.db.snack.create({ data: dto, include: { categorie: true } });
  }

  async updateSnack(id: number, dto: SnackUpdateDto): Promise<Snack> {
    this.valider(dto);
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

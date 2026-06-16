import { PrismaClient } from "@prisma/client";
import { Categorie } from "src/shared/categorie";

export class CategorieRepository {
  private db = new PrismaClient();

  async getCategories(): Promise<Categorie[]> {
    // SQL équivalent : SELECT * FROM categorie ORDER BY nom ASC;
    return this.db.categorie.findMany({ orderBy: { nom: 'asc' } });
  }
}

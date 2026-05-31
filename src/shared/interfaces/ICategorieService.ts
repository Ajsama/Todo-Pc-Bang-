import { Categorie } from "../categorie";

export interface ICategorieService {
  getCategories(): Promise<Categorie[]>;
}

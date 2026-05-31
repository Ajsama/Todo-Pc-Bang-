import { Poste, PosteCreateDto, PosteUpdateDto } from "../poste";

export interface IPosteService {
  getPostes(): Promise<Poste[]>;
  addPoste(poste: PosteCreateDto): Promise<Poste>;
  updatePoste(id: number, poste: PosteUpdateDto): Promise<Poste>;
  deletePoste(id: number): Promise<void>;
}

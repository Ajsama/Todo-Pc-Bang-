import { Jeu, JeuCreateDto, JeuUpdateDto } from "../jeu";

export interface IJeuService {
  getJeux(): Promise<Jeu[]>;
  addJeu(dto: JeuCreateDto): Promise<Jeu>;
  updateJeu(id: number, dto: JeuUpdateDto): Promise<Jeu>;
  deleteJeu(id: number): Promise<void>;
}

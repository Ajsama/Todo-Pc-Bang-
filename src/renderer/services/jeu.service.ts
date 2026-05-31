import { Injectable } from '@angular/core';
import { Jeu, JeuCreateDto, JeuUpdateDto } from 'src/shared/jeu';

@Injectable({ providedIn: 'root' })
export class JeuService {
  getJeux(): Promise<Jeu[]> {
    return window.electronService.jeux.getJeux();
  }
  addJeu(dto: JeuCreateDto): Promise<Jeu> {
    return window.electronService.jeux.addJeu(dto);
  }
  updateJeu(id: number, dto: JeuUpdateDto): Promise<Jeu> {
    return window.electronService.jeux.updateJeu(id, dto);
  }
  deleteJeu(id: number): Promise<void> {
    return window.electronService.jeux.deleteJeu(id);
  }
}

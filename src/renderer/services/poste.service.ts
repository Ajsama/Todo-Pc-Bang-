import { Injectable } from '@angular/core';
import { Poste, PosteCreateDto, PosteUpdateDto } from 'src/shared/poste';

@Injectable({ providedIn: 'root' })
export class PosteService {
  getPostes(): Promise<Poste[]> {
    return window.electronService.postes.getPostes();
  }
  addPoste(dto: PosteCreateDto): Promise<Poste> {
    return window.electronService.postes.addPoste(dto);
  }
  updatePoste(id: number, dto: PosteUpdateDto): Promise<Poste> {
    return window.electronService.postes.updatePoste(id, dto);
  }
  deletePoste(id: number): Promise<void> {
    return window.electronService.postes.deletePoste(id);
  }
}

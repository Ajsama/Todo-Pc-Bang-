import { Injectable } from '@angular/core';
import { Categorie } from 'src/shared/categorie';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  getCategories(): Promise<Categorie[]> {
    return window.electronService.categories.getCategories();
  }
}

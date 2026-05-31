import { Injectable } from '@angular/core';
import { Snack, SnackCreateDto, SnackUpdateDto } from 'src/shared/snack';

@Injectable({ providedIn: 'root' })
export class SnackService {
  getSnacks(): Promise<Snack[]> {
    return window.electronService.snacks.getSnacks();
  }
  addSnack(dto: SnackCreateDto): Promise<Snack> {
    return window.electronService.snacks.addSnack(dto);
  }
  updateSnack(id: number, dto: SnackUpdateDto): Promise<Snack> {
    return window.electronService.snacks.updateSnack(id, dto);
  }
  deleteSnack(id: number): Promise<void> {
    return window.electronService.snacks.deleteSnack(id);
  }
}

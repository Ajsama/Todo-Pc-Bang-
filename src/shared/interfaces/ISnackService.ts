import { Snack, SnackCreateDto, SnackUpdateDto } from "../snack";

export interface ISnackService {
  getSnacks(): Promise<Snack[]>;
  addSnack(dto: SnackCreateDto): Promise<Snack>;
  updateSnack(id: number, dto: SnackUpdateDto): Promise<Snack>;
  deleteSnack(id: number): Promise<void>;
}

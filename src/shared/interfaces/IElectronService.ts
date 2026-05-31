import { IClientService } from "./IClientService";
import { IPosteService } from "./IPosteService";
import { IReservationService } from "./IReservationService";
import { ICategorieService } from "./ICategorieService";
import { ISnackService } from "./ISnackService";
import { IJeuService } from "./IJeuService";
import { IDashboardService } from "./IDashboardService";

export default interface IElectronService {
  clients: IClientService;
  postes: IPosteService;
  reservations: IReservationService;
  categories: ICategorieService;
  snacks: ISnackService;
  jeux: IJeuService;
  dashboard: IDashboardService;
}

declare global {
  interface Window {
    electronService: IElectronService;
  }
}

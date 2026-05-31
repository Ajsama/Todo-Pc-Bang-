import { contextBridge } from "electron";
import { clientService } from "./clientService";
import { posteService } from "./posteService";
import { reservationService } from "./reservationService";
import { categorieService } from "./categorieService";
import { snackService } from "./snackService";
import { jeuService } from "./jeuService";
import { dashboardService } from "./dashboardService";

contextBridge.exposeInMainWorld("electronService", {
  clients: clientService(),
  postes: posteService(),
  reservations: reservationService(),
  categories: categorieService(),
  snacks: snackService(),
  jeux: jeuService(),
  dashboard: dashboardService()
});

// =====================================================================
//  FLUX CLIENT — ÉTAPE 4b/6 : LE BRANCHEMENT DU PONT
//  Couche : PRELOAD. S'exécute au démarrage de chaque fenêtre.
//  contextBridge.exposeInMainWorld("electronService", {...}) CRÉE l'objet
//  window.electronService utilisé par les services Angular (ÉTAPE 3).
//  C'est la façon SÉCURISÉE d'exposer des fonctions au front : le front
//  ne voit JAMAIS Node ni la base, seulement ces fonctions précises.
// =====================================================================
import { contextBridge } from "electron";
import { clientService } from "./clientService";
import { posteService } from "./posteService";
import { reservationService } from "./reservationService";
import { categorieService } from "./categorieService";
import { snackService } from "./snackService";
import { jeuService } from "./jeuService";
import { dashboardService } from "./dashboardService";

// Chaque clé ci-dessous devient window.electronService.XXX côté Angular.
// Ex : window.electronService.clients.addClient(...)
contextBridge.exposeInMainWorld("electronService", {
  clients: clientService(),
  postes: posteService(),
  reservations: reservationService(),
  categories: categorieService(),
  snacks: snackService(),
  jeux: jeuService(),
  dashboard: dashboardService()
});

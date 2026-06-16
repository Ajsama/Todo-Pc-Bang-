import { registerClientRepository } from "./repositories/client/registerClientRepository";
import { registerPosteRepository } from "./repositories/poste/registerPosteRepository";
import { registerReservationRepository } from "./repositories/reservation/registerReservationRepository";
import { registerCategorieRepository } from "./repositories/categorie/registerCategorieRepository";
import { registerSnackRepository } from "./repositories/snack/registerSnackRepository";
import { registerJeuRepository } from "./repositories/jeu/registerJeuRepository";
import { registerDashboardRepository } from "./repositories/dashboard/registerDashboardRepository";

export function registerRepositories() {
  registerClientRepository();
  registerPosteRepository();
  registerReservationRepository();
  registerCategorieRepository();
  registerSnackRepository();
  registerJeuRepository();
  registerDashboardRepository();
}

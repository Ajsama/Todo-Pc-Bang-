import { Client } from "./client";
import { Poste } from "./poste";

export interface Reservation {
  id_reservation: number;
  id_client: number | null;
  id_poste: number | null;
  date_debut: Date | string | null;
  duree: number | null;
  statut: string | null;
  client?: Client | null;
  poste?: Poste | null;
}

export type ReservationCreateDto = {
  id_client: number;
  id_poste: number;
  date_debut: Date;
  duree: number;
  statut: string;
};

export type ReservationUpdateDto = Partial<ReservationCreateDto>;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ordre de suppression important : on enlève d'abord les tables de jonction et les dépendances
  await prisma.reservationSnack.deleteMany();
  await prisma.posteJeu.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.snack.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.jeu.deleteMany();
  await prisma.client.deleteMany();
  await prisma.poste.deleteMany();
  await prisma.abonnement.deleteMany();

  // --- Abonnements ---
  const abo1 = await prisma.abonnement.create({ data: { type: 'Basique', prix: 10.0, duree: 30 } });
  const abo2 = await prisma.abonnement.create({ data: { type: 'Premium', prix: 25.0, duree: 30 } });
  const abo3 = await prisma.abonnement.create({ data: { type: 'VIP', prix: 50.0, duree: 30 } });

  // --- Clients ---
  const c1 = await prisma.client.create({ data: { nom: 'Dupont', prenom: 'Alice', email: 'alice@email.com', telephone: '0601020304', id_abonnement: abo2.id_abonnement } });
  const c2 = await prisma.client.create({ data: { nom: 'Martin', prenom: 'Bob', email: 'bob@email.com', telephone: '0605060708', id_abonnement: abo1.id_abonnement } });
  await prisma.client.create({ data: { nom: 'Lee', prenom: 'Charlie', email: 'charlie@email.com', telephone: '0609101112' } });
  const c4 = await prisma.client.create({ data: { nom: 'Chen', prenom: 'Diana', email: 'diana@email.com', telephone: '0613141516', id_abonnement: abo3.id_abonnement } });

  // --- Postes ---
  const p1 = await prisma.poste.create({ data: { numero_poste: 'P01', statut: 'Libre', type: 'Standard' } });
  const p2 = await prisma.poste.create({ data: { numero_poste: 'P02', statut: 'Libre', type: 'Premium' } });
  const p3 = await prisma.poste.create({ data: { numero_poste: 'P03', statut: 'Occupe', type: 'Standard' } });
  await prisma.poste.create({ data: { numero_poste: 'P04', statut: 'Libre', type: 'Premium' } });
  await prisma.poste.create({ data: { numero_poste: 'P05', statut: 'Maintenance', type: 'Standard' } });

  // --- Reservations ---
  const r1 = await prisma.reservation.create({ data: { id_client: c1.id_client, id_poste: p1.id_poste, date_debut: new Date('2026-05-22T14:00:00'), duree: 2, statut: 'EnCours' } });
  const r2 = await prisma.reservation.create({ data: { id_client: c2.id_client, id_poste: p3.id_poste, date_debut: new Date('2026-05-22T15:30:00'), duree: 4, statut: 'Confirmee' } });
  await prisma.reservation.create({ data: { id_client: c4.id_client, id_poste: p2.id_poste, date_debut: new Date('2026-05-23T10:00:00'), duree: 3, statut: 'EnAttente' } });

  // --- Categories de snacks ---
  const catBoisson = await prisma.categorie.create({ data: { nom: 'Boisson' } });
  const catSale = await prisma.categorie.create({ data: { nom: 'Snack salé' } });
  const catSucre = await prisma.categorie.create({ data: { nom: 'Snack sucré' } });

  // --- Snacks ---
  const s1 = await prisma.snack.create({ data: { nom: 'Coca-Cola', prix: 2.50, stock: 50, id_categorie: catBoisson.id_categorie } });
  const s2 = await prisma.snack.create({ data: { nom: 'Red Bull', prix: 3.00, stock: 30, id_categorie: catBoisson.id_categorie } });
  await prisma.snack.create({ data: { nom: 'Chips', prix: 1.50, stock: 40, id_categorie: catSale.id_categorie } });
  await prisma.snack.create({ data: { nom: 'KitKat', prix: 1.20, stock: 25, id_categorie: catSucre.id_categorie } });

  // --- Jeux ---
  const j1 = await prisma.jeu.create({ data: { titre: 'League of Legends', editeur: 'Riot Games', genre: 'MOBA', annee: 2009 } });
  const j2 = await prisma.jeu.create({ data: { titre: 'Counter-Strike 2', editeur: 'Valve', genre: 'FPS', annee: 2023 } });
  const j3 = await prisma.jeu.create({ data: { titre: 'Valorant', editeur: 'Riot Games', genre: 'FPS', annee: 2020 } });
  await prisma.jeu.create({ data: { titre: 'StarCraft II', editeur: 'Blizzard', genre: 'Stratégie', annee: 2010 } });

  // --- Consommations (N:M Reservation <-> Snack) ---
  await prisma.reservationSnack.create({ data: { id_reservation: r1.id_reservation, id_snack: s1.id_snack, quantite: 2, prix_unitaire: s1.prix } });
  await prisma.reservationSnack.create({ data: { id_reservation: r1.id_reservation, id_snack: s2.id_snack, quantite: 1, prix_unitaire: s2.prix } });
  await prisma.reservationSnack.create({ data: { id_reservation: r2.id_reservation, id_snack: s1.id_snack, quantite: 3, prix_unitaire: s1.prix } });

  // --- Jeux installés sur les postes (N:M Poste <-> Jeu) ---
  await prisma.posteJeu.create({ data: { id_poste: p1.id_poste, id_jeu: j1.id_jeu } });
  await prisma.posteJeu.create({ data: { id_poste: p1.id_poste, id_jeu: j2.id_jeu } });
  await prisma.posteJeu.create({ data: { id_poste: p2.id_poste, id_jeu: j1.id_jeu } });
  await prisma.posteJeu.create({ data: { id_poste: p2.id_poste, id_jeu: j3.id_jeu } });
  await prisma.posteJeu.create({ data: { id_poste: p3.id_poste, id_jeu: j2.id_jeu } });

  console.log('Seed terminé : 9 modèles peuplés.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

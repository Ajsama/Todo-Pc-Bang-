-- CreateTable
CREATE TABLE "Abonnement" (
    "id_abonnement" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "prix" REAL,
    "duree" INTEGER
);

-- CreateTable
CREATE TABLE "Client" (
    "id_client" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT,
    "prenom" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "id_abonnement" INTEGER,
    CONSTRAINT "Client_id_abonnement_fkey" FOREIGN KEY ("id_abonnement") REFERENCES "Abonnement" ("id_abonnement") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Poste" (
    "id_poste" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_poste" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'Libre',
    "type" TEXT
);

-- CreateTable
CREATE TABLE "Article" (
    "id_article" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_article" TEXT,
    "description" TEXT,
    "prix" REAL,
    "categorie" TEXT
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id_reservation" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_client" INTEGER,
    "id_poste" INTEGER,
    "date_debut" DATETIME,
    "duree" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'EnAttente',
    CONSTRAINT "Reservation_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client" ("id_client") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reservation_id_poste_fkey" FOREIGN KEY ("id_poste") REFERENCES "Poste" ("id_poste") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id_paiement" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_reservation" INTEGER,
    "montant" REAL,
    "mode_paiement" TEXT,
    "date_paiement" DATETIME,
    CONSTRAINT "Paiement_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "Reservation" ("id_reservation") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commande" (
    "id_commande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_reservation" INTEGER,
    "date_commande" DATETIME,
    "statut" TEXT,
    "total" REAL,
    CONSTRAINT "Commande_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "Reservation" ("id_reservation") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ligne_commande" (
    "id_commande" INTEGER NOT NULL,
    "id_article" INTEGER NOT NULL,
    "quantite" INTEGER,
    "prix_unitaire" REAL,

    PRIMARY KEY ("id_commande", "id_article"),
    CONSTRAINT "Ligne_commande_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "Commande" ("id_commande") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ligne_commande_id_article_fkey" FOREIGN KEY ("id_article") REFERENCES "Article" ("id_article") ON DELETE RESTRICT ON UPDATE CASCADE
);

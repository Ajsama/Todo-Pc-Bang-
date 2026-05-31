-- CreateTable
CREATE TABLE "Categorie" (
    "id_categorie" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Snack" (
    "id_snack" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "id_categorie" INTEGER,
    CONSTRAINT "Snack_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "Categorie" ("id_categorie") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jeu" (
    "id_jeu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "editeur" TEXT,
    "genre" TEXT,
    "annee" INTEGER
);

-- CreateTable
CREATE TABLE "ReservationSnack" (
    "id_reservation" INTEGER NOT NULL,
    "id_snack" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prix_unitaire" REAL NOT NULL,

    PRIMARY KEY ("id_reservation", "id_snack"),
    CONSTRAINT "ReservationSnack_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "Reservation" ("id_reservation") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReservationSnack_id_snack_fkey" FOREIGN KEY ("id_snack") REFERENCES "Snack" ("id_snack") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PosteJeu" (
    "id_poste" INTEGER NOT NULL,
    "id_jeu" INTEGER NOT NULL,

    PRIMARY KEY ("id_poste", "id_jeu"),
    CONSTRAINT "PosteJeu_id_poste_fkey" FOREIGN KEY ("id_poste") REFERENCES "Poste" ("id_poste") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PosteJeu_id_jeu_fkey" FOREIGN KEY ("id_jeu") REFERENCES "Jeu" ("id_jeu") ON DELETE CASCADE ON UPDATE CASCADE
);

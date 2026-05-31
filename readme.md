# PC Bang Manager

Application de gestion d'un cybercafé moderne (clients, postes, réservations, snacks, jeux).
Technologies : Electron + Angular 19 + Prisma + SQLite.

## Prérequis

- Node.js v18 ou plus
- npm v9 ou plus

> Les commandes ci-dessous sont **identiques sur Windows et macOS**
> (PowerShell, CMD ou Terminal). Le fichier `.env` fourni configure
> automatiquement la base de données, aucune manipulation manuelle n'est requise.

## Lancer le projet

### 1. Installer les dépendances

```bash
npm install
```

### 2. Préparer la base de données

```bash
npm run db:setup
```

Cette commande génère le client Prisma (recompilé pour votre système),
crée la base `dev.db` et la remplit avec des données de test.

### 3. Démarrer l'application

```bash
npm start
```

## Remarque (transfert entre machines)

Le client Prisma est compilé pour le système d'exploitation.
Si vous récupérez le projet depuis un ZIP créé sur une autre machine
(ex. macOS → Windows), exécutez simplement l'étape 2 (`npm run db:setup`) :
elle régénère le client Prisma pour votre système et reconstruit la base.

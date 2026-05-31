# PC Bang Manager

Application de gestion d'un cybercafé moderne (clients, postes, réservations, snacks, jeux).
Technologies : Electron + Angular 19 + Prisma + SQLite.

## Prérequis

- Node.js v18 ou plus
- npm v9 ou plus

## Lancer le projet

### 1. Installer les dépendances

```bash
npm install
```

### 2. Préparer la base de données

```bash
npm run db:setup
```

Cette commande génère le client Prisma, crée la base `dev.db` et la remplit avec des données de test.

### 3. Démarrer l'application

```bash
npm start
```

// =====================================================================
//  POINT D'ENTRÉE DU PROCESSUS MAIN (le "back" Electron)
//  Rôle : charger la config base (.env), créer la fenêtre, brancher le
//         preload, et appeler registerRepositories() pour allumer l'IPC.
// =====================================================================
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../database.env') });

if (!process.env['DATABASE_URL']) {
  const dbPath = path.join(__dirname, '..', '..', 'src', 'main', 'repositories', 'prisma', 'dev.db');
  process.env['DATABASE_URL'] = 'file:' + dbPath;
}

import { registerRepositories } from './registerRepositories';

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // On branche le PONT : ce fichier preload sera chargé dans la fenêtre
      // et exposera window.electronService au front (voir preload.ts).
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// On allume toutes les oreilles IPC du back (ÉTAPE 5 pour chaque entité).
registerRepositories();

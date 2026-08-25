const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

let pendingRelease = null;
let getWindow = () => null;

function canUpdate() {
  return process.platform === 'win32' && app.isPackaged;
}

function toPendingRelease(info) {
  return { version: info && info.version ? String(info.version) : '' };
}

function logUpdateError(err) {
  console.error('Aggiornamento:', err && err.message ? err.message : err);
}

function notifyRenderer(info) {
  pendingRelease = toPendingRelease(info);
  const win = getWindow();
  if (!win || win.isDestroyed()) {
    return;
  }
  win.webContents.send('wugis:update-ready', pendingRelease);
}

function startSilentUpdate(getMainWindow) {
  getWindow = getMainWindow;

  if (!canUpdate()) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;
  autoUpdater.verifyUpdateCodeSignature = false;

  autoUpdater.on('error', logUpdateError);
  autoUpdater.on('update-downloaded', notifyRenderer);

  autoUpdater.checkForUpdates().catch(logUpdateError);
}

function getPendingRelease() {
  return pendingRelease;
}

function installNow() {
  if (!canUpdate()) {
    return;
  }
  autoUpdater.quitAndInstall(true, true);
}

module.exports = {
  startSilentUpdate,
  getPendingRelease,
  installNow
};

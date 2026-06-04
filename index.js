const { app, BrowserWindow, ipcMain } = require('electron');
const { machineIdSync } = require('node-machine-id');
const configStore = require('./config-store');
const deviceState = require('./device-state');

function getMachineUuid() {
  return machineIdSync({ original: true });
}

function registerIpcHandlers() {
  ipcMain.handle('wugis:config-get', () => configStore.getConfig());

  ipcMain.handle('wugis:config-set', (_event, data) => {
    try {
      const config = configStore.setConfig(data || {});
      return { ok: true, config };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('wugis:config-clear', () => {
    configStore.clearConfig();
    return { ok: true };
  });

  ipcMain.handle('wugis:machine-uuid', () => {
    try {
      return getMachineUuid();
    } catch (err) {
      throw new Error(err.message || 'Impossibile leggere Machine ID');
    }
  });

  ipcMain.handle('wugis:device-state-get', () => deviceState.getDeviceState());

  ipcMain.handle('wugis:uuid-revealed-mark', () => {
    const state = deviceState.markUuidRevealed();
    return { ok: true, ...state };
  });

  ipcMain.handle('wugis:pending-plant-setup', () => {
    deviceState.setPendingPlantSetup();
    return { ok: true };
  });

  ipcMain.handle('wugis:should-show-uuid-step', () => ({
    show: deviceState.shouldShowUuidStep()
  }));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  console.log('app.whenReady');
  registerIpcHandlers();

  try {
    const machineId = getMachineUuid();
    console.log('Machine ID:', machineId);
  } catch (err) {
    console.error('Impossibile leggere Machine ID:', err.message);
  }

  createWindow();
});

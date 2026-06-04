const { app, BrowserWindow } = require('electron');
const { machineIdSync } = require('node-machine-id');

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
  try {
    const machineId = machineIdSync({ original: true });
    console.log('Machine ID:', machineId);
  } catch (err) {
    console.error('Impossibile leggere Machine ID:', err.message);
  }
  createWindow();
});
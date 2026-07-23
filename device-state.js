const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getStatePath() {
  return path.join(app.getPath('userData'), 'device-state.json');
}

function readStateFile() {
  const statePath = getStatePath();
  if (!fs.existsSync(statePath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function writeStateFile(data) {
  const statePath = getStatePath();
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(data, null, 2), 'utf8');
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;

function clampZoom(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(num * 10) / 10));
}

function getDeviceState() {
  const data = readStateFile();
  return {
    uuidRevealed: Boolean(data.uuidRevealed),
    pendingPlantSetup: Boolean(data.pendingPlantSetup),
    zoomFactor: clampZoom(data.zoomFactor == null ? 1 : data.zoomFactor)
  };
}

function getZoomFactor() {
  return getDeviceState().zoomFactor;
}

function setZoomFactor(value) {
  const data = readStateFile();
  const zoomFactor = clampZoom(value);
  writeStateFile({
    ...data,
    zoomFactor
  });
  return { zoomFactor };
}

function isUuidRevealed() {
  return getDeviceState().uuidRevealed;
}

function markUuidRevealed() {
  const data = readStateFile();
  writeStateFile({
    ...data,
    uuidRevealed: true,
    pendingPlantSetup: false
  });
  return getDeviceState();
}

/** Dopo "Cambia impianto": richiede di nuovo lo step UUID per il nuovo URL. */
function setPendingPlantSetup() {
  const data = readStateFile();
  writeStateFile({
    ...data,
    pendingPlantSetup: true
  });
  return getDeviceState();
}

function shouldShowUuidStep() {
  const { uuidRevealed, pendingPlantSetup } = getDeviceState();
  return !uuidRevealed || pendingPlantSetup;
}

module.exports = {
  getDeviceState,
  getZoomFactor,
  setZoomFactor,
  isUuidRevealed,
  markUuidRevealed,
  setPendingPlantSetup,
  shouldShowUuidStep
};

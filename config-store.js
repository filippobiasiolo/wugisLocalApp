const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getConfigPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function normalizeBaseUrl(input) {
  const trimmed = String(input).trim();
  if (!trimmed) {
    throw new Error('URL obbligatorio');
  }

  let withScheme = trimmed;
  if (!/^https?:\/\//i.test(withScheme)) {
    withScheme = `https://${withScheme}`;
  }

  const url = new URL(withScheme);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('URL deve usare http o https');
  }
  if (!url.hostname) {
    throw new Error('URL non valido');
  }

  let result = url.origin;
  if (url.pathname && url.pathname !== '/') {
    result += url.pathname.replace(/\/$/, '') || url.pathname;
  }

  return result;
}

function getConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data.baseUrl !== 'string' || !data.baseUrl.trim()) {
      return null;
    }
    return { baseUrl: data.baseUrl.trim() };
  } catch {
    return null;
  }
}

function setConfig({ baseUrl }) {
  const normalized = normalizeBaseUrl(baseUrl);
  const configPath = getConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(
    configPath,
    JSON.stringify({ baseUrl: normalized }, null, 2),
    'utf8'
  );
  return { baseUrl: normalized };
}

/** Rimuove solo config.json (baseUrl). Non tocca device-state.json (uuidRevealed). */
function clearConfig() {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}

module.exports = {
  normalizeBaseUrl,
  getConfig,
  setConfig,
  clearConfig
};

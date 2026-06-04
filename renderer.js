const TabGroup = require('electron-tabs');

const START_URL = 'https://riam.wugis.com';

// Inizializza il gruppo di tab
const tabGroup = new TabGroup({
  newTab: {
    title: 'Nuova scheda',
    src: START_URL,
    visible: true,
    active: true,
    webviewAttributes: {
      allowpopups: 'true'
    }
  }
});

// Primo tab (gestionle principale)
const mainTab = tabGroup.addTab({
  title: 'Gestionale',
  src: START_URL,
  visible: true,
  active: true,
  webviewAttributes: {
    allowpopups: 'true'
  },
  ready: (tab) => {
    const webview = tab.webview;

    // Intercetta link target="_blank" / window.open
    webview.addEventListener('new-window', (e) => {
      e.preventDefault();

      tabGroup.addTab({
        title: 'Nuova scheda',
        src: e.url,
        visible: true,
        active: true,
        webviewAttributes: {
          allowpopups: 'true'
        }
      });
    });
  }
});


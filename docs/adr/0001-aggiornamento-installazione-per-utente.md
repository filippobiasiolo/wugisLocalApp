# Aggiornamento via GitHub Releases e Installazione per-utente

Wugis Local App deve aggiornarsi senza privilegi di amministratore e senza usare il server Wugis dell’impianto. L’artefatto è un installer NSIS per-utente (non un portable: `electron-updater` non sostituisce un exe spostabile) e il Feed dei Rilasci è GitHub Releases pubblico (gratis, niente token sulle macchine). Niente firma Authenticode in v1.

## Considered Options

- Portable + scarica-e-sostituisci fatto in casa — scartato: due meccanismi, niente `electron-updater`.
- Feed sul `baseUrl` dell’impianto — scartato: duplica l’exe su ogni cliente.
- Repo GitHub privato — scartato: servirebbe un token su ogni PC.

## Consequences

Se GitHub non è raggiungibile non c’è Aggiornamento e l’app resta usabile. Il primo download da GitHub può prendere SmartScreen; si valuta la firma dopo.

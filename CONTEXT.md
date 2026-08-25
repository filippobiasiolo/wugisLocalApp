# Wugis Local App

Wrapper desktop di Wugis sul PC di un impianto: identifica il dispositivo e apre l’istanza web configurata.

## Language

**Installazione per-utente**:
Copia di Wugis Local App sul PC dell’impianto, senza privilegi di amministratore. Per ora solo Windows x64.
_Avoid_: Portable, Program Files, setup con admin, Mac

**Rilascio**:
Una versione pubblicata di Wugis Local App disponibile a sostituire un’Installazione per-utente.
_Avoid_: Build, pacchetto, exe

**Aggiornamento**:
Sostituzione in-place dell’Installazione per-utente con un Rilascio più recente, senza privilegi di amministratore.
_Avoid_: Reinstallazione, download di un nuovo exe da copiare a mano

**Aggiornamento silenzioso**:
Controllo e scarico del Rilascio senza azione dell’utente; l’applicazione richiede un riavvio confermato. Se il Feed dei Rilasci non è raggiungibile, non c’è Aggiornamento e l’Installazione per-utente resta usabile.
_Avoid_: Aggiornamento su richiesta, Aggiornamento forzato, blocco dell’app per mancato Aggiornamento

**Prompt di riavvio**:
Unica interazione dell’Aggiornamento silenzioso: chiede di riavviare per applicare un Rilascio già scaricato. Se viene chiuso, l’app resta usabile e il prompt torna al prossimo avvio. L’app non si riavvia da sola mentre è in uso. Se l’utente chiude l’app, l’Aggiornamento già scaricato si applica in uscita.
_Avoid_: Riavvio automatico mentre è in uso, notifica una tantum

**Feed dei Rilasci**:
Sorgente unica e globale da cui ogni Installazione per-utente ottiene un Rilascio più recente.
_Avoid_: baseUrl, server Wugis dell’impianto, feed per cliente

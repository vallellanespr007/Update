// Sentry: reporte de errores del website (https://update-group.sentry.io).
// El SDK (@sentry/browser 11.6.0) se carga desde el CDN de Sentry en index.html y services.html.
// El DSN es la dirección del proyecto en Sentry → Settings → Projects → website → Client Keys (DSN).
(function () {
  if (!window.Sentry || !Sentry.init) return;
  Sentry.init({
    dsn: 'https://56d97da5a41321754cedc07d8b0b85aa@o4512319788810240.ingest.us.sentry.io/4512319852249088',
    environment: /(^|\.)updategrouppr\.com$/.test(location.hostname) ? 'production' : 'development',
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2, // mide la velocidad en 1 de cada 5 visitas
    sendDefaultPii: false  // no manda IPs ni datos personales
  });
  // Prueba: abrir el website con ?prueba-sentry al final del link manda un error de prueba a Sentry.
  if (/[?&]prueba-sentry(=|&|$)/.test(location.search)) {
    Sentry.captureException(new Error('Prueba Sentry desde el website'));
  }
})();

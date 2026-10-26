// Sentry: reporte de errores del website (https://update-group.sentry.io).
// Para activarlo, pega el DSN del proyecto: Sentry → Settings → Projects → (proyecto) → Client Keys (DSN).
// Mientras DSN esté vacío no se envía nada.
(function () {
  var DSN = '';
  if (!DSN || !window.Sentry) return;
  Sentry.init({
    dsn: DSN,
    environment: /(^|\.)updategrouppr\.com$/.test(location.hostname) ? 'production' : 'development',
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2, // mide la velocidad en 1 de cada 5 visitas
    sendDefaultPii: false  // no manda IPs ni datos personales
  });
})();

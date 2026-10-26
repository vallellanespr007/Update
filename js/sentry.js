// Sentry: reporte de errores del website (https://update-group.sentry.io).
// La clave del proyecto va en el "Loader Script" de Sentry que cargan index.html y services.html.
// Qué mide (errores, velocidad, replays) se cambia en Sentry → Settings → Projects → (proyecto) → Loader Script.
(function () {
  if (!window.Sentry || !Sentry.onLoad) return;
  Sentry.onLoad(function () {
    Sentry.init({
      environment: /(^|\.)updategrouppr\.com$/.test(location.hostname) ? 'production' : 'development',
      sendDefaultPii: false // no manda IPs ni datos personales
    });
  });
})();

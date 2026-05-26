(function () {
  if (window.__mbsTrainersWidgetLoaderReady) return;
  window.__mbsTrainersWidgetLoaderReady = true;

  var DEFAULT_WIDGET_URL = 'https://api.barista-school.ru/api/trainers-widget.html';

  function cacheBustedUrl(value) {
    var url = new URL(value || DEFAULT_WIDGET_URL, window.location.href);
    url.searchParams.set('_', String(Date.now()));
    return url.toString();
  }

  function runScript(script) {
    return new Promise(function (resolve, reject) {
      var next = document.createElement('script');
      Array.prototype.forEach.call(script.attributes, function (attr) {
        if (attr.name !== 'src') next.setAttribute(attr.name, attr.value);
      });

      if (script.src) {
        next.src = script.src;
        next.async = false;
        next.onload = resolve;
        next.onerror = reject;
        document.head.appendChild(next);
        return;
      }

      next.text = script.textContent || '';
      document.head.appendChild(next);
      resolve();
    });
  }

  function executeScripts(scripts) {
    return scripts.reduce(function (chain, script) {
      return chain.then(function () { return runScript(script); });
    }, Promise.resolve());
  }

  function mount(container) {
    if (!container || container.getAttribute('data-mbs-trainers-loaded') === 'true') return;
    container.setAttribute('data-mbs-trainers-loaded', 'true');

    var widgetUrl = container.getAttribute('data-widget-url') || DEFAULT_WIDGET_URL;

    fetch(cacheBustedUrl(widgetUrl), { cache: 'no-store' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.text();
      })
      .then(function (html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        var scripts = Array.prototype.slice.call(template.content.querySelectorAll('script'));
        scripts.forEach(function (script) { script.parentNode.removeChild(script); });
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        return executeScripts(scripts);
      })
      .catch(function () {
        container.innerHTML = '<div style="font-family:Mulish,sans-serif;padding:32px 20px;text-align:center;color:#555;font-size:15px;font-weight:700;">Не удалось загрузить блок тренеров. Попробуйте обновить страницу позже.</div>';
      });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-mbs-trainers-widget]'), mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

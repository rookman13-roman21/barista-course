/*
  theory.js
  Московская школа бариста — теоретическая подготовка

  Минимальный JS для страницы-навигатора.
  Подключается только при локальной разработке.
  В Tilda вставлять НЕ нужно — там JS не требуется.
*/

/* Плавный скролл к якорю #learning-path */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href').slice(1);
    var target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

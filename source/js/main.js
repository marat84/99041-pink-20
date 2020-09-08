// Работа с главным меню на мобильном разрешении
(function () {
  let menuButton = document.querySelector('.js-mobile-menu');

  if (menuButton && window.matchMedia('(max-width: 1200px)').matches) {
    let
      menuButtonCloseText = menuButton.dataset.altText,
      menuButtonOpenText = menuButton.getAttribute('aria-label');

    menuButton.addEventListener('click', function (evt) {
      evt.preventDefault();

      document.body.classList.toggle('menu-open');

      if (document.querySelector('.menu-open')) {
        menuButton.setAttribute('aria-label', menuButtonCloseText);
      } else {
        menuButton.setAttribute('aria-label', menuButtonOpenText);
      }
    })
  }
})();

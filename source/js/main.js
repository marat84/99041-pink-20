// Работа с главным меню на мобильном разрешении
(function () {
  let menuButton = document.querySelector('.js-mobile-menu');

  if (menuButton) {
    let
      menuButtonCloseText = menuButton.dataset.altText,
      menuButtonOpenText = menuButton.getAttribute('aria-label'),
      menuIconClose = menuButton.querySelector('.js-mobile-menu-close'),
      menuIconOpen = menuButton.querySelector('.js-mobile-menu-open');

    if (document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');

      menuIconOpen.style.display = 'block';
    }

    let closeMenu = function () {;
      menuIconOpen.style.display = 'block';
      menuIconClose.style.display = 'none';

      menuButton.removeEventListener('click', closeMenu);
    };

    menuButton.addEventListener('click', function (evt) {
      evt.preventDefault();

      document.body.classList.toggle('menu-open');

      menuIconOpen.style.display = 'none';
      menuIconClose.style.display = 'block';

      if (document.querySelector('.menu-open')) {
        menuButton.setAttribute('aria-label', menuButtonCloseText);
      } else {
        menuButton.setAttribute('aria-label', menuButtonOpenText);
      }

      menuButton.addEventListener('click', closeMenu);
    })
  }
})();

// Работа c модальными окнами
(function () {
  let
    formButton = document.querySelector('.js-form-button'),
    modalClose = document.querySelectorAll('.js-modal-close');

  if (formButton) {

    let modalCloseClickHandler = function (evt) {
      evt.preventDefault();

      let
        target = evt.target,
        modalID = target.dataset.modal,
        currentModal = document.querySelector(modalID);

      currentModal.classList.remove('modal-show');

      target.removeEventListener('click', modalCloseClickHandler);
    };

    formButton.addEventListener('click', function () {
      let modal = document.querySelectorAll('.js-modal');

      modal.forEach(function (current) {
        current.classList.add('modal-show');
      });

      modalClose.forEach(function (current) {
        current.addEventListener('click', modalCloseClickHandler)
      });
    });
  }
})();

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var navigation = document.getElementById('site-navigation');

  if (!toggle || !navigation) return;

  function closeNavigation() {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeNavigation();
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', closeNavigation);
})();

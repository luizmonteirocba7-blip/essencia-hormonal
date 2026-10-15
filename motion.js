(function () {
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionPreference.matches;
  var waveArt = document.querySelector('.hero-waves');
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('#primary-nav');

  function syncWaveMotion() {
    if (!waveArt || typeof waveArt.pauseAnimations !== 'function') return;
    if (motionPreference.matches) waveArt.pauseAnimations();
    else waveArt.unpauseAnimations();
  }

  syncWaveMotion();
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', syncWaveMotion);
  else if (motionPreference.addListener) motionPreference.addListener(syncWaveMotion);

  function closeMenu() {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('is-open');
  }

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      menu.classList.toggle('is-open', !isOpen);
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  document.querySelectorAll('.video-cover').forEach(function (cover) {
    cover.addEventListener('click', function () {
      var video = cover.parentElement.querySelector('video');
      if (!video) return;
      cover.hidden = true;
      var playback = video.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(function () {
          cover.hidden = false;
        });
      }
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) return;
  var revealTargets = document.querySelectorAll('.reveal');
  if (!revealTargets.length) return;
  document.documentElement.classList.add('motion-ready');

  var observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  revealTargets.forEach(function (element) {
    var siblings = Array.prototype.filter.call(element.parentElement.children, function (sibling) {
      return sibling.classList.contains('reveal');
    });
    element.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(element), 3) * 75 + 'ms');
    observer.observe(element);
  });
}());

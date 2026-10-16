(function () {
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionPreference.matches;
  var heroVideo = document.querySelector('.hero-background-video');
  var heroVisual = document.querySelector('.hero-visual');
  var mobileCta = document.querySelector('.mobile-cta');
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('#primary-nav');

  window.addEventListener('pageshow', function (event) {
    var navigation = performance.getEntriesByType('navigation')[0];
    if (event.persisted || window.location.hash || (navigation && navigation.type === 'back_forward')) return;
    window.scrollTo(0, 0);
  });

  function syncHeroVideo() {
    if (!heroVideo) return;
    if (motionPreference.matches || document.hidden) {
      heroVideo.pause();
      return;
    }
    var playback = heroVideo.play();
    if (playback && typeof playback.catch === 'function') playback.catch(function () {});
  }

  syncHeroVideo();
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', syncHeroVideo);
  else if (motionPreference.addListener) motionPreference.addListener(syncHeroVideo);
  document.addEventListener('visibilitychange', syncHeroVideo);

  function syncMobileCta() {
    if (!mobileCta || !heroVisual) return;
    if (!window.matchMedia('(max-width: 760px)').matches) {
      mobileCta.classList.remove('is-hidden');
      return;
    }
    var visualBounds = heroVisual.getBoundingClientRect();
    var ctaBounds = mobileCta.getBoundingClientRect();
    var overlapsPortrait = visualBounds.top < window.innerHeight && visualBounds.bottom > ctaBounds.top;
    mobileCta.classList.toggle('is-hidden', overlapsPortrait);
  }

  syncMobileCta();
  window.addEventListener('scroll', syncMobileCta, { passive: true });
  window.addEventListener('resize', syncMobileCta);

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

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.recognition-head, .signal, .section-head, .care-card, .after-card, .stories-head, .video-card, .doctors-head, .doctor, .final-inner, .footer-grid'
  );
  if (!targets.length) return;

  document.documentElement.classList.add('motion-ready');
  var observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -28px 0px' });

  targets.forEach(function (element) {
    element.classList.add('reveal');
    if (element.matches('.signal, .care-card, .after-card, .video-card, .doctor')) {
      var siblings = Array.prototype.filter.call(element.parentElement.children, function (sibling) {
        return sibling.matches('.signal, .care-card, .after-card, .video-card, .doctor');
      });
      element.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(element), 3) * 85 + 'ms');
    }
    observer.observe(element);
  });
}());
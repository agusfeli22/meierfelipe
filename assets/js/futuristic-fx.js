/* Interactive polish: cursor glow trail, profile tilt parallax, scroll-in glow */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  if (!reduceMotion && !isTouch) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var gx = mx, gy = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    (function animate() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      requestAnimationFrame(animate);
    })();

    var profile = document.querySelector('#header .profile img');
    if (profile) {
      window.addEventListener('mousemove', function (e) {
        var relX = (e.clientX / window.innerWidth) - 0.5;
        var relY = (e.clientY / window.innerHeight) - 0.5;
        profile.style.transform = 'rotateY(' + (relX * 14) + 'deg) rotateX(' + (-relY * 14) + 'deg)';
      });
    }
  }

  if ('IntersectionObserver' in window) {
    var titles = document.querySelectorAll('.section-title h2');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.4 });
    titles.forEach(function (t) { obs.observe(t); });
  }
})();

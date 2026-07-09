/* Animated space background: drifting nebula blobs + interactive particle constellation */
(function () {
  var nebula = document.createElement('div');
  nebula.className = 'bg-nebula';
  nebula.innerHTML = '<span></span><span></span><span></span>';
  document.body.prepend(nebula);

  var canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');

  var width, height, particles;
  var LINK_DIST = 130;
  var MOUSE_RADIUS = 160;
  var mouse = { x: null, y: null };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function particleCount() {
    return Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 13000));
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    var count = particleCount();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x += (dx / dist) * force * 1.4;
          p.y += (dy / dist) * force * 1.4;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(130, 214, 255, 0.9)';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(56, 189, 255, 0.9)';
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var pa = particles[a], pb = particles[b];
        var ddx = pa.x - pb.x, ddy = pa.y - pb.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = 'rgba(90, 190, 255,' + (1 - d / LINK_DIST) * 0.5 + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', function () {
    resize();
    createParticles();
  });
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });
  window.addEventListener('touchmove', function (e) {
    if (e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  resize();
  createParticles();
  if (!reduceMotion) {
    step();
  } else {
    // Draw a single static frame for reduced-motion users
    step = function () {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(130, 214, 255, 0.9)';
        ctx.fill();
      }
    };
    step();
  }
})();

/* Background music: a welcome modal asks for consent (required for audio
   to actually start, since browsers block autoplay with sound), and a
   floating button keeps giving control afterwards. */
(function () {
  var audio = document.getElementById('bg-music');
  var btn = document.getElementById('music-toggle');
  var modal = document.getElementById('music-modal');
  var yesBtn = document.getElementById('music-yes');
  var noBtn = document.getElementById('music-no');
  if (!audio || !btn) return;

  audio.volume = 0.35;
  var STORAGE_KEY = 'fm-music-choice-made';

  function setPlayingState(isPlaying) {
    btn.classList.toggle('is-playing', isPlaying);
    btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    btn.setAttribute('aria-label', isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo');
    btn.innerHTML = isPlaying ? '<i class="bx bx-pause"></i>' : '<i class="bx bx-music"></i>';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-visible');
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-visible');
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', function () { setPlayingState(true); });
  audio.addEventListener('pause', function () { setPlayingState(false); });

  if (yesBtn) {
    yesBtn.addEventListener('click', function () {
      audio.play().catch(function () {});
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      closeModal();
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      audio.play().catch(function () {});

      var titleEl = modal ? modal.querySelector('#music-modal-title') : null;
      var textEl = modal ? modal.querySelector('p') : null;
      var actionsEl = modal ? modal.querySelector('.music-modal-actions') : null;
      if (titleEl) titleEl.textContent = 'Pusiste que no, evidentemente te confundiste';
      if (textEl) textEl.textContent = 'Así que voy a poner el temaso igual.';
      if (actionsEl) actionsEl.style.display = 'none';

      window.setTimeout(closeModal, 2200);
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  var alreadyAnswered = false;
  try { alreadyAnswered = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}

  if (!alreadyAnswered) {
    window.setTimeout(openModal, 600);
  }
})();

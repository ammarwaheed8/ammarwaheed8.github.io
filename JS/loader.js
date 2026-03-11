/* ===== AW LOADER ===== */

(function () {
  const LOADER_DURATION = 3000; // Total loader display time in ms
  const FILL_DURATION   = 2500; // How long the bar takes to reach 100%
  const SLIDE_DELAY     = 200;  // Small pause at 100% before slide-up

  const loader = document.getElementById('aw-loader');
  const fill   = document.getElementById('loader-bar-fill');
  const label  = document.getElementById('loader-bar-label');

  if (!loader || !fill || !label) return;

  /* ── Smooth easing for the progress bar ── */
  function easeInOutQuart(t) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  let startTime = null;
  let rafId     = null;

  function animateBar(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed  = timestamp - startTime;
    const rawT     = Math.min(elapsed / FILL_DURATION, 1);
    const easedT   = easeInOutQuart(rawT);
    const percent  = Math.round(easedT * 100);

    fill.style.width  = percent + '%';
    label.textContent = percent + '%';

    if (percent >= 100) {
      label.classList.add('complete');
      cancelAnimationFrame(rafId);
      rafId = null;
      dismissLoader();
      return;
    }

    rafId = requestAnimationFrame(animateBar);
  }

  function dismissLoader() {
    setTimeout(() => {
      /* Slide the loader up */
      loader.classList.add('slide-up');

      /* When loader finishes sliding, clean up and signal content to appear */
      loader.addEventListener('transitionend', () => {
        loader.remove();
        document.body.style.overflow = '';
        window.dispatchEvent(new Event('loaderDone'));
      }, { once: true });
    }, SLIDE_DELAY);
  }

  /* ── Kick off once fonts / DOM are ready ── */
  document.addEventListener('DOMContentLoaded', () => {
    /* Prevent scrolling while loader is visible */
    document.body.style.overflow = 'hidden';

    /* Start the bar animation */
    rafId = requestAnimationFrame(animateBar);

    /* Hard cap: dismiss loader even if rAF is still running */
    setTimeout(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        fill.style.width  = '100%';
        label.textContent = '100%';
        label.classList.add('complete');
        dismissLoader();
      }
    }, LOADER_DURATION);
  });
})();


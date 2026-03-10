// Cursor glow
    const glow = document.getElementById('cursorGlow');
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let gx = mx, gy = my;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animate() {
      gx += (mx - gx) * 0.06;
      gy += (my - gy) * 0.06;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
      requestAnimationFrame(animate);
    })();
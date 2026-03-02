(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('loader');
  const revealEls = [...document.querySelectorAll('.reveal')];
  const magnetEls = [...document.querySelectorAll('.magnetic')];
  const tiltEls = [...document.querySelectorAll('.tilt')];

  setTimeout(() => loader?.classList.add('hide'), reduce ? 350 : 2400);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => observer.observe(el));

  if (!reduce) {
    let raf = 0;
    window.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
        document.documentElement.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
        raf = 0;
      });
    }, { passive: true });

    magnetEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.18;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });

    tiltEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; });
    });
  }
})();

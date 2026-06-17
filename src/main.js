/* ============================================================
   ALLURÉ — DOSSIÊ ALLURÉ
   Entrance choreography · scrubbed manifesto · reveals · cursor
   ============================================================ */
import './main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- helpers ---------- */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  [...text].forEach((ch) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = ch;
    el.appendChild(span);
  });
  return el.querySelectorAll('.char');
}

function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="word" aria-hidden="true">${w}</span>`)
    .join(' ');
  return el.querySelectorAll('.word');
}

/* ============================================================
   REDUCED MOTION — everything visible, no choreography
   ============================================================ */
if (reduceMotion) {
  document.querySelector('.loader')?.remove();
} else {
  /* ----------------------------------------------------------
     LOADER + HERO ENTRANCE (one continuous sequence)
     ---------------------------------------------------------- */
  const loader = document.querySelector('.loader');
  const chars = splitChars(loader.querySelector('.loader-word'));

  // initial states (JS-only, so no-JS users see full content)
  gsap.set('.hero-title .line-inner', { yPercent: 115 });
  gsap.set('.hero-photo', { autoAlpha: 0, scale: 1.18 });
  gsap.set(['.hero-aside', '.hero-foot'], { autoAlpha: 0, y: 24 });
  gsap.set('.site-header', { yPercent: -120 });

  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

  intro
    .from(chars, { yPercent: 120, duration: 0.9, stagger: 0.045, ease: 'power4.out' })
    .from('.loader-sub', { autoAlpha: 0, letterSpacing: '1em', duration: 0.7 }, '-=0.45')
    .to(loader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.35,
      onComplete: () => loader.remove(),
    })
    // hero build-up overlapping the curtain lift: photo reveals first
    // (it is the backdrop), then the title rises, then copy + CTA settle
    .to('.hero-photo', { autoAlpha: 1, scale: 1.05, duration: 1.7, ease: 'power3.out' }, '-=0.7')
    .to('.hero-title .line-inner', { yPercent: 0, duration: 1.2, stagger: 0.14 }, '<0.3')
    .to(['.hero-aside', '.hero-foot'], {
      autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12,
    }, '-=0.75')
    .to('.site-header', { yPercent: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7');

  /* ----------------------------------------------------------
     HERO — cursor parallax (subtle photo drift)
     The photo rests at scale 1.05 so this small translate never
     exposes an edge inside the overflow-clipped media frame.
     ---------------------------------------------------------- */
  if (finePointer) {
    const hero = document.querySelector('.hero');
    const photoX = gsap.quickTo('.hero-photo', 'x', { duration: 1.4, ease: 'power3.out' });
    const photoY = gsap.quickTo('.hero-photo', 'y', { duration: 1.4, ease: 'power3.out' });

    hero.addEventListener('mousemove', (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      photoX(dx * -22);
      photoY(dy * -16);
    });
  }

  /* ----------------------------------------------------------
     MANIFESTO — pinned scrub: words ignite, page morphs to cream
     ---------------------------------------------------------- */
  const manifesto = document.querySelector('.manifesto');
  const words = splitWords(manifesto.querySelector('.manifesto-line'));

  gsap.set(words, { opacity: 0.14 });

  // The pin distance below is what gates the rest of the page: the section
  // stays pinned until the user scrolls past `end`. The whole choreography is
  // scrubbed, so shortening `end` keeps every beat (words igniting → cream
  // morph) intact but proportionally compressed — it simply releases the next
  // section sooner with far less scroll effort. Mobile gets an even more
  // direct release and a snappier scrub.
  const manifestoMM = gsap.matchMedia();

  manifestoMM.add(
    { isMobile: '(max-width: 768px)', isDesktop: '(min-width: 769px)' },
    (ctx) => {
      const { isMobile } = ctx.conditions;
      const end = isMobile ? '+=80%' : '+=95%';
      const scrub = isMobile ? 0.4 : 0.5;

      gsap.timeline({
        scrollTrigger: {
          trigger: manifesto,
          start: 'top top',
          end,
          scrub,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to(words, { opacity: 1, stagger: 0.5, duration: 2, ease: 'none' }, 0)
        .to(manifesto, { backgroundColor: '#F4EACF', color: '#222323', duration: 3, ease: 'power1.inOut' }, 2.5);
    },
  );

  /* ----------------------------------------------------------
     ESSÊNCIA — masked portrait entrance
     ---------------------------------------------------------- */
  const essenciaTrigger = { trigger: '.essencia-figure', start: 'top 82%', once: true };

  gsap.fromTo('.essencia-mask',
    { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: essenciaTrigger });
  gsap.fromTo('.essencia-mask img',
    { scale: 1.28 },
    { scale: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: essenciaTrigger });
  gsap.fromTo(['.essencia-caption', '.essencia-star'],
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 0.5, ease: 'power3.out', scrollTrigger: essenciaTrigger });

  /* ----------------------------------------------------------
     DEPOIMENTOS — draggable editorial slider
     ---------------------------------------------------------- */
  const viewport = document.getElementById('depo-viewport');
  const track = document.getElementById('depo-track');
  const slides = gsap.utils.toArray('.depo-slide');
  const prevBtn = document.getElementById('depo-prev');
  const nextBtn = document.getElementById('depo-next');
  const counterEl = document.getElementById('depo-current');

  let depoIndex = 0;
  const xSetter = gsap.quickSetter(track, 'x', 'px');

  const targetX = (i) =>
    -slides[i].offsetLeft + (viewport.clientWidth - slides[i].offsetWidth) / 2;

  function renderDepo(animate = true) {
    gsap.to(track, {
      x: targetX(depoIndex),
      duration: animate ? 0.85 : 0,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    slides.forEach((slide, i) => {
      gsap.to(slide, { opacity: i === depoIndex ? 1 : 0.35, duration: 0.5, overwrite: 'auto' });
    });
    counterEl.textContent = String(depoIndex + 1).padStart(2, '0');
    prevBtn.disabled = depoIndex === 0;
    nextBtn.disabled = depoIndex === slides.length - 1;
  }

  const goTo = (i) => {
    depoIndex = gsap.utils.clamp(0, slides.length - 1, i);
    renderDepo();
  };

  prevBtn.addEventListener('click', () => goTo(depoIndex - 1));
  nextBtn.addEventListener('click', () => goTo(depoIndex + 1));

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(depoIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(depoIndex + 1); }
  });

  // drag / swipe
  let dragStartX = 0;
  let dragBaseX = 0;
  let dragging = false;

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    dragStartX = e.clientX;
    dragBaseX = gsap.getProperty(track, 'x');
    gsap.killTweensOf(track);
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const delta = e.clientX - dragStartX;
    const min = targetX(slides.length - 1);
    const max = targetX(0);
    let next = dragBaseX + delta;
    if (next > max) next = max + (next - max) * 0.25; // edge resistance
    if (next < min) next = min + (next - min) * 0.25;
    xSetter(next);
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.clientX - dragStartX;
    if (delta < -60) goTo(depoIndex + 1);
    else if (delta > 60) goTo(depoIndex - 1);
    else renderDepo();
  };

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => renderDepo(false));
  renderDepo(false);

  /* ----------------------------------------------------------
     INDICAÇÃO — R$ 200 figure ignition
     ---------------------------------------------------------- */
  gsap.fromTo('.indicacao-value',
    { clipPath: 'inset(0% 100% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '.indicacao-value', start: 'top 80%', once: true },
    });

  /* ----------------------------------------------------------
     SCROLL REVEALS
     ---------------------------------------------------------- */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 48 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
  });

  /* ----------------------------------------------------------
     FOOTER — giant word rises with scroll
     ---------------------------------------------------------- */
  gsap.fromTo('.footer-word span',
    { yPercent: 45 },
    {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer-word',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.8,
      },
    });

  /* ----------------------------------------------------------
     MAGNETIC BUTTONS
     ---------------------------------------------------------- */
  if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * 0.25);
        yTo((e.clientY - rect.top - rect.height / 2) * 0.35);
      });

      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }
}

/* ============================================================
   REFERRAL FORM — no backend integration is verified for this
   form, so submission never fakes success: it reveals an honest
   "integration pending" notice and routes the typed data to the
   verified WhatsApp channel instead. Runs regardless of motion
   preferences.
   ============================================================ */
const refForm = document.getElementById('ref-form');

refForm?.addEventListener('submit', (e) => {
  e.preventDefault(); // only fires when native validation passes
  const data = new FormData(refForm);
  const text =
    'Olá! Quero fazer uma indicação pelo Programa de Indicação.\n\n' +
    'Meus dados:\n' +
    `Nome: ${data.get('ref-name')}\n` +
    `E-mail: ${data.get('ref-email')}\n` +
    `Telefone: ${data.get('ref-phone')}\n\n` +
    'Quem estou indicando:\n' +
    `Empresa/Pessoa: ${data.get('ref-company')}\n` +
    `E-mail: ${data.get('ref-ind-email')}\n` +
    `Telefone: ${data.get('ref-ind-phone')}`;

  const whatsLink = document.getElementById('ref-whats');
  whatsLink.href = `https://wa.me/5527998971712?text=${encodeURIComponent(text)}`;

  const pending = document.getElementById('ref-pending');
  pending.hidden = false;
  whatsLink.focus();
});

/* ============================================================
   CUSTOM CURSOR (independent of reduced-motion guard above,
   but disabled by it via CSS + this check)
   ============================================================ */
if (finePointer && !reduceMotion) {
  const cursor = document.querySelector('.cursor');
  const dotX = gsap.quickTo('.cursor-dot', 'x', { duration: 0.12, ease: 'power2.out' });
  const dotY = gsap.quickTo('.cursor-dot', 'y', { duration: 0.12, ease: 'power2.out' });
  const ringX = gsap.quickTo('.cursor-ring', 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo('.cursor-ring', 'y', { duration: 0.45, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
  }, { passive: true });

  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

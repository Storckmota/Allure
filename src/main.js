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
  gsap.set('.portrait-mask', { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set('.portrait-mask img', { scale: 1.35 });
  gsap.set(['.hero-eyebrow', '.hero-aside', '.portrait-caption', '.hero-foot'], { autoAlpha: 0, y: 24 });
  gsap.set('.hero-bg-word', { autoAlpha: 0 });
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
    // hero build-up overlapping the curtain lift
    .to('.hero-title .line-inner', { yPercent: 0, duration: 1.2, stagger: 0.14 }, '-=0.55')
    .to('.portrait-mask', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' }, '<0.1')
    .to('.portrait-mask img', { scale: 1, duration: 1.6, ease: 'power3.out' }, '<')
    .to('.hero-bg-word', { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, '<0.2')
    .to(['.hero-eyebrow', '.hero-aside', '.portrait-caption', '.hero-foot'], {
      autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1,
    }, '-=0.9')
    .to('.site-header', { yPercent: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7');

  /* ----------------------------------------------------------
     HERO — cursor parallax (stars + portrait drift)
     ---------------------------------------------------------- */
  if (finePointer) {
    const hero = document.querySelector('.hero');
    const stars = gsap.utils.toArray('.hero-stars .star');
    const portraitX = gsap.quickTo('.hero-portrait', 'x', { duration: 1.2, ease: 'power3.out' });
    const portraitY = gsap.quickTo('.hero-portrait', 'y', { duration: 1.2, ease: 'power3.out' });

    hero.addEventListener('mousemove', (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      portraitX(dx * -18);
      portraitY(dy * -12);
      stars.forEach((star) => {
        const depth = parseFloat(star.dataset.depth || 0.05);
        gsap.to(star, { x: dx * -600 * depth, y: dy * -400 * depth, duration: 1.4, ease: 'power3.out' });
      });
    });
  }

  /* ----------------------------------------------------------
     MANIFESTO — pinned scrub: words ignite, page morphs to cream
     ---------------------------------------------------------- */
  const manifesto = document.querySelector('.manifesto');
  const words = splitWords(manifesto.querySelector('.manifesto-line'));

  gsap.set(words, { opacity: 0.14 });

  gsap.timeline({
    scrollTrigger: {
      trigger: manifesto,
      start: 'top top',
      end: '+=170%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
    },
  })
    .to(words, { opacity: 1, stagger: 0.5, duration: 2, ease: 'none' }, 0)
    .to(manifesto, { backgroundColor: '#F4EACF', color: '#222323', duration: 3, ease: 'power1.inOut' }, 2.5)
    .to('.manifesto-kicker', { color: '#C02B53', duration: 3 }, 2.5);

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

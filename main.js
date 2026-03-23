/* ─────────────────────────────────────────────────────────
   main.js — Portfolio interactivity
   ───────────────────────────────────────────────────────── */

/* ── Particle Intro (ported from ParticleTextEffect.tsx) ── */
(function initParticleIntro() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // ── Particle class (direct port from TypeScript original) ──
  class Particle {
    constructor() {
      this.pos   = { x: 0, y: 0 };
      this.vel   = { x: 0, y: 0 };
      this.acc   = { x: 0, y: 0 };
      this.target = { x: 0, y: 0 };

      this.closeEnoughTarget = 100;
      this.maxSpeed    = 1.0;
      this.maxForce    = 0.1;
      this.particleSize = 10;
      this.isKilled    = false;

      this.startColor    = { r: 0, g: 0, b: 0 };
      this.targetColor   = { r: 0, g: 0, b: 0 };
      this.colorWeight   = 0;
      this.colorBlendRate = 0.01;
    }

    move() {
      let proximityMult = 1;
      const dx   = this.pos.x - this.target.x;
      const dy   = this.pos.y - this.target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.closeEnoughTarget) proximityMult = dist / this.closeEnoughTarget;

      const toTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
      const mag = Math.sqrt(toTarget.x * toTarget.x + toTarget.y * toTarget.y);
      if (mag > 0) {
        toTarget.x = (toTarget.x / mag) * this.maxSpeed * proximityMult;
        toTarget.y = (toTarget.y / mag) * this.maxSpeed * proximityMult;
      }

      const steer = { x: toTarget.x - this.vel.x, y: toTarget.y - this.vel.y };
      const sMag  = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
      if (sMag > 0) {
        steer.x = (steer.x / sMag) * this.maxForce;
        steer.y = (steer.y / sMag) * this.maxForce;
      }

      this.acc.x += steer.x;
      this.acc.y += steer.y;
      this.vel.x += this.acc.x;
      this.vel.y += this.acc.y;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.acc.x = 0;
      this.acc.y = 0;
    }

    draw(ctx, drawAsPoints) {
      if (this.colorWeight < 1.0)
        this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);

      const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
      const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
      const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      if (drawAsPoints) {
        ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    kill(width, height) {
      if (!this.isKilled) {
        const rp = this._randomPos(width / 2, height / 2, (width + height) / 2);
        this.target.x = rp.x;
        this.target.y = rp.y;

        this.startColor = {
          r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
          g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
          b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
        };
        this.targetColor  = { r: 0, g: 0, b: 0 };
        this.colorWeight  = 0;
        this.isKilled     = true;
      }
    }

    _randomPos(cx, cy, mag) {
      const rx = Math.random() * 1000;
      const ry = Math.random() * 500;
      const d  = { x: rx - cx, y: ry - cy };
      const m  = Math.sqrt(d.x * d.x + d.y * d.y);
      if (m > 0) { d.x = (d.x / m) * mag; d.y = (d.y / m) * mag; }
      return { x: cx + d.x, y: cy + d.y };
    }
  }

  // ── Canvas setup — full viewport ──────────────────────
  let W = window.innerWidth;
  let H = window.innerHeight;

  function setupCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  }
  setupCanvas();
  window.addEventListener('resize', () => {
    setupCanvas();
    particles.splice(0);
    nextWord(WORDS[wordIndex]);
  });

  const ctx       = canvas.getContext('2d');
  const particles = [];
  // Scale pixel sampling with canvas area so particle count stays sane
  const PIXEL_STEPS   = Math.max(window.innerWidth < 768 ? 10 : 6, Math.round(6 * Math.sqrt((W * H) / 500000)));
  const DRAW_POINTS   = true;
  const FRAMES_PER_WORD = 500;

  // ── Words shown in sequence ────────────────────────────
  // (port of the `words` prop, customised for Yacine)
  const WORDS = [
    "HELLO !",
    "I'M YACINE",
    "CS STUDENT",
    "AI ENGINEER",
    "NOT SENIOR",
    "YET... :)",
    "HIRE ME !",
  ];

  let frameCount = 0;
  let wordIndex  = 0;
  let rafId;

  function randomPos(cx, cy, mag) {
    const rx = Math.random() * W;
    const ry = Math.random() * H;
    const d  = { x: rx - cx, y: ry - cy };
    const m  = Math.sqrt(d.x * d.x + d.y * d.y);
    if (m > 0) { d.x = (d.x / m) * mag; d.y = (d.y / m) * mag; }
    return { x: cx + d.x, y: cy + d.y };
  }

  function nextWord(word) {
    const off    = document.createElement('canvas');
    off.width    = W;
    off.height   = H;
    const offCtx = off.getContext('2d');

    // Font scales with viewport height, then shrinks to fit canvas width
    const maxFontByH = Math.floor(word.length > 10 ? H * 0.14 : H * 0.19);
    offCtx.fillStyle    = 'white';
    offCtx.textAlign    = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.font = `bold ${maxFontByH}px Arial`;
    const measuredW = offCtx.measureText(word).width;
    const fontSize  = measuredW > W * 0.88
      ? Math.floor(maxFontByH * (W * 0.88 / measuredW))
      : maxFontByH;
    offCtx.font = `bold ${fontSize}px Arial`;
    offCtx.fillText(word, W / 2, H / 2);

    const pixels = offCtx.getImageData(0, 0, W, H).data;

    const newColor = {
      r: Math.floor(Math.random() * 200 + 55),
      g: Math.floor(Math.random() * 200 + 55),
      b: Math.floor(Math.random() * 200 + 55),
    };

    // Shuffle sampled pixel indices for fluid-motion entry
    const indices = [];
    for (let i = 0; i < pixels.length; i += PIXEL_STEPS * 4) indices.push(i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let pIdx = 0;
    for (const ci of indices) {
      if (pixels[ci + 3] === 0) continue;

      const x = (ci / 4) % W;
      const y = Math.floor(ci / 4 / W);
      let p;

      if (pIdx < particles.length) {
        p = particles[pIdx];
        p.isKilled = false;
        pIdx++;
      } else {
        p = new Particle();
        const rp    = randomPos(W / 2, H / 2, (W + H) / 2);
        p.pos.x     = rp.x;
        p.pos.y     = rp.y;
        p.maxSpeed  = Math.random() * 1.2 + 1.2;
        p.maxForce  = p.maxSpeed * 0.07;
        p.particleSize   = Math.random() * 6 + 6;
        p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
        particles.push(p);
      }

      p.startColor = {
        r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
        g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
        b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
      };
      p.targetColor  = newColor;
      p.colorWeight  = 0;
      p.target.x     = x;
      p.target.y     = y;
    }

    for (let i = pIdx; i < particles.length; i++) particles[i].kill(W, H);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.move();
      p.draw(ctx, DRAW_POINTS);
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > W || p.pos.y < 0 || p.pos.y > H)) {
        particles.splice(i, 1);
      }
    }

    frameCount++;
    if (frameCount % FRAMES_PER_WORD === 0) {
      wordIndex = (wordIndex + 1) % WORDS.length;
      nextWord(WORDS[wordIndex]);
    }

    rafId = requestAnimationFrame(animate);
  }

  // Pause animation when section is not visible (performance)
  const introSection = document.getElementById('particle-intro');
  const visibilityObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      rafId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0.1 });
  if (introSection) visibilityObserver.observe(introSection);

  // Start
  nextWord(WORDS[0]);
  rafId = requestAnimationFrame(animate);
}());

/* ── Particle canvas background ────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;

  const _mob = window.innerWidth <= 768;
  const CONFIG = {
    count:       _mob ? 35 : 80,
    speed:       0.3,
    radius:      { min: 0.5, max: 1.8 },
    opacity:     { min: 0.05, max: 0.35 },
    connections: _mob ? 80 : 120,
    colors:      ['#00d4ff', '#8b5cf6', '#f0abfc'],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    return {
      x:   rand(0, W),
      y:   rand(0, H),
      r:   rand(CONFIG.radius.min, CONFIG.radius.max),
      vx:  rand(-CONFIG.speed, CONFIG.speed),
      vy:  rand(-CONFIG.speed, CONFIG.speed),
      o:   rand(CONFIG.opacity.min, CONFIG.opacity.max),
      color,
    };
  }

  function initParticles() {
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function hexAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(p.color, p.o);
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connections) {
          const alpha = (1 - dist / CONFIG.connections) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = hexAlpha(particles[i].color, alpha);
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); });
}());

/* ── Navbar (header-3 port) ─────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const toggle     = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks   = document.querySelectorAll('.nav-link');
  const dropdownItem = document.querySelector('.nav-has-dropdown');
  const dropdownBtn  = document.querySelector('.nav-dropdown-btn');

  // ── Scroll: add backdrop when scrolled past 10px ──────
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // ── Active link tracking ──────────────────────────────
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(l => {
      const href = l.getAttribute('href');
      l.classList.toggle('active', href === `#${current}`);
    });
  }

  // ── Mobile toggle ─────────────────────────────────────
  function closeMobile() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function openMobile() {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('open');
    isOpen ? closeMobile() : openMobile();
    // Close dropdown if open
    dropdownItem && dropdownItem.classList.remove('open');
  });

  // Close mobile menu on any link click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  // ── Projects dropdown ─────────────────────────────────
  if (dropdownBtn && dropdownItem) {
    dropdownBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdownItem.classList.contains('open');
      dropdownItem.classList.toggle('open', !isOpen);
      dropdownBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!dropdownItem.contains(e.target)) {
        dropdownItem.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown when navigating
    dropdownItem.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        dropdownItem.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Escape key closes everything ─────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMobile();
      dropdownItem && dropdownItem.classList.remove('open');
    }
  });
}());

/* ── Typed role text ────────────────────────────────────── */
(function initTyped() {
  const el    = document.getElementById('role-typed');
  if (!el) return;
  const roles = [
    'AI Engineer',
    'Full-Stack Developer',
    'ML Researcher',
    'Python Developer',
    'Software Engineer',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;
  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 45;
  const PAUSE_END    = 2200;
  const PAUSE_START  = 400;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, PAUSE_END);
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        return setTimeout(tick, PAUSE_START);
      }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(tick, 600);
}());

/* ── Counter animation (hero stats) ────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let triggered  = false;

  function animate() {
    if (triggered) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      triggered = true;
      counters.forEach(el => {
        const target   = parseInt(el.dataset.target);
        const duration = 1400;
        const step     = target / (duration / 16);
        let current    = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.round(current);
        }, 16);
      });
    }
  }

  window.addEventListener('scroll', animate, { passive: true });
  animate();
}());

/* ── Intersection Observer — scroll reveals ─────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Animate skill bars when their group becomes visible
        const bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
          const pct = bar.closest('.skill-bar').dataset.level;
          setTimeout(() => { bar.style.width = pct + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}());

/* ── Project filter ─────────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const grid  = document.querySelector('.projects-grid');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      // Reset grid positioning
      grid.style.position = '';

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.split(' ').includes(filter);
        if (show) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}());

/* ── Card 3D tilt on mousemove ──────────────────────────── */
(function initTilt() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = y * -8;
      const tiltY  = x * 8;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';

      // Move glow to cursor
      const glow = card.querySelector('.card-glow');
      if (glow) {
        const px = (e.clientX - rect.left - 80) + 'px';
        const py = (e.clientY - rect.top  - 80) + 'px';
        glow.style.left = px;
        glow.style.top  = py;
        glow.style.right = 'auto';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = '';
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left  = '';
        glow.style.top   = '';
        glow.style.right = '-50px';
      }
    });
  });
}());

/* ── Smooth scroll for anchor links ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      // Re-check href at click time — it may have been changed dynamically (e.g. #pop-link)
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href.length < 2) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 60; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}());

/* ── Contact form ───────────────────────────────────────── */
(function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit .btn-text');
    btn.textContent = 'Sending...';

    setTimeout(() => {
      btn.textContent  = 'Message Sent!';
      status.textContent = 'Thanks for reaching out — I\'ll get back to you soon.';
      form.reset();
      setTimeout(() => {
        btn.textContent  = 'Send Message';
        status.textContent = '';
      }, 4000);
    }, 1200);
  });
}());

/* ── Neon cursor trail ──────────────────────────────────── */
(function initCursorTrail() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  const dots   = [];
  const N      = 10;
  const colors = ['#00d4ff', '#4abfff', '#7aaeff', '#9e9ef6', '#c47ef7', '#f0abfc'];

  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    Object.assign(d.style, {
      position:     'fixed',
      pointerEvents:'none',
      zIndex:       '9999',
      borderRadius: '50%',
      width:        '6px',
      height:       '6px',
      transform:    'translate(-50%,-50%)',
      transition:   'opacity 0.2s',
      background:   colors[Math.floor(i / N * colors.length)],
      opacity:      String(1 - i / N * 0.9),
      boxShadow:    `0 0 ${4 + i}px ${colors[Math.floor(i / N * colors.length)]}`,
    });
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0, tx: 0, ty: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  (function loop() {
    dots[0].tx = mouseX; dots[0].ty = mouseY;
    for (let i = 1; i < N; i++) {
      dots[i].tx = dots[i - 1].x;
      dots[i].ty = dots[i - 1].y;
    }
    for (const dot of dots) {
      dot.x += (dot.tx - dot.x) * 0.35;
      dot.y += (dot.ty - dot.y) * 0.35;
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
    }
    requestAnimationFrame(loop);
  }());
}());

/* ── Glitch effect on hero name ─────────────────────────── */
(function initGlitch() {
  const el = document.querySelector('.name-accent');
  if (!el) return;

  const original = el.textContent;
  const chars    = '!@#$%^&*ABCDEFabcdef01234';

  function glitch() {
    let count = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((ch, i) => (Math.random() < 0.15 ? chars[Math.floor(Math.random() * chars.length)] : ch))
        .join('');
      if (++count > 8) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 50);
  }

  // Trigger every 6 seconds
  setInterval(glitch, 6000);
  document.querySelector('.hero-name')?.addEventListener('mouseenter', glitch);
}());

/* ── Personal section — tab switching ──────────────────── */
(function initPersonalTabs() {
  const tabs  = document.querySelectorAll('.personal-tab');
  const panes = document.querySelectorAll('.personal-pane');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t  => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById('tab-' + tab.dataset.tab);
      if (pane) {
        pane.classList.add('active');
        pane.querySelectorAll('.reveal-up').forEach(el => {
          if (!el.classList.contains('revealed')) el.classList.add('revealed');
        });
      }
    });
  });
}());

/* ── Personal section — animated tab backgrounds ─────────── */
(function initTabBackgrounds() {
  const canvas = document.getElementById('personal-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Anime: falling sakura petals ── */
  function buildAnime() {
    const colors = ['#ff6baa','#c44dff','#ff9ef7','#bd44ff','#ff4fcb'];
    const petalCount = window.innerWidth < 768 ? 35 : 70;
    const petals = Array.from({ length: petalCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rx: Math.random() * 7 + 3,
      ry: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 0.7,
      vy: Math.random() * 0.7 + 0.3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.1,
    }));
    return function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        if (p.y > canvas.height + 12) { p.y = -12; p.x = Math.random() * canvas.width; }
        if (p.x < -12) p.x = canvas.width + 12;
        if (p.x > canvas.width + 12) p.x = -12;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };
  }

  /* ── Drawing: drifting sketch lines ── */
  function buildDrawing() {
    const lineCount = window.innerWidth < 768 ? 20 : 40;
    const lines = Array.from({ length: lineCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: Math.random() * 100 + 30,
      angle: Math.random() * Math.PI,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      va: (Math.random() - 0.5) * 0.006,
      alpha: Math.random() * 0.07 + 0.02,
    }));
    return function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        l.x += l.vx; l.y += l.vy; l.angle += l.va;
        if (l.x < -120 || l.x > canvas.width  + 120) l.vx *= -1;
        if (l.y < -120 || l.y > canvas.height + 120) l.vy *= -1;
        const dx = Math.cos(l.angle) * l.len / 2;
        const dy = Math.sin(l.angle) * l.len / 2;
        ctx.beginPath();
        ctx.moveTo(l.x - dx, l.y - dy);
        ctx.lineTo(l.x + dx, l.y + dy);
        ctx.strokeStyle = `rgba(255,255,255,${l.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };
  }

  /* ── Reading: rising golden glyphs ── */
  function buildReading() {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεζθλπΣΩ∞∂∇';
    const glyphCount = window.innerWidth < 768 ? 28 : 55;
    const glyphs = Array.from({ length: glyphCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: pool[Math.floor(Math.random() * pool.length)],
      vy: -(Math.random() * 0.45 + 0.1),
      alpha: Math.random() * 0.18 + 0.04,
      size: Math.floor(Math.random() * 14 + 10),
    }));
    return function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      glyphs.forEach(g => {
        g.y += g.vy;
        if (g.y < -20) {
          g.y = canvas.height + 20;
          g.x = Math.random() * canvas.width;
          g.char = pool[Math.floor(Math.random() * pool.length)];
        }
        ctx.globalAlpha = g.alpha;
        ctx.fillStyle = '#ffc850';
        ctx.font = `${g.size}px serif`;
        ctx.fillText(g.char, g.x, g.y);
      });
      ctx.globalAlpha = 1;
    };
  }

  /* ── Travels: constellation stars ── */
  function buildTravels() {
    const starCount = window.innerWidth < 768 ? 45 : 90;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
    }));
    const MAX = 130;
    return function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > canvas.width)  s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;
      });
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(80,220,255,${0.14 * (1 - d / MAX)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,220,255,${s.alpha})`;
        ctx.fill();
      });
    };
  }

  const builders = { anime: buildAnime, drawing: buildDrawing, reading: buildReading, travels: buildTravels };

  function startAnim(name) {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    const build = builders[name];
    if (!build) return;
    resize();
    const draw = build();
    function loop() { draw(); raf = requestAnimationFrame(loop); }
    loop();
  }

  startAnim('anime');
  document.querySelectorAll('.personal-tab').forEach(tab => {
    tab.addEventListener('click', () => startAnim(tab.dataset.tab));
  });
}());

/* ── Anime Gallery4 carousel ────────────────────────────── */
(function initAnimeCarousel() {
  const track  = document.getElementById('anime-track');
  const prev   = document.getElementById('anime-prev');
  const next   = document.getElementById('anime-next');
  const dots   = document.querySelectorAll('#anime-dots .g4-dot');
  if (!track || !prev || !next) return;

  const items  = track.querySelectorAll('.g4-item');
  const count  = items.length;
  let current  = 0;

  function getItemWidth() {
    return items[0] ? items[0].getBoundingClientRect().width + 20 : 340;
  }

  function scrollTo(index) {
    current = Math.max(0, Math.min(index, count - 1));
    track.scrollTo({ left: current * getItemWidth(), behavior: 'smooth' });
    update();
  }

  function update() {
    prev.disabled = current === 0;
    next.disabled = current >= count - 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => scrollTo(current - 1));
  next.addEventListener('click', () => scrollTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollTo(i)));

  // Sync dot/button state on manual scroll
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const w = getItemWidth();
      current = Math.round(track.scrollLeft / w);
      update();
    }, 80);
  }, { passive: true });

  update();
}());

/* ── Bento drawing lightbox ─────────────────────────────── */
(function initBentoLightbox() {
  const modal     = document.getElementById('bento-modal');
  const modalImg  = document.getElementById('bento-modal-img');
  const closeBtn  = document.getElementById('bento-modal-close');
  if (!modal) return;

  document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('click', () => {
      modalImg.src = item.dataset.src;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  }

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}());

/* ── Reading carousel ───────────────────────────────────── */
(function initReadingCarousel() {
  const track = document.getElementById('reading-track');
  const prev  = document.getElementById('reading-prev');
  const next  = document.getElementById('reading-next');
  const dots  = document.querySelectorAll('#reading-dots .g4-dot');
  if (!track || !prev || !next) return;

  const items = track.querySelectorAll('.g4-item');
  const count = items.length;
  let current = 0;

  function getItemWidth() {
    return items[0] ? items[0].getBoundingClientRect().width + 20 : 340;
  }
  function scrollTo(index) {
    current = Math.max(0, Math.min(index, count - 1));
    track.scrollTo({ left: current * getItemWidth(), behavior: 'smooth' });
    update();
  }
  function update() {
    prev.disabled = current === 0;
    next.disabled = current >= count - 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => scrollTo(current - 1));
  next.addEventListener('click', () => scrollTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollTo(i)));

  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      current = Math.round(track.scrollLeft / getItemWidth());
      update();
    }, 80);
  }, { passive: true });

  update();
}());

/* ── Travels carousel ───────────────────────────────────── */
(function initTravelsCarousel() {
  const track = document.getElementById('travels-track');
  const prev  = document.getElementById('travels-prev');
  const next  = document.getElementById('travels-next');
  const dots  = document.querySelectorAll('#travels-dots .g4-dot');
  if (!track || !prev || !next) return;

  const items = track.querySelectorAll('.g4-item');
  const count = items.length;
  let current = 0;

  function getItemWidth() {
    return items[0] ? items[0].getBoundingClientRect().width + 20 : 340;
  }
  function scrollTo(index) {
    current = Math.max(0, Math.min(index, count - 1));
    track.scrollTo({ left: current * getItemWidth(), behavior: 'smooth' });
    update();
  }
  function update() {
    prev.disabled = current === 0;
    next.disabled = current >= count - 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => scrollTo(current - 1));
  next.addEventListener('click', () => scrollTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollTo(i)));

  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      current = Math.round(track.scrollLeft / getItemWidth());
      update();
    }, 80);
  }, { passive: true });

  update();
}());

/* ── Sticker ticker — duplicate inner for seamless loop ─── */
(function initStickerTicker() {
  document.querySelectorAll('.sticker-ticker').forEach(ticker => {
    const inner = ticker.querySelector('.sticker-inner');
    if (!inner) return;
    ticker.appendChild(inner.cloneNode(true));
  });
}());

/* ── Orbital Projects ───────────────────────────────────── */
(function initOrbital() {
  const stage   = document.getElementById('orbital-stage');
  const panel   = document.getElementById('orb-panel');
  const idle    = document.getElementById('orb-panel-idle');
  const detail  = document.getElementById('orb-panel-detail');
  const popNum  = document.getElementById('pop-num');
  const popTag  = document.getElementById('pop-tag');
  const popTitle= document.getElementById('pop-title');
  const popDesc = document.getElementById('pop-desc');
  const popTech = document.getElementById('pop-tech');
  const popLink = document.getElementById('pop-link');
  const closeBtn= document.getElementById('orb-close');
  if (!stage) return;

  // ── Project data — 4 per ring ─────────────────────────
  const PROJECTS = [
    // Ring 1 — inner (core AI/Web projects)
    { id:'brain-tumor',       ring:1, num:'01', icon:'🔬', label:'Brain Tumor',   fullTitle:'Brain Tumor Detection',             tagClass:'ai-tag',      tag:'AI / ML',        desc:'CNN classifying brain tumors from MRI scans with systematic hyperparameter optimization.',    tech:['Python','TensorFlow','Keras','NumPy'] },
    { id:'llm-microservices', ring:1, num:'03', icon:'🤖', label:'LLM Services',  fullTitle:'LLM Microservices Platform',        tagClass:'systems-tag', tag:'Enterprise',     desc:'Three-tier system with Mistral AI, regex guardrails, and an orchestrator gateway.',         tech:['Python','Flask','Mistral AI','REST API'] },
    { id:'ai-goal-platform',  ring:1, num:'04', icon:'💡', label:'AI Goals',      fullTitle:'AI Goal Achievement Platform',      tagClass:'web-tag',     tag:'AI + Web',       desc:'Full-stack coaching app with AI chatbot, smart plan generator, and resource search.',       tech:['Python','Flask','JavaScript','SQLite'] },
    { id:'syntax-squad',      ring:1, num:'05', icon:'🕸️', label:'Syntax Squad',  fullTitle:'Syntax Squad — Campus Web App',     tagClass:'web-tag',     tag:'Team / Web',     desc:'7-person agile Django app with graph pathfinding — live deployed on PythonAnywhere.',       tech:['Django','NetworkX','Python','PythonAnywhere'] },
    // Ring 2 — middle (academic projects)
    { id:'computer-vision',   ring:2, num:'02', icon:'🎥', label:'CV Pipeline',   fullTitle:'Computer Vision Pipeline',          tagClass:'ai-tag',      tag:'Computer Vision',desc:'Five vision challenges: edge detection, segmentation, SIFT features, object recognition.',  tech:['OpenCV','scikit-image','NumPy','Matplotlib'] },
    { id:'sentiment-analysis',ring:2, num:'06', icon:'💬', label:'Sentiment NLP', fullTitle:'Cross-Domain Sentiment Analysis',   tagClass:'nlp-tag',     tag:'NLP',            desc:'VADER vs ML classifiers on 15,000 reviews with cross-domain generalisation analysis.',      tech:['NLTK','scikit-learn','TF-IDF','HuggingFace'] },
    { id:'battleship',        ring:2, num:'08', icon:'🎮', label:'Battleship',    fullTitle:'Battleship — AI Opponent Game',     tagClass:'systems-tag', tag:'Game Dev',       desc:'Python Battleship with CLI + Flask web UI, AI opponent, three placement algorithms.',       tech:['Python','Flask','JavaScript','REST API'] },
    { id:'web-dev-php',       ring:2, num:'09', icon:'🌍', label:'PHP Website',   fullTitle:'Responsive Multi-Page PHP Website', tagClass:'web-tag',     tag:'Web Dev',        desc:'PHP platform: user auth, memory pairs game, real-time leaderboard, Azure VM deploy.',      tech:['PHP','MySQL','JavaScript','Azure VM'] },
    // Ring 3 — outer (systems / language projects)
    { id:'logic-programming', ring:3, num:'07', icon:'🧩', label:'Logic & FP',    fullTitle:'Logic & Functional Programming',    tagClass:'systems-tag', tag:'Languages',      desc:'Declarative solutions in Prolog (constraint logic) and Haskell (type-safe algorithms).',   tech:['Prolog','Haskell','GHC','SWI-Prolog'] },
    { id:'cycling-race',      ring:3, num:'10', icon:'🏆', label:'Cycling Race',  fullTitle:'Cycling Race Management System',    tagClass:'systems-tag', tag:'Java / OOP',     desc:'Java backend managing teams, riders, and multi-stage races with full OOP design.',         tech:['Java 17','OOP','JUnit','Gradle'] },
    { id:'systems-c',         ring:3, num:'11', icon:'🔧', label:'Systems C',    fullTitle:'Systems Programming in C',          tagClass:'systems-tag', tag:'Systems / C',    desc:'Low-level C programs: memory management, pointer arithmetic, data structures.',            tech:['C','GCC','Valgrind','Make'] },
    { id:'java-card-game',    ring:3, num:'12', icon:'🎲', label:'Card Game',     fullTitle:'Java Multi-Threaded Card Game',     tagClass:'systems-tag', tag:'Concurrency',    desc:'Thread-safe card game with synchronized decks, deadlock prevention, and JUnit tests.',     tech:['Java','Threads','synchronized','JUnit'] },
  ];

  // ── Ring config: base radii for a 660px stage ────────
  const RINGS = [
    { id:1, baseR:128, speed: 0.32, angle:  0 },
    { id:2, baseR:222, speed: 0.20, angle: 45 },
    { id:3, baseR:308, speed: 0.12, angle: 90 },
  ];

  let activeId = null;
  let paused   = false;
  let rafId    = null;
  let scale    = 1;

  // ── Build node elements once ──────────────────────────
  const nodeEls = {};
  PROJECTS.forEach(p => {
    const el = document.createElement('div');
    el.className = 'orb-node';
    el.dataset.ring = p.ring;
    el.dataset.id   = p.id;
    el.innerHTML = `
      <div class="orb-node-glow"></div>
      <div class="orb-node-core"><span>${p.icon}</span></div>
      <span class="orb-node-label">${p.label}</span>`;
    el.addEventListener('click', e => { e.stopPropagation(); openDetail(p.id); });
    stage.appendChild(el);
    nodeEls[p.id] = el;
  });

  // ── Size ring tracks from JS ──────────────────────────
  function sizeTracks() {
    const stageW = stage.offsetWidth;
    scale = stageW / 660;
    RINGS.forEach(r => {
      const d = r.baseR * scale * 2;
      const el = document.getElementById(`orb-track-${r.id}`);
      if (el) { el.style.width = d + 'px'; el.style.height = d + 'px'; }
    });
  }

  // ── Animate every frame ───────────────────────────────
  function tick() {
    if (!paused) RINGS.forEach(r => { r.angle = (r.angle + r.speed) % 360; });

    scale = stage.offsetWidth / 660;

    PROJECTS.forEach(p => {
      const ring   = RINGS[p.ring - 1];
      const peers  = PROJECTS.filter(x => x.ring === p.ring);
      const idx    = peers.indexOf(p);
      const radius = ring.baseR * scale;
      const deg    = ((idx / peers.length) * 360 + ring.angle) % 360;
      const rad    = (deg * Math.PI) / 180;
      const x      = radius * Math.cos(rad);
      const y      = radius * Math.sin(rad);

      // depth: 0 = far (top), 1 = near (bottom)
      const depth  = (Math.sin(rad) + 1) / 2;
      const ns     = 0.78 + 0.22 * depth;
      const op     = p.id === activeId ? 1 : 0.45 + 0.55 * depth;

      const el = nodeEls[p.id];
      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${ns.toFixed(3)})`;
      el.style.opacity   = op.toFixed(3);
      el.style.zIndex    = Math.round(10 + 90 * depth);
    });

    rafId = requestAnimationFrame(tick);
  }

  // ── Open detail panel ─────────────────────────────────
  function openDetail(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    activeId = id;
    paused   = true;

    popNum.textContent   = p.num;
    popTag.textContent   = p.tag;
    popTag.className     = `card-tag ${p.tagClass}`;
    popTitle.textContent = p.fullTitle;
    popDesc.textContent  = p.desc;
    popTech.innerHTML    = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    popLink.href         = `project.html?id=${p.id}`;

    idle.style.display   = 'none';
    detail.style.display = 'block';

    Object.values(nodeEls).forEach(n => n.classList.remove('active'));
    nodeEls[id].classList.add('active');
  }

  // ── Close detail panel ────────────────────────────────
  function closeDetail() {
    activeId         = null;
    paused           = false;
    idle.style.display   = 'flex';
    detail.style.display = 'none';
    Object.values(nodeEls).forEach(n => n.classList.remove('active'));
  }

  // ── Center orb: click toggles pause ──────────────────
  const orbCenter = document.getElementById('orb-center');
  const orbNotice = document.getElementById('orb-notice');
  if (orbCenter) {
    orbCenter.addEventListener('click', e => {
      e.stopPropagation();
      if (activeId) { closeDetail(); return; }
      paused = !paused;
      orbCenter.classList.toggle('paused', paused);
      stage.classList.toggle('orb-paused', paused);
      if (orbNotice) orbNotice.classList.toggle('hidden', paused);
    });
  }

  closeBtn.addEventListener('click', closeDetail);
  stage.addEventListener('click', () => { if (activeId) closeDetail(); });
  window.addEventListener('resize', sizeTracks, { passive: true });

  // Pause when section off-screen
  const section = document.getElementById('projects');
  if (section) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { if (!rafId) rafId = requestAnimationFrame(tick); }
      else { cancelAnimationFrame(rafId); rafId = null; }
    }, { threshold: 0.05 }).observe(section);
  }

  sizeTracks();
  rafId = requestAnimationFrame(tick);
}());

/* ── Scroll Guide Avatar ────────────────────────────────── */
(function initScrollGuide() {
  const wrap   = document.getElementById('sg-wrap');
  const outer  = document.getElementById('sg-outer');
  const char   = document.getElementById('sg-char');
  const bubble = document.getElementById('sg-bubble');
  const textEl = document.getElementById('sg-text');
  if (!wrap) return;

  // Messages per section — short, conversational, cycling
  const MSGS = {
    'particle-intro': [
      "Psst — that's me up there! 👆",
      "Pretty cool particles, right?",
      "Scroll down — I'll guide you!"
    ],
    'hero': [
      "Hey there! I'm Yacine 👋",
      "CS student at Exeter!",
      "AI & full-stack dev 🚀"
    ],
    'about': [
      "Let me introduce myself...",
      "I love building AI systems 🧠",
      "Based in the UK 📍"
    ],
    'personal': [
      "More than just code! 🎌",
      "Check out my anime list!",
      "I draw, read and write too ✍️"
    ],
    'projects': [
      "Here are my creations!",
      "12 projects — click any node!",
      "Each one taught me something 💡"
    ],
    'skills': [
      "My full toolkit 🛠️",
      "Python is home base 🐍",
      "Always learning new things!"
    ],
    'contact': [
      "Let's build something together!",
      "I'm always open to chat 😄",
      "Don't be shy — say hi! 👋"
    ]
  };

  let currentSection = null;
  let msgIdx = 0;
  let msgTimer = null;
  let scrollTimer = null;
  let lastScrollY = window.scrollY;

  function showBubble(text) {
    textEl.textContent = text;
    bubble.classList.add('visible');
    clearTimeout(bubble._hide);
    bubble._hide = setTimeout(() => bubble.classList.remove('visible'), 5500);
  }

  function enterSection(id) {
    if (id === currentSection) return;
    currentSection = id;
    msgIdx = 0;
    clearInterval(msgTimer);
    const msgs = MSGS[id];
    if (!msgs) return;
    showBubble(msgs[0]);
    if (msgs.length > 1) {
      msgTimer = setInterval(() => {
        msgIdx = (msgIdx + 1) % msgs.length;
        showBubble(msgs[msgIdx]);
      }, 3400);
    }
  }

  // Watch each section with IntersectionObserver
  const sections = document.querySelectorAll(
    '#particle-intro, #hero, #about, #projects, #skills, #contact'
  );
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) enterSection(e.target.id);
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObs.observe(s));

  // Scroll → walk animation + 3D tilt
  window.addEventListener('scroll', () => {
    const dy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (Math.abs(dy) < 2) return;

    const tilt = dy > 0 ? 9 : -9;
    outer.style.transform = `perspective(420px) rotateY(${tilt}deg)`;
    char.classList.add('walking');

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      char.classList.remove('walking');
      outer.style.transform = 'perspective(420px) rotateY(0deg)';
    }, 160);
  }, { passive: true });

  // Click character to toggle bubble
  outer.style.pointerEvents = 'auto';
  outer.style.cursor = 'pointer';
  outer.addEventListener('click', () => {
    if (bubble.classList.contains('visible')) {
      bubble.classList.remove('visible');
    } else if (currentSection) {
      const msgs = MSGS[currentSection];
      if (msgs) showBubble(msgs[msgIdx]);
    }
  });
}());


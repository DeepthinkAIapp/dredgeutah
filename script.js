// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const quoteBtn = document.querySelector('.quote-btn');
if (hamburger && navLinks && quoteBtn) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    quoteBtn.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// Smooth scroll for navigation links
const navLinkElements = document.querySelectorAll('.nav-links a, .footer-section.quick-links a');
navLinkElements.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu after click (on small screens)
        navLinks.classList.remove('active');
        quoteBtn.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});

// Gradient neon-green-to-blue tracer effect with tapered thickness
(function() {
  const SEGMENTS = 16;
  const SIZE_HEAD = 32; // px, thickest at head
  const SIZE_TAIL = 8;  // px, thinnest at tail
  const HEAD_COLOR = [198, 255, 26]; // neon green
  const TAIL_COLOR = [58, 125, 255]; // blue
  const trail = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const seg = document.createElement('div');
    seg.className = 'mouse-tracer-segment';
    document.body.appendChild(seg);
    trail.push({el: seg, x: window.innerWidth/2, y: window.innerHeight/2});
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animateTracer() {
    let prevX = mouseX, prevY = mouseY;
    for (let i = 0; i < SEGMENTS; i++) {
      const seg = trail[i];
      seg.x += (prevX - seg.x) * 0.45;
      seg.y += (prevY - seg.y) * 0.45;
      // Tapered size
      const t = i / (SEGMENTS - 1);
      const size = lerp(SIZE_HEAD, SIZE_TAIL, t);
      seg.el.style.width = `${size}px`;
      seg.el.style.height = `${size}px`;
      seg.el.style.transform = `translate3d(${seg.x - size/2}px, ${seg.y - size/2}px, 0)`;
      // Color gradient
      const r = Math.round(lerp(HEAD_COLOR[0], TAIL_COLOR[0], t));
      const g = Math.round(lerp(HEAD_COLOR[1], TAIL_COLOR[1], t));
      const b = Math.round(lerp(HEAD_COLOR[2], TAIL_COLOR[2], t));
      const opacity = lerp(0.95, 0.15, t);
      seg.el.style.background = `rgba(${r},${g},${b},${opacity})`;
      seg.el.style.boxShadow = i === 0 ? `0 0 32px 12px rgba(198,255,26,0.5)` : 'none';
      prevX = seg.x;
      prevY = seg.y;
    }
    requestAnimationFrame(animateTracer);
  }
  animateTracer();
})();

// Animated highlight for help cards
(function() {
  const cards = document.querySelectorAll('.help-card');
  let current = 0;
  function highlightNext() {
    cards.forEach((card, i) => {
      card.classList.toggle('help-card-green', i === current);
    });
    current = (current + 1) % cards.length;
  }
  if (cards.length > 0) {
    highlightNext();
    setInterval(highlightNext, 1200);
  }
})();

// Sunflower background scaling on scroll (all three SVGs)
(function() {
  const bg = document.getElementById('hero-sunflower-bg');
  const hero = document.querySelector('.hero');
  const center = document.querySelector('.sunflower-center');
  const left = document.querySelector('.sunflower-left');
  const right = document.querySelector('.sunflower-right');
  if (!bg || !hero || !center || !left || !right) return;
  function onScroll() {
    const rect = hero.getBoundingClientRect();
    let t = Math.min(Math.max(-rect.top / (rect.height * 0.7), 0), 1);
    const scale = 1 + t * 0.7;
    center.style.transform = `translate(-50%, -50%) scale(${scale})`;
    left.style.transform = `translateY(-50%) scale(${0.8 * scale})`;
    right.style.transform = `translateY(-50%) scale(${0.8 * scale})`;
  }
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Contact modal logic for 'Start Project' and quote buttons
(function() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.querySelector('.contact-modal-close');
  const triggers = [
    ...document.querySelectorAll('.package-btn'),
    ...document.querySelectorAll('.quote-cta-btn'),
    ...document.querySelectorAll('.start-project-btn')
  ];
  function openModal() {
    modal.style.display = 'flex';
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  triggers.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openModal();
  }));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (modal.style.display === 'flex' && e.key === 'Escape') closeModal();
  });
})();

// Mouse tracer effect
(function() {
  const canvas = document.getElementById('tracer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  let points = [];
  const maxPoints = 40; // Length of the tracer

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function addInterpolatedPoints(last, curr) {
    const dist = Math.hypot(curr.x - last.x, curr.y - last.y);
    const step = 2; // px between interpolated points (smaller = denser, always solid)
    if (dist > step) {
      const steps = Math.floor(dist / step);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        points.push({
          x: lerp(last.x, curr.x, t),
          y: lerp(last.y, curr.y, t)
        });
      }
    }
  }

  let lastPoint = null;
  document.addEventListener('pointermove', (e) => {
    const curr = { x: e.clientX, y: e.clientY };
    if (lastPoint) {
      addInterpolatedPoints(lastPoint, curr);
    }
    points.push(curr);
    lastPoint = curr;
    if (points.length > maxPoints) points = points.slice(points.length - maxPoints);
  });

  function drawTracer() {
    ctx.clearRect(0, 0, width, height);

    if (points.length > 1) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'lime';
      ctx.shadowBlur = 20; // Glow effect

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      // Gradient for tail fade
      const grad = ctx.createLinearGradient(
        points[0].x, points[0].y,
        points[points.length - 1].x, points[points.length - 1].y
      );
      grad.addColorStop(0, 'rgba(0,255,0,0.2)');
      grad.addColorStop(1, 'rgba(200,255,100,1)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 18;
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(drawTracer);
  }

  drawTracer();
})();

/* ====================== */
/* Tawk.to Chat Integration */
/* ====================== */

// Initialize Tawk.to with enhanced triggers
document.addEventListener('DOMContentLoaded', function() {
  // Load Tawk.to script
  var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
  (function(){
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/66ceb29eea492f34bc0ad56f/1i6bmjf7m';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
  })();

  // Chat trigger: Scroll to 50% of page
  window.addEventListener('scroll', function() {
    if (window.scrollY > (document.body.scrollHeight / 2)) {
      if (typeof Tawk_API !== 'undefined' && Tawk_API.showWidget) {
        Tawk_API.showWidget();
      }
    }
  });

  // Chat trigger: Hover over pricing cards
  document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (typeof Tawk_API !== 'undefined' && Tawk_API.maximize) {
        Tawk_API.maximize();
      }
    });
  });

  // Chat trigger: Click "Live Chat" button
  const chatButtons = document.querySelectorAll('.cta-headstart-chat, [data-chat-trigger]');
  chatButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof Tawk_API !== 'undefined' && Tawk_API.maximize) {
        Tawk_API.maximize();
      }
    });
  });

  // Chat trigger: Exit intent
  document.addEventListener('mouseout', function(e) {
    if (!e.toElement && !e.relatedTarget && e.clientY < 50) {
      if (typeof Tawk_API !== 'undefined' && Tawk_API.showWidget) {
        Tawk_API.showWidget();
      }
    }
  });

  // Set visitor attributes when chat loads
  if (typeof Tawk_API !== 'undefined') {
    Tawk_API.onLoad = function() {
      // Set visitor info (can be customized)
      Tawk_API.setAttributes({
        'name': localStorage.getItem('visitorName') || 'Visitor',
        'email': localStorage.getItem('visitorEmail') || '',
        'page': window.location.pathname
      }, function(error) {
        if (!error) console.log('Visitor attributes set');
      });
    };
  }
});

// Fallback for Tawk.to if not loaded after 5 seconds
setTimeout(function() {
  if (typeof Tawk_API === 'undefined') {
    console.warn('Tawk.to failed to load, retrying...');
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/66ceb29eea492f34bc0ad56f/1i6bmjf7m';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
  }
}, 5000);
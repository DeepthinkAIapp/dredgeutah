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

// Dropdown menu functionality for touch devices
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');
  
  if (toggle && menu) {
    // Handle click events for touch devices
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dropdown) {
          other.querySelector('.dropdown-menu').style.display = 'none';
        }
      });
      
      // Toggle current dropdown
      const isVisible = menu.style.display === 'block';
      menu.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }
});

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

// Enhanced mouse tracer effect with aquatic theme colors
(function() {
  const SEGMENTS = 20;
  const SIZE_HEAD = 28; // px, thickest at head
  const SIZE_TAIL = 6;  // px, thinnest at tail
  const HEAD_COLOR = [72, 202, 228]; // #48cae4 - aquatic blue
  const TAIL_COLOR = [144, 224, 239]; // #90e0ef - lighter blue
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
      seg.x += (prevX - seg.x) * 0.4;
      seg.y += (prevY - seg.y) * 0.4;
      
      // Tapered size
      const t = i / (SEGMENTS - 1);
      const size = lerp(SIZE_HEAD, SIZE_TAIL, t);
      seg.el.style.width = `${size}px`;
      seg.el.style.height = `${size}px`;
      seg.el.style.transform = `translate3d(${seg.x - size/2}px, ${seg.y - size/2}px, 0)`;
      
      // Aquatic color gradient
      const r = Math.round(lerp(HEAD_COLOR[0], TAIL_COLOR[0], t));
      const g = Math.round(lerp(HEAD_COLOR[1], TAIL_COLOR[1], t));
      const b = Math.round(lerp(HEAD_COLOR[2], TAIL_COLOR[2], t));
      const opacity = lerp(0.9, 0.1, t);
      seg.el.style.background = `rgba(${r},${g},${b},${opacity})`;
      
      // Enhanced glow effect for head
      if (i === 0) {
        seg.el.style.boxShadow = `0 0 24px 8px rgba(72,202,228,0.6)`;
      } else if (i < 3) {
        seg.el.style.boxShadow = `0 0 16px 4px rgba(72,202,228,0.3)`;
      } else {
        seg.el.style.boxShadow = 'none';
      }
      
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





// Blog search functionality
(function() {
  const searchInput = document.getElementById('blog-search');
  const searchButton = searchInput && searchInput.parentElement.querySelector('button');
  if (!searchInput || !searchButton) return;

  // Get all blog cards and featured post
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));
  const featuredPost = document.querySelector('.featured-blog-post');

  function normalize(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function filterPosts(query) {
    const q = normalize(query);
    // Filter blog cards
    blogCards.forEach(card => {
      const title = normalize(card.querySelector('h3')?.textContent || '');
      const desc = normalize(card.querySelector('p')?.textContent || '');
      if (title.includes(q) || desc.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    // Filter featured post
    if (featuredPost) {
      const title = normalize(featuredPost.querySelector('h2')?.textContent || '');
      const desc = normalize(featuredPost.querySelector('p')?.textContent || '');
      if (q && !(title.includes(q) || desc.includes(q))) {
        featuredPost.style.display = 'none';
      } else {
        featuredPost.style.display = '';
      }
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    filterPosts(searchInput.value);
  }

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  });
  searchInput.addEventListener('input', function() {
    if (!this.value) filterPosts('');
  });
})();
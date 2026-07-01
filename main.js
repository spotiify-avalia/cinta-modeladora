document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL ANIMATIONS (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // 2. VIDEO PLAY BUTTON
  const video = document.getElementById('demo');
  const playBtn = document.getElementById('playBtn');
  if (video && playBtn) {
    // Attempt autoplay
    video.play().catch(() => {});
    
    playBtn.addEventListener('click', () => {
      playBtn.style.display = 'none';
      video.muted = false;
      video.currentTime = 0;
      video.play();
    });
  }

  // 3. FLOAT BUTTON MOBILE
  const floatBtn = document.getElementById('float');
  const hero = document.querySelector('.hero');
  
  if (floatBtn && hero) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > hero.offsetHeight * 0.75) {
        floatBtn.classList.add('show');
      } else {
        floatBtn.classList.remove('show');
      }
    }, { passive: true });
  }

  // 4. CHECKOUT LOGIC
  const CHECKOUTS = {
    "Preta|P": "https://use-velora.mycartpanda.com/checkout/211340202:1",
    "Preta|M": "https://use-velora.mycartpanda.com/checkout/211148353:1",
    "Preta|G": "https://use-velora.mycartpanda.com/checkout/211148354:1",
    "Preta|GG": "https://use-velora.mycartpanda.com/checkout/211148355:1",
    "Bege|P": "https://use-velora.mycartpanda.com/checkout/211338752:1",
    "Bege|M": "https://use-velora.mycartpanda.com/checkout/211338938:1",
    "Bege|G": "https://use-velora.mycartpanda.com/checkout/211338939:1",
    "Bege|GG": "https://use-velora.mycartpanda.com/checkout/211338940:1"
  };

  const state = { color: null, size: null };
  const buyBtn = document.getElementById('buyBtn');
  const buyHint = document.getElementById('buyHint');

  function currentUrl() {
    if (state.color && state.size) {
      return CHECKOUTS[`${state.color}|${state.size}`] || null;
    }
    return null;
  }

  function refreshButtonState() {
    const ready = !!currentUrl();
    buyBtn.disabled = !ready;
    
    if (ready) {
      buyHint.textContent = `${state.color} · ${state.size} →`;
    } else if (!state.color && !state.size) {
      buyHint.textContent = 'Escolha cor e tamanho';
    } else if (!state.color) {
      buyHint.textContent = 'Escolha a cor';
    } else {
      buyHint.textContent = 'Escolha o tamanho';
    }
  }

  document.querySelectorAll('#colorRow .opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#colorRow .opt-btn').forEach(x => x.classList.remove('sel'));
      btn.classList.add('sel');
      state.color = btn.getAttribute('data-color');
      refreshButtonState();
    });
  });

  document.querySelectorAll('#sizeRow .opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sizeRow .opt-btn').forEach(x => x.classList.remove('sel'));
      btn.classList.add('sel');
      state.size = btn.getAttribute('data-size');
      refreshButtonState();
    });
  });

  buyBtn.addEventListener('click', () => {
    const url = currentUrl();
    if (buyBtn.disabled || !url) return;
    
    // Facebook Pixel Track
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: 'Cinta Modeladora Feminina',
        content_category: 'Cinta Modeladora',
        content_ids: [`${state.color} ${state.size}`],
        contents: [{ id: `${state.color} ${state.size}`, quantity: 1 }],
        num_items: 1,
        value: 89.90,
        currency: 'BRL'
      });
    }
    
    window.open(url, '_blank', 'noopener');
  });

  // Init state
  refreshButtonState();
});

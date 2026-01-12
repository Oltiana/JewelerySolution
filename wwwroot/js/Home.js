// home.js — slider improvements: dots + pause-on-hover + safety checks
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for Shop Now button
  const shopBtn = document.querySelector('.btn');
  if (shopBtn) {
    shopBtn.addEventListener('click', () => {
      const target = document.querySelector('.section-title');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Product click logging
  document.querySelectorAll('.product').forEach(item => {
    item.addEventListener('click', () => {
      console.log(item.innerText.trim() + ' clicked');
    });
  });

  // Main hero slider (scoped to avoid product-image sliders)
  const mainSlider = document.querySelector('.slider:not(.product-image)');
  if (mainSlider) {
    const slides = Array.from(mainSlider.querySelectorAll('.slide'));
    if (slides.length > 0) {
      const nextBtn = mainSlider.querySelector('.next');
      const prevBtn = mainSlider.querySelector('.prev');
      let current = 0;
      let intervalId = null;
      const DURATION = 3000;

      // Create dots navigation
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'dots';
      if (nextBtn) mainSlider.insertBefore(dotsContainer, nextBtn);
      else mainSlider.appendChild(dotsContainer);

      slides.forEach((s, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => { goTo(i); resetInterval(); });
        dotsContainer.appendChild(dot);
      });

      function updateDots(index) {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
      }

      function show(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
        updateDots(index);
        current = index;
      }

      function next() { show((current + 1) % slides.length); }
      function prev() { show((current - 1 + slides.length) % slides.length); }
      function goTo(i) { show(i); }

      if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetInterval(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetInterval(); });

      function startInterval() {
        if (intervalId) return;
        intervalId = setInterval(() => { next(); }, DURATION);
      }
      function stopInterval() { if (!intervalId) return; clearInterval(intervalId); intervalId = null; }
      function resetInterval() { stopInterval(); startInterval(); }

      mainSlider.addEventListener('mouseenter', () => stopInterval());
      mainSlider.addEventListener('mouseleave', () => startInterval());

      show(0);
      startInterval();
    }
  }

  // Initialize sliders inside product-image (uniform behavior per product)
  document.querySelectorAll('.product-image.slider').forEach(container => {
    const slides = Array.from(container.querySelectorAll('.slide'));
    if (!slides || slides.length <= 1) return; // nothing to rotate

    let current = 0;
    let intervalId = null;
    const DURATION = 3000;

    const nextBtn = container.querySelector('.next');
    const prevBtn = container.querySelector('.prev');

    // Create dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots';
    if (nextBtn) container.insertBefore(dotsContainer, nextBtn);
    else container.appendChild(dotsContainer);

    slides.forEach((s, i) => {
      // Add load/error listeners to help debug missing images
      s.addEventListener('error', () => {
        console.warn('Image failed to load:', s.src);
        // fallback to hero image if available
        s.src = './images/jewerlly.jpg';
      });
      s.addEventListener('load', () => {
        console.log('Image loaded:', s.src);
      });
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); resetInterval(); });
      dotsContainer.appendChild(dot);
    });

    function updateDots(index) {
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function show(index) {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
      updateDots(index);
      current = index;
    }

    function next() { show((current + 1) % slides.length); }
    function prev() { show((current - 1 + slides.length) % slides.length); }
    function goTo(i) { show(i); }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); resetInterval(); });

    function startInterval() { if (intervalId) return; intervalId = setInterval(() => { next(); }, DURATION); }
    function stopInterval() { if (!intervalId) return; clearInterval(intervalId); intervalId = null; }
    function resetInterval() { stopInterval(); startInterval(); }

    container.addEventListener('mouseenter', () => stopInterval());
    container.addEventListener('mouseleave', () => startInterval());

    show(0);
    startInterval();
  });
});
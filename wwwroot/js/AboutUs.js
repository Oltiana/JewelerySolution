// AboutUs.js — fade-in intersection observer
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.about-text, .about-grid img, .small-image');

  // If IntersectionObserver is not supported, just reveal elements
  if (typeof IntersectionObserver === 'undefined') {
    elements.forEach(el => el.classList.add('fade-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
});

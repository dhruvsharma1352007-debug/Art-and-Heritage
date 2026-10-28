/**
 * Art & Heritage - Client Enhancements
 * Lightweight vanilla JavaScript for navigation, accessibility, and graceful image fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Image error graceful fallback handler
  document.querySelectorAll('img.image-actual').forEach((img) => {
    // If already broken or on error
    img.addEventListener('error', () => {
      const wrapper = img.closest('.img-fallback-wrap');
      if (wrapper) {
        wrapper.classList.add('img-fallback-active');
      }
    });

    // Check complete state in case already failed
    if (img.complete && img.naturalHeight === 0) {
      const wrapper = img.closest('.img-fallback-wrap');
      if (wrapper) {
        wrapper.classList.add('img-fallback-active');
      }
    }
  });

  // 3. Highlight current page in navigation
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath !== '/' && href !== '/' && currentPath.includes(href))) {
      link.classList.add('text-stone-900', 'font-semibold', 'border-b-2', 'border-[#9A3412]');
      link.classList.remove('text-stone-600');
    }
  });
});

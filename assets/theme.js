// Voyage Theme JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap tooltips if needed
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Service card selection (for booking forms)
  document.querySelectorAll('.service-card, .service-button').forEach(card => {
    card.addEventListener('click', function() {
      const parent = this.closest('.service-selector, .booking-wizard');
      if (parent) {
        parent.querySelectorAll('.service-card, .service-button').forEach(c => {
          c.classList.remove('active', 'selected');
        });
        this.classList.add('active', 'selected');
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only fade in once
      }
    });
  }, { threshold: 0.2 });

  // Select all elements you want to animate
  const elements = document.querySelectorAll("p, h1, h2, h3, img");
  elements.forEach(el => observer.observe(el));
});


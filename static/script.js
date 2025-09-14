document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // 🔑 Only trigger once
      }
    });
  }, {
    threshold: 0.2 // trigger when 20% of element is visible
  });

  fadeEls.forEach(el => observer.observe(el));
});



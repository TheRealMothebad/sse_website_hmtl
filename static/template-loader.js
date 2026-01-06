async function loadTemplates(root = document) {
  const includes = root.querySelectorAll("[data-include]");

  for (let el of includes) {
    const url = el.getAttribute("data-include");

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch ${url}`);
      const templateHTML = await resp.text();

      // Insert fetched template
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = templateHTML;

      // Fill slots
      const slotContents = el.querySelectorAll("[slot]");
      slotContents.forEach(slotEl => {
        const name = slotEl.getAttribute("slot");
        const target = tempDiv.querySelector(`[data-slot="${name}"]`);
        if (target) {
          target.innerHTML = slotEl.innerHTML;
        }
      });

      // Replace include with expanded template
      el.replaceWith(...tempDiv.childNodes);
    } catch (err) {
      console.error("Template load error:", err);
      break;
    }
  }

  // 🔁 Re-run until there are no more includes
  if (document.querySelector("[data-include]")) {
    await loadTemplates(document);
  } else {
    initializeNavbarScroll();
    highlightActiveNavLink();
  }

  fade_in()
}

function initializeNavbarScroll() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  if (!navbar) {
    console.error("Navbar element not found for scroll hiding.");
    return;
  }

  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
      // Downscroll
      navbar.classList.add('navbar-hidden');
    } else {
      // Upscroll
      navbar.classList.remove('navbar-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });
}

function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop(); // Get current file name (e.g., "index.html")

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active-nav-link');
    }
  });
}

function fade_in() {

  const allElements = [...document.querySelectorAll("p, h1, h2, h3, img, div, tr, li")];

  // Get elements currently in viewport
  const inView = allElements.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });

  // Stagger fade in for visible elements
  inView.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, i * 120); // 150ms delay between elements
  });

  // Observe the rest for lazy fade in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  allElements
    .filter(el => !inView.includes(el))
    .forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  loadTemplates();
});


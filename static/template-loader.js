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
  }

  fade_in()
}

function fade_in() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only fade in once
      }
    });
  }, { threshold: 0.2 });

  // Select all elements you want to animate
  const elements = document.querySelectorAll("p, h1, h2, h3, img, div");
  elements.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  loadTemplates();
});


document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("content");

  // 🔁 reusable function to attach link listeners
  function attachLinkEvents() {
    document.querySelectorAll("nav a, .img-link, .img-linksong").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const url = e.currentTarget.getAttribute("href");
        if (url === window.location.pathname.split("/").pop()) return;

        main.classList.add("fade-out");

        fetch(url)
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newContent = doc.querySelector("main").innerHTML;

            setTimeout(() => {
              main.innerHTML = newContent;
              main.classList.remove("fade-out");
              window.history.pushState({}, "", url);

              // ✅ reattach events for new page elements
              attachLinkEvents();
            }, 400);
          })
          .catch(err => console.error("Error loading page:", err));
      });
    });
  }

  // initialize the first time
  attachLinkEvents();

  // 🔙 handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    fetch(window.location.pathname)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        main.innerHTML = doc.querySelector("main").innerHTML;
        attachLinkEvents();
      })
      .catch(err => console.error("Error loading history state:", err));
  });
});
class Turbopages {
  constructor() {
    console.log("Starting Turbopages");
    this.setup();
  }

  setup() {
    document.addEventListener("click", (e) => this.handleLinkClick(e));
  }

  handleLinkClick(e: MouseEvent) {
    // Handle link clicks
    if (e.target instanceof HTMLAnchorElement) {
      // ignore external links
      if (e.target.target === "_blank") return;

      e.preventDefault();
      this.loadPage(e.target.href);
    }
  }

  loadPage(url: string) {
    // Download HTML from url
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        // Parse HTML
        const doc = new DOMParser().parseFromString(html, "text/html");
        // Get title
        const title = doc.querySelector("title")?.innerText;
        // Get body
        const body = doc.querySelector("body")?.innerHTML;
        // Update title
        document.title = title || "";
        // Update body
        document.body.innerHTML = body || "";
        // Update URL
        window.history.pushState({}, title || "", url);
      });
  }
}

export default Turbopages;

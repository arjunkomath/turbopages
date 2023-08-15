export type TurboPagesOptions = {
  tracing?: boolean;
};

class Turbopages {
  private _tracing = false;

  constructor({ tracing = false }: TurboPagesOptions = {}) {
    this._tracing = tracing;

    this.setup();
  }

  _trace(...args: any[]) {
    if (this._tracing) {
      console.log("Turbo 🚀 ::", ...args);
    }
  }

  setup() {
    document.addEventListener("click", (e) => this.handleLinkClick(e));
    this._trace("Started");
  }

  handleLinkClick(e: MouseEvent) {
    // Handle link clicks
    if (e.target instanceof HTMLAnchorElement) {
      // ignore external links
      if (e.target.target === "_blank") return;

      // ignore links with data-turbo="false"
      if (e.target.dataset.turbo === "false") return;

      e.preventDefault();
      this.loadPage(e.target.href);
    }
  }

  loadPage(url: string) {
    this._trace("Loading page", url);
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

export type TurboPagesOptions = {
  tracing?: boolean;
  prefetch?: boolean;
};

class Turbopages {
  private _tracing = false;
  private _prefetch = false;

  private _prefetchedPages: Map<string, string> = new Map();

  constructor({ tracing, prefetch }: TurboPagesOptions = {}) {
    this._tracing = tracing ?? false;
    this._prefetch = prefetch ?? true;

    this.setup();

    if (this._prefetch) {
      this._trace("Prefetching enabled");
      this._prefetchPages();
    }
  }

  private _trace(...args: any[]) {
    if (this._tracing) {
      console.log("Turbo 🚀 ::", ...args);
    }
  }

  private _traceError(...args: any[]) {
    if (this._tracing) {
      console.error("Turbo 🚀 ::", ...args);
    }
  }

  private _shouldTurboLoadUrl(element: HTMLAnchorElement): boolean {
    // ignore external links
    if (element.target === "_blank") return false;

    // ignore links with data-turbo="false"
    if (element.dataset.turbo === "false") return false;

    // ignore anchors
    if (element.href.includes("#")) return false;

    return true;
  }

  private _handleLinkClick(e: MouseEvent) {
    // Handle link clicks
    if (e.target instanceof HTMLAnchorElement) {
      if (!this._shouldTurboLoadUrl(e.target)) return;

      e.preventDefault();
      this.loadPage(e.target.href);
    }
  }

  private _prefetchPages() {
    const links = document.querySelectorAll("a");

    links.forEach(async (link) => {
      if (!this._shouldTurboLoadUrl(link)) return true;

      const href = link.href;
      if (href && !this._prefetchedPages.has(href)) {
        const html = await this._fetchHtml(href).catch((e) =>
          this._traceError(e)
        );
        if (html) {
          this._prefetchedPages.set(href, html);
          this._trace("Prefetched", href);
        }
      }
    });
  }

  private async _fetchHtml(url: string): Promise<string> {
    if (this._prefetchedPages.has(url)) {
      return this._prefetchedPages.get(url) || "";
    }

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load page");
        }
        return response;
      })
      .then((response) => response.text());
  }

  setup() {
    document.addEventListener("click", (e) => this._handleLinkClick(e));
    this._trace("Started");
  }

  loadPage(url: string) {
    this._fetchHtml(url)
      .then((html) => {
        this._trace("Loading page", url);
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
      })
      .catch((err) => {
        this._traceError(err);
        window.location.href = url;
      });
  }
}

export default Turbopages;

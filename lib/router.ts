import { FlamethrowerOptions, RouteChangeData } from './interfaces';
import { handleLinkClick, handlePopState, scrollToTop } from './handlers';
import { mergeHead, formatNextDocument, replaceBody } from './dom';

const defaultOpts = {
  log: false,
  prefetch: true,
  pageTransitions: false,
};

export class Router {
  enabled = true;
  prefetched = new Set<string>();

  constructor(public opts?: FlamethrowerOptions) {
    this.opts = { ...defaultOpts, ...opts };

    if (window.history) {
      document.addEventListener('click', (e) => this.onClick(e));
      window.addEventListener('popstate', (e) => this.onPop(e));
    } else {
      console.warn('flamethrower router not supported by browser');
    }

    this.prefetch();
  }

  go(path: string) {
    const prev = window.location.href;
    const next = new URL(path, location.origin).href;
    return this.replaceDOM({ type: 'go', next, prev });
  }

  disable() {
    this.enabled = false;
  }

  // Finds links on page and prefetches them
  private prefetch() {
    const allLinks = Array.from(document.links)
      .map((l) => l.href)
      .filter(
        (v) =>
          v.includes(document.location.origin) && // on origin url
          !v.includes('#') && // not an id anchor
          v !== (document.location.href || document.location.href + '/') && // not current page
          !this.prefetched.has(v) // not already prefetched
      );

    allLinks.forEach((url) => {
      const linkEl = document.createElement('link');
      linkEl.rel = `prefetch`;
      linkEl.href = url;

      linkEl.onload = () => this.opts.log && console.log('🌩️ prefetched', url);
      linkEl.onerror = () =>
        this.opts.log && console.error("🤕 can't prefetch", url);

      document.head.appendChild(linkEl);

      // Keep track of prefetched links
      this.prefetched.add(url);
    });
  }

  private onClick(e: MouseEvent) {
    if (this.enabled) {
      this.replaceDOM(handleLinkClick(e));
    }
  }

  private onPop(e: PopStateEvent) {
    if (this.enabled) {
      this.replaceDOM(handlePopState(e));
    }
  }

  private async replaceDOM({ type, next, prev }: RouteChangeData) {
    try {
      this.opts.log && console.log('⚡', type);

      // Check type && window href destination
      // Disqualify if fetching same URL

      if (['popstate', 'link', 'go'].includes(type) && next !== prev) {
        this.opts.log && console.time('⏱️');

        // Get Page
        window.dispatchEvent(new CustomEvent('router:fetch'));

        const res = await fetch(next);
        const html = await res.text();

        const nextDoc = formatNextDocument(html);

        // Merge HEAD
        mergeHead(nextDoc);

        // Merge BODY
        // with optional native browser page transitions
        if (
          this.opts.pageTransitions &&
          (document as any).createDocumentTransition
        ) {
          const transition = (document as any).createDocumentTransition();
          transition.start(() => replaceBody(nextDoc));
        } else {
          replaceBody(nextDoc);
        }

        scrollToTop(type);

        window.dispatchEvent(new CustomEvent('router:end'));

        this.prefetch();
        this.opts.log && console.timeEnd('⏱️');
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('router:error', err));
      this.opts.log && console.timeEnd('⏱️');
      console.error('💥 router fetch failed', err);
      return false;
    }
  }
}

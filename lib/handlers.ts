import { RouteChangeData } from './interfaces';

// url == https://example.com/foo/bar
// Ensures consistent formatting for href

export function scrollToTop(type) {
  if (['link', 'go'].includes(type)) {
    window.scrollTo({ top: 0 })
  }
}

export function fullURL(url?: string) {
    const href = new URL(url || window.location.href).href;
    return href.endsWith('/') ? href : `${href}/`;
  }
  
  // Changes URL on history
export function addToPushState(url: string) {
    if (!window.history.state || window.history.state.url !== url) {
      window.history.pushState({ url }, 'internalLink', url);
    }
  }
  
  // Smooth stroll to anchor link
  export function scrollToAnchor(anchor) {
    document
      .querySelector(anchor)
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Handles back button
  export function handlePopState(e: PopStateEvent): RouteChangeData {
    const next = fullURL();
    addToPushState(next);
    return { type: 'popstate', next };
  }
  
  // Segments link clicks into types
  export function handleLinkClick(e: MouseEvent): RouteChangeData {
    let anchor: HTMLAnchorElement;
  
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      return { type: 'disqualified' };
    }
  
    // Find element containing href
    for (
      var n = e.target as HTMLElement;
      n.parentNode;
      n = n.parentNode as HTMLElement
    ) {
      if (n.nodeName === 'A') {
        anchor = n as HTMLAnchorElement;
        break;
      }
    }
  
    // External links
    if (anchor && anchor.host !== location.host) {
      anchor.target = '_blank';
      return { type: 'external' };
    }
  
    // Link qualified 
    if (anchor && anchor.hasAttribute('href')) {
      const ahref = anchor.getAttribute('href');
      const url = new URL(ahref, location.origin);
  
      // Start Quick Load
      e.preventDefault();
  
      // If anchor, scroll,
      if (ahref && ahref.startsWith('#')) {
        scrollToAnchor(ahref);
        return { type: 'scrolled' };
      } else {
        const next = fullURL(url.href);
        const prev = fullURL();
  
        addToPushState(next);
        return { type: 'link', next, prev };
      }
    } else {
      return { type: 'noop' };
    }
  }
  
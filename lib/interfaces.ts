export interface FlamethrowerOptions {
    log?: boolean;
    /**
     * prefetch method can be either 'visible' or 'hover'
     * visible: prefetches all links that are currently visible on the page
     * hover: prefetches all links that are hovered over
     * undefined: no prefetching
     * @default undefined
     */
    prefetch?: 'visible' | 'hover',
    pageTransitions?: boolean,
  }
  
  export interface RouteChangeData {
    type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | string;
    next?: string;
    prev?: string;
  }
  
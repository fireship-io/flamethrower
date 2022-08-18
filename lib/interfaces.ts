export interface FlamethrowerOptions {
    log?: boolean;
    prefetch?: boolean,
    pageTransitions?: boolean,
  }
  
  export interface RouteChangeData {
    type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | string;
    next?: string;
    prev?: string;
  }
  
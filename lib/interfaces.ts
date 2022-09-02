import { Router } from './router';

export interface FlamethrowerOptions {
  log?: boolean;
  /**
   * prefetch method can be either 'visible' or 'hover'
   * visible: prefetches all links that are currently visible on the page
   * hover: prefetches all links that are hovered over
   * undefined: no prefetching
   * @default undefined
   */
  prefetch?: 'visible' | 'hover';
  pageTransitions?: boolean;
}

export interface RouteChangeData {
  type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | string;
  next?: string;
  prev?: string;
  scrollId?: string;
}

export type FlameWindow = Window & typeof globalThis & { flamethrower: Router };

export type FetchProgressEvent = {
  /** Percentage of bytes that have been sent as a percentage e.g. 100% -> 100, 50% -> 50 */
  progress: number;
  /** Number of bytes that have been received */
  received: number;
  /** Number of bytes total (Content-Length header) */
  length: number;
};

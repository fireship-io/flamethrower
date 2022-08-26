import { Router } from './router';
import { FlamethrowerOptions, FlameWindow } from './interfaces';

/**
 * @param  {FlamethrowerOptions} opts?
 * starts flamethrower router and returns instance
 * can be accessed globally with window.flamethrower
 */
export default (opts?: FlamethrowerOptions): Router => {
  const router = new Router(opts);
  // eslint-disable-next-line no-console
  opts.log && console.log('🔥 flamethrower engaged');
  if (window) {
    const flame = window as FlameWindow;
    flame.flamethrower = router;
  }
  return router;
};

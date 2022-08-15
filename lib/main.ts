import { Router } from './router';
import { FlamethrowerOptions } from './interfaces';

/**
 * @param  {FlamethrowerOptions} opts?
 * starts flamethrower router and returns instance
 * can be accessed globally with window.flamethrower
 */
export default (opts?: FlamethrowerOptions) => {
  const router = new Router(opts);
  opts.log && console.log('🔥 flamethrower engaged');
  if (window) (window as any).flamethrower = router;
  return router;
}

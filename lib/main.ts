// console.log('flamethrower init');

import { Router } from './router';
import { FlamethrowerOptions } from './interfaces';


export default (opts?: FlamethrowerOptions) => {
  const router = new Router(opts);
  opts.log && console.log('🔥 flamethrower engaged');
  return router;
}

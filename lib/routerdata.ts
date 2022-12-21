import { fullURL } from './handlers';
import { Pool } from './pool';
import { Subscription } from './interfaces';

export class RouterData extends Pool {
    private _subscribers: [string, number][];
    private _subsSize: number;
    constructor() {
        super();
        this._subscribers = [];
        this._subsSize = 0;
        // call notify after first event to call notify
        // on page load
        setTimeout(() => {
            this.notify();
        }, 0)
    }

    /* calls applicable functions in this.buffer */
    public notify(): void {
        let i = 0;
        // loop the subscribers to find the appropriate functions to call
        for (; i < this._subsSize; i++) {
            let route = this._subscribers[i][0];
            let idx = this._subscribers[i][1];
            if (route === window.location.href || route === "*") {
                this.buffer[idx]();
            }
        }
    }

    /**
     * @param {string[]} routes
     * @param {Subscription} routerSub
     * adds the function to the buffer and stores location
     * of function in buffer
     */
    public subscribe(routes: string[], routerSub: Subscription): void {
        let i = 0;
        let size_t = routes.length;
        for(; i < size_t; i++) {
            let route = routes[i];
            let url: string = route;
            // call closurish functions only once, don't subscribe them
            if (url === '**') {
                routerSub();
                return;
            }
            // properly format url
            if (url !== '*') {
                url = fullURL(new URL(route, location.href).href);
            }
            // add function to the pool
            let t = this.push(routerSub);
            // keep track of  url and it's reference to it's subscription
            this._subscribers.push([url, t]);
            this._subsSize++;
        }
    }

    /**
     * @param {string} route
     * @param {Subscription} routerSub
     * removes entry, deletes from buffer if no more routes depend on function
     */
    public unsubscribe(route: string, routerSub: Subscription): void {
        if (this.buffer.includes(routerSub)) {
            let bufIdx = this.buffer.indexOf(routerSub);
            let found: [string, number];
            let deps: number = 0;
            let url: string = route;
            if (url !== '*') {
                url = fullURL(new URL(route, location.href).href);
            }
            // loop subscriptions to see if other routes depend on same function
            for (let i = 0; i < this._subsSize; i++) {
                let t = this._subscribers[i];
                if (t[1] === bufIdx && t[0] !== url) {
                    deps++;
                }
                if (t[0] === url && t[1] === bufIdx) {
                    found = t;
                }
            }
            if (found) {
                let foundIdx = this._subscribers.indexOf(found);
                this._subscribers.splice(foundIdx,1);
                this._subsSize--;
                // remove references to this function if no more routes depend
                // on the function
                if (deps === 0) {
                    for (let i = 0; i < this._subsSize; i++) {
                        let data = this._subscribers[i];
                        if (data[1] > bufIdx) {
                            this._subscribers[i][1] = data[1] - 1;
                        }
                    }
                    this.del(bufIdx);
                }
            }
        }
    }
}

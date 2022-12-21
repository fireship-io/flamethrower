import { Subscription } from './interfaces';

export class Pool {
    public insert: number;
    public buffer: Subscription[];
    constructor() {
        this.insert = -1;
        this.buffer = [];
    }

    /**
     * @param {Subscription} val
     * @returns {number}
     * adds the callback function to the buffer
     * if it does not yet contain it
     */
    public push(val: Subscription): number {
        if (!this.buffer.includes(val)) {
            this.insert++;
            this.buffer[this.insert] = val;
        }
        // return the index of the specific function
        return this.buffer.indexOf(val);
    }

    /**
     * @param {number} idx
     */
    public del(idx: number) {
        this.buffer.splice(idx, 1);
        this.insert--;
    }
}

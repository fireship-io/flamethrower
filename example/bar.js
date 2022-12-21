
export class Bar {
    constructor(val) {
        this._value = val;
    }

    logVal() {
        console.log(this.value);
    }

    setText() {
        let el = document.getElementById("global-check");
        el.innerText = this.value;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (this._value !== val) {
            this._value = val;
            this.logVal();
            this.setText();
        }
    }
}

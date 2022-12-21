
export class Foo {
    constructor(id, value) {
        this.el = document.getElementById(id);
        this.val = value;
    }

    apply() {
        this.el.innerText = this.val;
    }
}

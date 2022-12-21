import flamethrower from './flamethrower.js';

import { Bar } from './bar.js';

const router = flamethrower({ prefetch: 'visible', log: true, pageTransitions: true });

// subscribe all routes to function
router.subscribe(["*"], all);

// subscribe only one route
router.subscribe(["/about/"], oneRoute);
router.subscribe(["/"], unsubme);

// subscribe multiple routes to one function
router.subscribe(["/test/", "/about/"], multiroute);

// subscribe route to an unsubscription
router.subscribe(["/about/"], subUnsub);

// subscribe a closurish type deal
// probably not recommended to use this in most cases, unless working with global variables
router.subscribe(["**"], closeMe);

function all() {
    console.log("look mom, you can call functions on every route!");
}

// dynamic import for route
async function oneRoute() {
    const { Foo } = await import("./foo.js");
    const foo = new Foo("subscriberCheck", "✔️ single route subscription works");
    foo.apply();
}

async function unsubme() {
    const { Foo } = await import("./foo.js");
    const foo = new Foo("unsub-check", "✔️ go to about, come back, and I'll be gone. Don't worry, I'll come back on reload");
    foo.apply();
}

function multiroute() {
    let el = document.querySelector(".multi-route");
    el.innerText = "✔️ multi route subscription works"
}

function subUnsub() {
    router.unsubscribe("/", unsubme);
}

function closeMe() {
    const bar = new Bar("hi");
    router.subscribe(["/"], t1);
    router.subscribe(["/about/"], t2);
    router.subscribe(["/test/"], t3);
    function t1() {
        bar.value = "✔️ hi mom";
    }
    function t2() {
        bar.value = "✔️ hi son";
    }
    function t3() {
        bar.value = "✔️ how's my little computer scientist today?";
    }
}


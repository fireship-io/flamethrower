function f(t) {
  ["link", "go"].includes(t) && window.scrollTo({ top: 0 });
}
function a(t) {
  const e = new URL(t || window.location.href).href;
  return e.endsWith("/") ? e : `${e}/`;
}
function p(t) {
  (!window.history.state || window.history.state.url !== t) && window.history.pushState({ url: t }, "internalLink", t);
}
function w(t) {
  document.querySelector(t).scrollIntoView({ behavior: "smooth", block: "start" });
}
function m(t) {
  const e = a();
  return { type: "popstate", next: e };
}
function g(t) {
  let e;
  if (t.altKey || t.ctrlKey || t.metaKey || t.shiftKey)
    return { type: "disqualified" };
  for (var r = t.target; r.parentNode; r = r.parentNode)
    if (r.nodeName === "A") {
      e = r;
      break;
    }
  if (e && e.host !== location.host)
    return e.target = "_blank", { type: "external" };
  if (e && "cold" in (e == null ? void 0 : e.dataset))
    return { type: "disqualified" };
  if (e != null && e.hasAttribute("href")) {
    const o = e.getAttribute("href"), i = new URL(o, location.origin);
    if (t.preventDefault(), o != null && o.startsWith("#"))
      return w(o), { type: "scrolled" };
    {
      const c = a(i.href), n = a();
      return { type: "link", next: c, prev: n };
    }
  } else
    return { type: "noop" };
}
function y(t) {
  var e = new DOMParser();
  return e.parseFromString(t, "text/html");
}
function l(t) {
  document.body.innerHTML = t.body.innerHTML;
}
function b(t) {
  const e = document.head, r = Array.from(document.head.children), o = Array.from(t.head.children), i = o.filter(
    (n) => !r.find((s) => s.isEqualNode(n))
  );
  r.filter(
    (n) => !o.find((s) => s.isEqualNode(n))
  ).forEach((n) => {
    n.getAttribute("rel") !== "prefetch" && n.remove();
  }), i.forEach((n) => {
    e.appendChild(n);
  });
}
function d() {
  Array.from(
    document.head.querySelectorAll("[data-reload]")
  ).forEach(u), Array.from(document.body.querySelectorAll("script")).forEach(u);
}
async function u(t) {
  const e = document.createElement("script"), r = Array.from(t.attributes);
  for (const { name: o, value: i } of r)
    e.setAttribute(o, i);
  e.appendChild(document.createTextNode(t.innerHTML)), t.parentNode.replaceChild(e, t);
}
const E = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class v {
  constructor(e) {
    this.opts = e, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...E, ...e }, window != null && window.history ? (document.addEventListener("click", (r) => this.onClick(r)), window.addEventListener("popstate", (r) => this.onPop(r)), this.prefetch()) : (console.warn(
      "flamethrower router not supported in this browser or environment"
    ), this.enabled = !1);
  }
  go(e) {
    const r = window.location.href, o = new URL(e, location.origin).href;
    return this.reconstructDOM({ type: "go", next: o, prev: r });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  log(...e) {
    console.log(...e);
  }
  prefetch() {
    const e = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    };
    this.opts.prefetch && "IntersectionObserver" in window && (this.observer || (this.observer = new IntersectionObserver((o, i) => {
      o.forEach((c) => {
        const n = c.target.getAttribute("href");
        if (this.prefetched.has(n)) {
          i.unobserve(c.target);
          return;
        }
        if (c.isIntersecting) {
          const s = document.createElement("link");
          s.rel = "prefetch", s.href = n, s.as = "document", s.onload = () => this.log("\u{1F329}\uFE0F prefetched", n), s.onerror = (h) => this.log("\u{1F915} can't prefetch", n, h), document.head.appendChild(s), this.prefetched.add(n), i.unobserve(c.target);
        }
      });
    }, e)), Array.from(document.links).filter(
      (o) => o.href.includes(document.location.origin) && !o.href.includes("#") && o.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(o.href)
    ).forEach((o) => this.observer.observe(o)));
  }
  onClick(e) {
    this.reconstructDOM(g(e));
  }
  onPop(e) {
    this.reconstructDOM(m());
  }
  async reconstructDOM({ type: e, next: r, prev: o }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", e), ["popstate", "link", "go"].includes(e) && r !== o) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch")), p(r);
        const c = await (await fetch(r)).text(), n = y(c);
        b(n), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          l(n), d();
        }) : (l(n), d()), f(e), window.dispatchEvent(new CustomEvent("router:end")), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (i) {
      return window.dispatchEvent(new CustomEvent("router:error", i)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", i), !1;
    }
  }
}
const k = (t) => {
  const e = new v(t);
  return t.log && console.log("\u{1F525} flamethrower engaged"), window && (window.flamethrower = e), e;
};
export {
  k as default
};

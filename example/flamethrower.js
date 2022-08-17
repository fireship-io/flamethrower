function f(e) {
  ["link", "go"].includes(e) && window.scrollTo({ top: 0 });
}
function a(e) {
  const t = new URL(e || window.location.href).href;
  return t.endsWith("/") ? t : `${t}/`;
}
function p(e) {
  (!window.history.state || window.history.state.url !== e) && window.history.pushState({ url: e }, "internalLink", e);
}
function w(e) {
  document.querySelector(e).scrollIntoView({ behavior: "smooth", block: "start" });
}
function m(e) {
  const t = a();
  return { type: "popstate", next: t };
}
function g(e) {
  let t;
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return { type: "disqualified" };
  for (var r = e.target; r.parentNode; r = r.parentNode)
    if (r.nodeName === "A") {
      t = r;
      break;
    }
  if (t && t.host !== location.host)
    return t.target = "_blank", { type: "external" };
  if (t && "cold" in (t == null ? void 0 : t.dataset))
    return { type: "disqualified" };
  if (t != null && t.hasAttribute("href")) {
    const o = t.getAttribute("href"), s = new URL(o, location.href);
    if (e.preventDefault(), o != null && o.startsWith("#"))
      return w(o), { type: "scrolled" };
    {
      const c = a(s.href), n = a();
      return { type: "link", next: c, prev: n };
    }
  } else
    return { type: "noop" };
}
function y(e) {
  var t = new DOMParser();
  return t.parseFromString(e, "text/html");
}
function l(e) {
  document.body.innerHTML = e.body.innerHTML;
}
function b(e) {
  const t = document.head, r = Array.from(document.head.children), o = Array.from(e.head.children), s = o.filter(
    (n) => !r.find((i) => i.isEqualNode(n))
  );
  r.filter(
    (n) => !o.find((i) => i.isEqualNode(n))
  ).forEach((n) => {
    n.getAttribute("rel") !== "prefetch" && n.remove();
  }), s.forEach((n) => {
    t.appendChild(n);
  });
}
function d() {
  Array.from(
    document.head.querySelectorAll("[data-reload]")
  ).forEach(h), Array.from(document.body.querySelectorAll("script")).forEach(h);
}
async function h(e) {
  const t = document.createElement("script"), r = Array.from(e.attributes);
  for (const { name: o, value: s } of r)
    t.setAttribute(o, s);
  t.appendChild(document.createTextNode(e.innerHTML)), e.parentNode.replaceChild(t, e);
}
const E = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class v {
  constructor(t) {
    this.opts = t, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...E, ...t }, window != null && window.history ? (document.addEventListener("click", (r) => this.onClick(r)), window.addEventListener("popstate", (r) => this.onPop(r)), this.prefetch()) : (console.warn(
      "flamethrower router not supported in this browser or environment"
    ), this.enabled = !1);
  }
  go(t) {
    const r = window.location.href, o = new URL(t, location.origin).href;
    return this.reconstructDOM({ type: "go", next: o, prev: r });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  log(...t) {
    this.opts.log && console.log(...t);
  }
  prefetch() {
    const t = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    };
    this.opts.prefetch && "IntersectionObserver" in window && (this.observer || (this.observer = new IntersectionObserver((o, s) => {
      o.forEach((c) => {
        const n = c.target.getAttribute("href");
        if (this.prefetched.has(n)) {
          s.unobserve(c.target);
          return;
        }
        if (c.isIntersecting) {
          const i = document.createElement("link");
          i.rel = "prefetch", i.href = n, i.as = "document", i.onload = () => this.log("\u{1F329}\uFE0F prefetched", n), i.onerror = (u) => this.log("\u{1F915} can't prefetch", n, u), document.head.appendChild(i), this.prefetched.add(n), s.unobserve(c.target);
        }
      });
    }, t)), Array.from(document.links).filter(
      (o) => o.href.includes(document.location.origin) && !o.href.includes("#") && o.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(o.href)
    ).forEach((o) => this.observer.observe(o)));
  }
  onClick(t) {
    this.reconstructDOM(g(t));
  }
  onPop(t) {
    this.reconstructDOM(m());
  }
  async reconstructDOM({ type: t, next: r, prev: o }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", t), ["popstate", "link", "go"].includes(t) && r !== o) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch")), p(r);
        const c = await (await fetch(r)).text(), n = y(c);
        b(n), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          l(n), d();
        }) : (l(n), d()), f(t), window.dispatchEvent(new CustomEvent("router:end")), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (s) {
      return window.dispatchEvent(new CustomEvent("router:error", s)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", s), !1;
    }
  }
}
const k = (e) => {
  const t = new v(e);
  return e.log && console.log("\u{1F525} flamethrower engaged"), window && (window.flamethrower = t), t;
};
export {
  k as default
};

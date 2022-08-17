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
  for (var o = t.target; o.parentNode; o = o.parentNode)
    if (o.nodeName === "A") {
      e = o;
      break;
    }
  if (e && e.host !== location.host)
    return e.target = "_blank", { type: "external" };
  if (e && "cold" in (e == null ? void 0 : e.dataset))
    return { type: "disqualified" };
  if (e != null && e.hasAttribute("href")) {
    const n = e.getAttribute("href"), i = new URL(n, location.href);
    if (t.preventDefault(), n != null && n.startsWith("#"))
      return w(n), { type: "scrolled" };
    {
      const c = a(i.href), r = a();
      return { type: "link", next: c, prev: r };
    }
  } else
    return { type: "noop" };
}
function b(t) {
  var e = new DOMParser();
  return e.parseFromString(t, "text/html");
}
function l(t) {
  document.body.innerHTML = t.body.innerHTML;
}
function y(t) {
  const e = document.head, o = Array.from(document.head.children), n = Array.from(t.head.children), i = n.filter(
    (r) => !o.find((s) => s.isEqualNode(r))
  );
  o.filter(
    (r) => !n.find((s) => s.isEqualNode(r))
  ).forEach((r) => {
    r.getAttribute("rel") !== "prefetch" && r.remove();
  }), i.forEach((r) => {
    e.appendChild(r);
  });
}
function h() {
  Array.from(
    document.head.querySelectorAll("[data-reload]")
  ).forEach(u), Array.from(document.body.querySelectorAll("script")).forEach(u);
}
async function u(t) {
  const e = document.createElement("script"), o = Array.from(t.attributes);
  for (const { name: n, value: i } of o)
    e.setAttribute(n, i);
  e.appendChild(document.createTextNode(t.innerHTML)), t.parentNode.replaceChild(e, t);
}
const v = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class E {
  constructor(e) {
    this.opts = e, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...v, ...e }, window != null && window.history ? (document.addEventListener("click", (o) => this.onClick(o)), window.addEventListener("popstate", (o) => this.onPop(o)), this.prefetch(), this.announcePageChanged()) : (console.warn("flamethrower router not supported in this browser or environment"), this.enabled = !1);
  }
  go(e) {
    const o = window.location.href, n = new URL(e, location.origin).href;
    return this.reconstructDOM({ type: "go", next: n, prev: o });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  log(...e) {
    this.opts.log && console.log(...e);
  }
  prefetch() {
    const e = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    };
    this.opts.prefetch && "IntersectionObserver" in window && (this.observer || (this.observer = new IntersectionObserver((n, i) => {
      n.forEach((c) => {
        const r = c.target.getAttribute("href");
        if (this.prefetched.has(r)) {
          i.unobserve(c.target);
          return;
        }
        if (c.isIntersecting) {
          const s = document.createElement("link");
          s.rel = "prefetch", s.href = r, s.as = "document", s.onload = () => this.log("\u{1F329}\uFE0F prefetched", r), s.onerror = (d) => this.log("\u{1F915} can't prefetch", r, d), document.head.appendChild(s), this.prefetched.add(r), i.unobserve(c.target);
        }
      });
    }, e)), Array.from(document.links).filter(
      (n) => n.href.includes(document.location.origin) && !n.href.includes("#") && n.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(n.href)
    ).forEach((n) => this.observer.observe(n)));
  }
  onClick(e) {
    this.reconstructDOM(g(e));
  }
  onPop(e) {
    this.reconstructDOM(m());
  }
  async reconstructDOM({ type: e, next: o, prev: n }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", e), ["popstate", "link", "go"].includes(e) && o !== n) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch")), p(o);
        const c = await (await fetch(o)).text(), r = b(c);
        y(r), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          l(r), h();
        }) : (l(r), h()), f(e), window.dispatchEvent(new CustomEvent("router:end")), this.announcePageChanged(), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (i) {
      return window.dispatchEvent(new CustomEvent("router:error", i)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", i), !1;
    }
  }
  announcePageChanged() {
    this.announcer || (this.announcer = document.createElement("div"), this.announcer.setAttribute("id", "flamethrower-announcer"), this.announcer.setAttribute("aria-live", "assertive"), this.announcer.setAttribute("aria-atomic", "true"), this.announcer.setAttribute(
      "style",
      "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"
    )), this.announcer.textContent = document.title, document.body.appendChild(this.announcer);
  }
}
const A = (t) => {
  const e = new E(t);
  return t.log && console.log("\u{1F525} flamethrower engaged"), window && (window.flamethrower = e), e;
};
export {
  A as default
};

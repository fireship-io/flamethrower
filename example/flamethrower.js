function w(e) {
  ["link", "go"].includes(e) && window.scrollTo({ top: 0 });
}
function d(e) {
  const t = new URL(e || window.location.href).href;
  return t.endsWith("/") ? t : `${t}/`;
}
function m(e) {
  (!window.history.state || window.history.state.url !== e) && window.history.pushState({ url: e }, "internalLink", e);
}
function g(e) {
  document.querySelector(e).scrollIntoView({ behavior: "smooth", block: "start" });
}
function y(e) {
  const t = d();
  return { type: "popstate", next: t };
}
function b(e) {
  let t;
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return { type: "disqualified" };
  for (var n = e.target; n.parentNode; n = n.parentNode)
    if (n.nodeName === "A") {
      t = n;
      break;
    }
  if (t && t.host !== location.host)
    return t.target = "_blank", { type: "external" };
  if (t && "cold" in (t == null ? void 0 : t.dataset))
    return { type: "disqualified" };
  if (t != null && t.hasAttribute("href")) {
    const o = t.getAttribute("href"), s = new URL(o, location.href);
    if (e.preventDefault(), o != null && o.startsWith("#"))
      return g(o), { type: "scrolled" };
    {
      const i = d(s.href), r = d();
      return { type: "link", next: i, prev: r };
    }
  } else
    return { type: "noop" };
}
function E(e) {
  return new DOMParser().parseFromString(e, "text/html");
}
function h(e) {
  document.body.replaceWith(e.body);
}
function v(e) {
  const t = (r) => Array.from(r.querySelectorAll('head>:not([rel="prefetch"]')), n = t(document), o = t(e), { staleNodes: s, freshNodes: i } = k(n, o);
  s.forEach((r) => r.remove()), document.head.append(...i);
}
function k(e, t) {
  const n = [], o = [];
  let s = 0, i = 0;
  for (; s < e.length && i < t.length; ) {
    const r = e[s], c = t[i];
    if (r.isEqualNode(c)) {
      s++, i++;
      continue;
    }
    const a = o.findIndex((l) => l.isEqualNode(r));
    if (a !== -1) {
      o.splice(a, 1), s++;
      continue;
    }
    const u = n.findIndex((l) => l.isEqualNode(c));
    if (u !== -1) {
      n.splice(u, 1), i++;
      continue;
    }
    r && n.push(r), c && o.push(c), s++, i++;
  }
  return { staleNodes: n, freshNodes: o };
}
function f() {
  document.head.querySelectorAll("[data-reload]").forEach(p), document.body.querySelectorAll("script").forEach(p);
}
function p(e) {
  const t = document.createElement("script"), n = Array.from(e.attributes);
  for (const { name: o, value: s } of n)
    t[o] = s;
  t.append(e.textContent), e.replaceWith(t);
}
const F = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class S {
  constructor(t) {
    this.opts = t, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...F, ...t }, window != null && window.history ? (document.addEventListener("click", (n) => this.onClick(n)), window.addEventListener("popstate", (n) => this.onPop(n)), this.prefetch()) : (console.warn(
      "flamethrower router not supported in this browser or environment"
    ), this.enabled = !1);
  }
  go(t) {
    const n = window.location.href, o = new URL(t, location.origin).href;
    return this.reconstructDOM({ type: "go", next: o, prev: n });
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
      o.forEach((i) => {
        const r = i.target.getAttribute("href");
        if (this.prefetched.has(r)) {
          s.unobserve(i.target);
          return;
        }
        if (i.isIntersecting) {
          const c = document.createElement("link");
          c.rel = "prefetch", c.href = r, c.as = "document", c.onload = () => this.log("\u{1F329}\uFE0F prefetched", r), c.onerror = (a) => this.log("\u{1F915} can't prefetch", r, a), document.head.appendChild(c), this.prefetched.add(r), s.unobserve(i.target);
        }
      });
    }, t)), Array.from(document.links).filter(
      (o) => o.href.includes(document.location.origin) && !o.href.includes("#") && o.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(o.href)
    ).forEach((o) => this.observer.observe(o)));
  }
  onClick(t) {
    this.reconstructDOM(b(t));
  }
  onPop(t) {
    this.reconstructDOM(y());
  }
  async reconstructDOM({ type: t, next: n, prev: o }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", t), ["popstate", "link", "go"].includes(t) && n !== o) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch")), m(n);
        const i = await (await fetch(n)).text(), r = E(i);
        v(r), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          h(r), f();
        }) : (h(r), f()), w(t), window.dispatchEvent(new CustomEvent("router:end")), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (s) {
      return window.dispatchEvent(new CustomEvent("router:error", s)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", s), !1;
    }
  }
}
const x = (e) => {
  const t = new S(e);
  return e.log && console.log("\u{1F525} flamethrower engaged"), window && (window.flamethrower = t), t;
};
export {
  x as default
};

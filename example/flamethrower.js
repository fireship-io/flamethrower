function u(e) {
  ["link", "go"].includes(e) && window.scrollTo({ top: 0 });
}
function c(e) {
  const t = new URL(e || window.location.href).href;
  return t.endsWith("/") ? t : `${t}/`;
}
function h(e) {
  (!window.history.state || window.history.state.url !== e) && window.history.pushState({ url: e }, "internalLink", e);
}
function f(e) {
  document.querySelector(e).scrollIntoView({ behavior: "smooth", block: "start" });
}
function p(e) {
  const t = c();
  return { type: "popstate", next: t };
}
function w(e) {
  let t;
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return { type: "disqualified" };
  for (var o = e.target; o.parentNode; o = o.parentNode)
    if (o.nodeName === "A") {
      t = o;
      break;
    }
  if (t && t.host !== location.host)
    return t.target = "_blank", { type: "external" };
  if (t && "cold" in (t == null ? void 0 : t.dataset))
    return { type: "disqualified" };
  if (t != null && t.hasAttribute("href")) {
    const n = t.getAttribute("href"), r = new URL(n, location.origin);
    if (e.preventDefault(), n != null && n.startsWith("#"))
      return f(n), { type: "scrolled" };
    {
      const s = c(r.href), i = c();
      return { type: "link", next: s, prev: i };
    }
  } else
    return { type: "noop" };
}
function m(e) {
  var t = new DOMParser();
  return t.parseFromString(e, "text/html");
}
function a(e) {
  document.body.innerHTML = e.body.innerHTML;
}
function y(e) {
  const t = document.head;
  t.querySelectorAll('link[rel="prefetch"]').forEach((n) => e.head.appendChild(n)), t.innerHTML = e.head.innerHTML;
}
function l() {
  Array.from(
    document.head.querySelectorAll("[data-reload]")
  ).forEach(d), Array.from(document.body.querySelectorAll("script")).forEach(d);
}
async function d(e) {
  const t = document.createElement("script"), o = Array.from(e.attributes);
  for (const { name: n, value: r } of o)
    t.setAttribute(n, r);
  t.appendChild(document.createTextNode(e.innerHTML)), e.parentNode.replaceChild(t, e);
}
const g = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class E {
  constructor(t) {
    this.opts = t, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...g, ...t }, window != null && window.history ? (document.addEventListener("click", (o) => this.onClick(o)), window.addEventListener("popstate", (o) => this.onPop(o))) : console.warn(
      "flamethrower router not supported in this browser or environment"
    ), this.prefetch();
  }
  go(t) {
    const o = window.location.href, n = new URL(t, location.origin).href;
    return this.reconstructDOM({ type: "go", next: n, prev: o });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  log(...t) {
    console.log(...t);
  }
  prefetch() {
    this.opts.prefetch && Array.from(document.links).map((o) => o.href).filter(
      (o) => o.includes(document.location.origin) && !o.includes("#") && o !== (document.location.href || document.location.href + "/") && !this.prefetched.has(o)
    ).forEach((o) => {
      const n = document.createElement("link");
      n.rel = "prefetch", n.href = o, n.onload = () => this.log("\u{1F329}\uFE0F prefetched", o), n.onerror = (r) => this.log("\u{1F915} can't prefetch", o, r), document.head.appendChild(n), this.prefetched.add(o);
    });
  }
  onClick(t) {
    this.reconstructDOM(w(t));
  }
  onPop(t) {
    this.reconstructDOM(p());
  }
  async reconstructDOM({ type: t, next: o, prev: n }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", t), ["popstate", "link", "go"].includes(t) && o !== n) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch")), h(o);
        const s = await (await fetch(o)).text(), i = m(s);
        y(i), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          a(i), l();
        }) : (a(i), l()), u(t), window.dispatchEvent(new CustomEvent("router:end")), this.prefetch(), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (r) {
      return window.dispatchEvent(new CustomEvent("router:error", r)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", r), !1;
    }
  }
}
const b = (e) => {
  const t = new E(e);
  return e.log && console.log("\u{1F525} flamethrower engaged"), window && (window.flamethrower = t), t;
};
export {
  b as default
};

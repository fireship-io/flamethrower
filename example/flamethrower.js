function h(t) {
  ["link", "go"].includes(t) && window.scrollTo({ top: 0 });
}
function c(t) {
  const e = new URL(t || window.location.href).href;
  return e.endsWith("/") ? e : `${e}/`;
}
function l(t) {
  (!window.history.state || window.history.state.url !== t) && window.history.pushState({ url: t }, "internalLink", t);
}
function u(t) {
  document.querySelector(t).scrollIntoView({ behavior: "smooth", block: "start" });
}
function f(t) {
  const e = c();
  return l(e), { type: "popstate", next: e };
}
function p(t) {
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
  if (e && e.hasAttribute("href")) {
    const n = e.getAttribute("href"), r = new URL(n, location.origin);
    if (t.preventDefault(), n && n.startsWith("#"))
      return u(n), { type: "scrolled" };
    {
      const s = c(r.href), i = c();
      return l(s), { type: "link", next: s, prev: i };
    }
  } else
    return { type: "noop" };
}
function d(t) {
  const e = document.createElement("script"), o = Array.from(t.attributes);
  for (const { name: n, value: r } of o)
    e.setAttribute(n, r);
  e.appendChild(document.createTextNode(t.innerHTML)), t.parentNode.replaceChild(e, t);
}
function m(t) {
  var e = new DOMParser();
  return e.parseFromString(t, "text/html");
}
function a(t) {
  document.body.innerHTML = t.body.innerHTML, Array.from(document.body.querySelectorAll("script")).forEach(d);
}
function w(t) {
  const e = document.head;
  e.querySelectorAll('link[rel="prefetch"]').forEach((r) => t.head.appendChild(r)), e.innerHTML = t.head.innerHTML, Array.from(e.querySelectorAll("[data-reload]")).forEach(d);
}
const y = {
  log: !1,
  prefetch: !0,
  pageTransitions: !1
};
class g {
  constructor(e) {
    this.opts = e, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts = { ...y, ...e }, window.history ? (document.addEventListener("click", (o) => this.onClick(o)), window.addEventListener("popstate", (o) => this.onPop(o))) : console.warn("flamethrower router not supported by browser"), this.prefetch();
  }
  go(e) {
    const o = window.location.href, n = new URL(e, location.origin).href;
    return this.replaceDOM({ type: "go", next: n, prev: o });
  }
  disable() {
    this.enabled = !1;
  }
  prefetch() {
    Array.from(document.links).map((o) => o.href).filter(
      (o) => o.includes(document.location.origin) && !o.includes("#") && o !== (document.location.href || document.location.href + "/") && !this.prefetched.has(o)
    ).forEach((o) => {
      const n = document.createElement("link");
      n.rel = "prefetch", n.href = o, n.onload = () => this.opts.log && console.log("\u{1F329}\uFE0F prefetched", o), n.onerror = () => this.opts.log && console.error("\u{1F915} can't prefetch", o), document.head.appendChild(n), this.prefetched.add(o);
    });
  }
  onClick(e) {
    this.enabled && this.replaceDOM(p(e));
  }
  onPop(e) {
    this.enabled && this.replaceDOM(f());
  }
  async replaceDOM({ type: e, next: o, prev: n }) {
    try {
      if (this.opts.log && console.log("\u26A1", e), ["popstate", "link", "go"].includes(e) && o !== n) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("router:fetch"));
        const s = await (await fetch(o)).text(), i = m(s);
        w(i), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => a(i)) : a(i), h(e), window.dispatchEvent(new CustomEvent("router:end")), this.prefetch(), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (r) {
      return window.dispatchEvent(new CustomEvent("router:error", r)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", r), !1;
    }
  }
}
const b = (t) => {
  const e = new g(t);
  return t.log && console.log("\u{1F525} flamethrower engaged"), e;
};
export {
  b as default
};

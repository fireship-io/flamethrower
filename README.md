
# Flamethrower 🔥

Status: Meme

An 2kB zero-config router and prefetcher that makes static sites feel like a blazingly fast SPA.

## Why?

**Problem** Static sites feel slow and cannot easily share state between pages. This makes it hard to create a good UX with JavaScript libraries because each new page needs to reboot your JS from scratch.

The goal is to make route changes on static sites feel faster, like an SPA, without the need for a frontend framework to take over the entire DOM. 

## How?

1. It tells the browser to prefetch visible links in the current page with `IntersectionObserver`.
2. Intercepts click and popstate events, then updates the HTML5 history on route changes.  
3. Uses `fetch` to get the next page, swaps the `<body>` out, merges the `<head>`, but does not re-exectute head scripts (unless asked to). 

This means you can have long-lived JavaScript behaviors between navigations. It works especially well with native web components. 

## QuickStart

```
npm i flamethrower-router
```

```js
import flamethrower from 'flamethrower';
const router = flamethrower();
```

That's it. Your site now feels blazingly fast.


## Advanced Usage

```js
// with opts 
const router = flamethrower({ prefetch: true, log: false, pageTransitions: false });

// Navigate manually
router.go('/somewhere');
router.back();
router.forward();

// Listen to events
window.addEventListener('router:fetch', showLoader);
window.addEventListener('router:end', hideLoader);

// Disable it
router.enabled = false;
```

Opt-out of specific links for full page load. 

```html
<a href="/somewhere" data-cold></a>
```

Scripts in `<body>` will run on every page change, but you can force scripts in the `<head>` to run:

```html
<script src="..." data-reload></script>
```

### Misc

**Supported in all browsers?** Yes. It will fallback to standard navigation if `window.history` does not exist. 

**Does it work with Next.js?** No, any framework that fully hydrates to an SPA does not need this - you already have a client-side router. 

**Does it work with Astro** I think so. It can share state between routes, but partially hydrated components may flash between routes.

**Other things to know:**

- `<head>` scripts run only on the first page load. `<body>` scripts will still run on every page change (by design). 
- It's a good idea to show a global loading bar in case of a slow page load.
- This library is inspired by [Turbo](https://github.com/hotwired/turbo) Drive. 
- This project is experimental. 

# Flamethrower 🔥

Status: Meme

An 1.5kB zero-config router and prefetcher that makes static sites feel like a blazingly fast SPA.

## Why?

**Problem** Static sites cannot easily share state between pages. This makes it hard to create a good UX with JavaScript libraries because each new page needs to reboot your JS from scratch.

## How?

1. It tells the browser to prefetch links in the current page.
2. Intercepts click and popstate events, then updates the HTML5 history on route changes.  
3. Uses `fetch` to get the next page, swaps the `<body>` out, merges the `<head>`, but does not re-exectute head scripts (unless asked to). 

This means you can have long-lived JavaScript behaviors between navigations. It works especially well with native web components. 

## QuickStart

```
npm i flamethrower
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

Force scripts in the head to run.

```html
<script src="..." data-reload></script>
```

If using Google Analytics, events will need to be sent manually, i.e:

```js
window.addEventListener('router:end', (e) => {
    const page_path = new URL(window.history.state['url']).pathname;
    gtag('config', 'UA-YOUR_ID', { page_path });
});
```

### Misc

**Supported in all browsers?** Yes. It will fallback to standard naviation if `window.history` does not exist. 

**Does it work with Next.js?** No, any framework that fully hydrates to an SPA does not need this - you already have a client-side router. 

**Does it work with Astro** I think so. It can share state between routes, but partially hydrated components may flash between routes.

**Other things to know:**

- `<head>` scripts run only on the first page load. `<body>` scripts will still run on every page change (by design). 
- It's a good idea to show a global loading bar in case of a slow page load.
- This library is inspired by [Turbo](https://github.com/hotwired/turbo) Drive, just much lighter. 
- Google analytics will not be updated on page change, you'll need to listen to `router:end` and send the GA event manually.
- This project is experimental. 
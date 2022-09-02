# Flamethrower 🔥

Status: Meme

A 2kB zero-config router and prefetcher that makes a static site feel like a blazingly fast SPA.

## Why?

**Problem:** Static sites feel slow and cannot easily share state between pages. This makes it difficult to create a pleasant user experience (UX) with JavaScript libraries because each new page needs to reboot your JS from scratch.

Rather than requiring a frontend framework to take control of the entire DOM, the goal is to make route changes on static sites feel faster, like a SPA.

## How?

1. It tells the browser to prefetch visible links in the current page with `IntersectionObserver`.
2. Intercepts click and popstate events, then updates the HTML5 history on route changes.
3. Uses `fetch` to get the next page, swaps the `<body>` out, merges the `<head>`, but does not re-execute head scripts (unless asked to).

This means you can have long-lived JavaScript behaviors between navigations. It works especially well with native web components.

## QuickStart

```
npm i flamethrower-router
```

```js
import flamethrower from 'flamethrower-router';
const router = flamethrower();
```

That's it. Your site now feels blazingly fast.

## Advanced Usage

```js
// with opts
const router = flamethrower({ prefetch: 'visible', log: false, pageTransitions: false });

// Navigate manually
router.go('/somewhere');
router.back();
router.forward();

// Listen to events
window.addEventListener('flamethrower:router:fetch', showLoader);
window.addEventListener('flamethrower:router:fetch-progress', updateProgressBar);
window.addEventListener('flamethrower:router:end', hideLoader);

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

The fetch-progress event is a custom event, so usage will look something like this:
```js
window.addEventListener('flamethrower:router:fetch-progress', ({ detail }) => {
	const progressBar = document.getElementById('progress-bar');
	// progress & length will be 0 if there is no Content-Length header
	const bytesReceived = detail.received; // number
	const length = detail.length; // number
	progressBar.style.width = detail.progress + '%';
});
```

### Prefetching

Prefecthing is disabled by default.

- `visible`: prefetch visible links on the page with IntersectionObserver
- `hover`: prefetch links on hover

```js
const router = flamethrower({ prefetch: 'visible' });
```

### Misc

**Supported in all browsers?** Yes. It will fallback to standard navigation if `window.history` does not exist.

**Does it work with Next.js?** No, any framework that fully hydrates to an SPA does not need this - you already have a client-side router.

**Does it work with Astro?** I think so. It can share state between routes, but partially hydrated components may flash between routes.

**Other things to know:**

- `<head>` scripts run only on the first page load. `<body>` scripts will still run on every page change (by design).
- It's a good idea to show a global loading bar in case of a slow page load.
- This library is inspired by [Turbo](https://github.com/hotwired/turbo) Drive.
- This project is experimental.

### Contributing

Build it:

```
npm run dev
```

Serve the example:

```
npm run serve
```

Make sure all playwright tests pass before submitting new features.

```
npm run test
```

### Deploying

You can deploy Flamethrower to [Vercel](http://vercel.com/) as follows:

```
npm run deploy
```

This uses the [Build Output API](https://vercel.com/docs/build-output-api/v3) and the [Vercel CLI](https://vercel.com/cli) to deploy the `/example` folder.

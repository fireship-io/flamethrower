# Flamethrower documentation

Welcome to the Flamethrower documentation!

## BEFORE WE START

This project is still in meme status! We don't recommend you to use it for production until it becomes fairly stable. Thanks!

## About.

If you prefer a video explanation, feel free to check out this [video](https://www.youtube.com/watch?v=SJeBRW1QQMA).

Flamethrower is a 2kB zero-config router and prefetcher that makes a static site feel like a blazingly fast SPA.

## Why?

**Problem**: Static sites feel slow and cannot easily share state between pages. This makes it difficult to create a pleasant user experience (UX) with JavaScript libraries because each new page needs to reboot your JS from scratch.

Rather than requiring a frontend framework to take control of the entire DOM, the goal is to make route changes on static sites feel faster, like an SPA.

## Installation

```bash
npm i flamethrower-router
```

## Quickstart

```js
import flamethrower from 'flamethrower-router';
const router = flamethrower();
```

That's it. Your site now feels blazingly fast.
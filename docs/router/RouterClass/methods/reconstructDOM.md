# reconstructDOM method

```js
private async reconstructDOM({ type, next, prev, scrollId }: RouteChangeData): Promise<boolean> {}
```

Main process for reconstructing the DOM

Takes `type`, `next`, `prev` and `scrollId` object as arguments with `RouteChangeData` type and returns type `Promise<boolean>`. Is private. Is async.

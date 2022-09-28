/**
 * dispatchEvent
 * @param event The event name to dispatch
 * @param data The data to be send with the event
 * @param prefix The perfix of the event
 * @returns boolean
 */
export function dispatchEvent<T extends unknown>(event: string, data?: T, prefix: string = "flamethrower"): boolean {
  return window.dispatchEvent(new CustomEvent(`${prefix}:${event}`, data));
}


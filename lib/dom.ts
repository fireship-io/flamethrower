/**
 * @param  {string} html
 * Convert an HTML string to new Document
 */
export function formatNextDocument(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

/**
 * @param  {Document} nextDoc
 * Replace Body
 */
export function replaceBody(nextDoc: Document): void {
  document.body.replaceWith(nextDoc.body);
}

/**
 * @param  {Document} nextDoc
 * Merge new head data
 */
export function mergeHead(nextDoc: Document): void {
  // Update head
  // Head elements that changed on next document
  // TODO make this algo more efficient
  const old = Array.from(document.querySelectorAll('head>:not([rel="prefetch"]'));
  const next = Array.from(nextDoc.head.children);
  const freshNodes = next.filter((newNode) => !old.find((oldNode) => oldNode.isEqualNode(newNode)));
  const staleNodes = old.filter((oldNode) => !next.find((newNode) => newNode.isEqualNode(oldNode)));

  staleNodes.forEach((node) => node.remove());

  document.head.append(...freshNodes);
}

/**
 * Runs JS in the fetched document
 * head scripts will only run with data-reload attr
 * all body scripts will run
 */
export function runScripts(): void {
  // Run scripts with data-reload attr
  const headScripts = document.head.querySelectorAll('[data-reload]');
  headScripts.forEach(replaceAndRunScript);

  // Run scripts in body
  const bodyScripts = document.body.querySelectorAll('script');
  bodyScripts.forEach(replaceAndRunScript);
}

// Private helper to re-execute scripts
function replaceAndRunScript(oldScript: HTMLScriptElement): void {
  const newScript = document.createElement('script');
  const attrs = Array.from(oldScript.attributes);
  for (const { name, value } of attrs) {
    newScript[name] = value;
  }
  newScript.append(oldScript.textContent);
  oldScript.replaceWith(newScript);
}

/**
 * @param  {string} html
 * Convert an HTML string to new Document
 */
export function formatNextDocument(html: string) {
  var parser = new DOMParser();
  const nextDoc = parser.parseFromString(html, 'text/html');
  return nextDoc;
}

/**
 * @param  {Document} nextDoc
 * Replace Body
 */
export function replaceBody(nextDoc: Document) {
  // document.body.replaceWith(nextDoc.body);
  document.body.innerHTML = nextDoc.body.innerHTML;
}

/**
 * @param  {Document} nextDoc
 * Merge new head data
 */
export function mergeHead(nextDoc: Document) {
  const currentHead = document.head;

  // Update head
  // Head elements that changed on next document
  // TODO make this algo more efficient
  const old = Array.from(document.head.children);
  const next = Array.from(nextDoc.head.children);
  const freshNodes = next.filter(
    (newNode) => !old.find((oldNode) => oldNode.isEqualNode(newNode))
  );
  const staleNodes = old.filter(
    (oldNode) => !next.find((newNode) => newNode.isEqualNode(oldNode))
  );

  staleNodes.forEach((node) => {
    if (node.getAttribute('rel') === 'prefetch') {
      return;
    }
    node.remove();
  });

  freshNodes.forEach((node) => {
    currentHead.appendChild(node);
  });
}

/**
 * Runs JS in the fetched document
 * head scripts will only run with data-reload attr
 * all body scripts will run
 */
export function runScripts() {
  // Run scripts with data-reload attr
  const headScripts = Array.from(
    document.head.querySelectorAll('[data-reload]')
  );
  headScripts.forEach(replaceAndRunScript);

  // Run scripts in body
  const bodyScripts = Array.from(document.body.querySelectorAll('script'));
  bodyScripts.forEach(replaceAndRunScript);
}

// Private helper to re-execute scripts
async function replaceAndRunScript(oldScript: HTMLScriptElement) {
  const newScript = document.createElement('script');
  const attrs = Array.from(oldScript.attributes);
  for (const { name, value } of attrs) {
    newScript.setAttribute(name, value);
  }
  newScript.appendChild(document.createTextNode(oldScript.innerHTML));
  oldScript.parentNode.replaceChild(newScript, oldScript);
}

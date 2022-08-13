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

  // Prevent duplicate prefetching
  const prefetched = currentHead.querySelectorAll('link[rel="prefetch"]');
  prefetched.forEach((l) => nextDoc.head.appendChild(l));

  // Update head
  currentHead.innerHTML = nextDoc.head.innerHTML;
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

// Private helper to reexecute scripts
async function replaceAndRunScript(oldScript: HTMLScriptElement) {
  const newScript = document.createElement('script');
  const attrs = Array.from(oldScript.attributes);
  for (const { name, value } of attrs) {
    newScript.setAttribute(name, value);
  }
  newScript.appendChild(document.createTextNode(oldScript.innerHTML));
  oldScript.parentNode.replaceChild(newScript, oldScript);
}

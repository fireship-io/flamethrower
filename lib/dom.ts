/**
 * @param  {string} html
 * Convert any HTML string to new Document
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
  const nodesToPreserve = document.body.querySelectorAll('[flamethrower-preserve]');
  nodesToPreserve.forEach((oldDocElement) => {
    let nextDocElement = nextDoc.body.querySelector('[flamethrower-preserve][id="' + oldDocElement.id + '"]');
    if (nextDocElement) {
      const clone = oldDocElement.cloneNode(true);
      nextDocElement.replaceWith(clone);
    }
  });

  document.body.replaceWith(nextDoc.body);
}

/**
 * @param  {Document} nextDoc
 * Merge new head data
 */
export function mergeHead(nextDoc: Document): void {
  // Update head
  // Head elements that changed on next document
  const getValidNodes = (doc: Document): Element[] => Array.from(doc.querySelectorAll('head>:not([rel="prefetch"]'));
  // Spc - Ofc, we simple;
  const { staleNodes, freshNodes } = partitionNodes(
    getValidNodes(document),
    getValidNodes(nextDoc)
  );

  staleNodes.forEach((node) => node.remove());

  document.head.append(...freshNodes);
}

// Spc - Move type above only use...
type PartitionedNodes = {
  freshNodes: Element[];
  staleNodes: Element[];
};

function partitionNodes(oldNodes: Element[], nextNodes: Element[]): PartitionedNodes {
  // Spc - Holy Jesus...
  const oldNodeSet = new Set(oldNodes);
  const nextNodeSet = new Set(nextNodes);

  const staleNodes = oldNodes.filter(node => !nextNodeSet.has(node));
  const freshNodes = nextNodes.filter(node => !oldNodeSet.has(node));

  return { staleNodes, freshNodes };
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

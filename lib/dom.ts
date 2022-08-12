// Helper to reexecute scripts
function replaceAndRunScript(oldScript: HTMLScriptElement) {
    const newScript = document.createElement('script');
    const attrs = Array.from(oldScript.attributes);
    for (const { name, value } of attrs) {
      newScript.setAttribute(name, value);
    }
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
}


// Convert a string to new Document
export function formatNextDocument(html: string) {
    var parser = new DOMParser();
    const nextDoc = parser.parseFromString(html, 'text/html');
    return nextDoc;
}  

// Replace Body
export function replaceBody(nextDoc: Document) {
  document.body.innerHTML = nextDoc.body.innerHTML;
  // Run scripts in body
  const oldScripts = Array.from(document.body.querySelectorAll('script'));
  oldScripts.forEach(replaceAndRunScript);
}

// Merge new head, run scripts
export function mergeHead(nextDoc: Document) {
  const currentHead = document.head;

  // Prevent duplicate prefetching
  const prefetched = currentHead.querySelectorAll('link[rel="prefetch"]');
  prefetched.forEach(l => nextDoc.head.appendChild(l));

  // Update head
  currentHead.innerHTML = nextDoc.head.innerHTML;

  // Run scripts with data-reload attr
  const oldScripts = Array.from(currentHead.querySelectorAll('[data-reload]'));
  oldScripts.forEach(replaceAndRunScript);

}

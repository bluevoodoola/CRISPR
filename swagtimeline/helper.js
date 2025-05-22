function createElement(tag, options = {}) {
  const { attributes = {}, classes = [], children = [], textContent } = options;
  const element = document.createElement(tag);

  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // Add classes
  if (classes.length) {
    element.classList.add(...classes);
  }

  // Add text content
  if (textContent) {
    element.textContent = textContent;
  }

  // Append child elements
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

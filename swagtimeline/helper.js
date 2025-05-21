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

function createAnomaly(accordion, handle, uniqueid, header, events, groups) {
    accordion
        .appendChild(createElement("h2", { attributes: { id: "h2#" + handle } }))
        .appendChild(createElement("a", { attributes: { id: "#" + uniqueid, href: "#" + uniqueid }, classes: [ "header" ], textContent: header }));
    accordion.appendChild(createElement("div", { attributes: { id: "vis" + uniqueid } }));

    const tml = new vis.Timeline(
        document.getElementById("vis" + uniqueid)
        , new vis.DataSet(events)
        , new vis.DataSet(groups)
        , {}
    );
}

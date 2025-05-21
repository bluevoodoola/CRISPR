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

function createAnomaly(accordion, anomaly) {
    accordion
        .appendChild(createElement("h2", { attributes: { id: "h2#" + anomaly.series.handle } }))
        .appendChild(createElement("a", { attributes: { id: "#" + anomaly.uniqueid, href: "#" + anomaly.uniqueid }, classes: [ "header" ], textContent: anomaly.header }));
    accordion.appendChild(createElement("div", { attributes: { id: "vis" + anomaly.uniqueid } }));

    const tml = new vis.Timeline(
        document.getElementById("vis" + anomaly.uniqueid)
        , new vis.DataSet(anomaly.schedule_swag.events)
        , new vis.DataSet(anomaly.schedule_swag.groups)
        , {}
    );
}

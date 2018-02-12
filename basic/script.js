import xs from "xstream";
import fromEvent from "xstream/extra/fromEvent";
import { run } from "@cycle/run";

function h(tagName, children) {
  return {
    tagName: tagName,
    children: children
  };
}

function h1(children) {
  return {
    tagName: "H1",
    children: children
  };
}

function span(children) {
  return {
    tagName: "SPAN",
    children: children
  };
}

const main = sources => {
  const click$ = sources.DOM.selectEvents("span", "click");
  return {
    DOM: click$
      .startWith(null)
      .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
      .flatten()
      .map(i => h1([span([`Seconds elapsed: ${i}`])])),
    log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
};

const makeDOMDriver = mountSelector => obj$ => {
  function createElement(obj) {
    const element = document.createElement(obj.tagName);
    obj.children.forEach(child => {
      if (typeof child === "object") {
        element.appendChild(createElement(child));
      } else {
        element.textContent = child;
      }
    });
    return element;
  }

  obj$.subscribe({
    next: obj => {
      const container = document.querySelector(mountSelector);
      container.textContent = "";
      const element = createElement(obj);
      container.appendChild(element);
    }
  });
  const domSource = {
    selectEvents: function(tagName, eventType) {
      return fromEvent(document, eventType).filter(
        ev => ev.target.tagName === tagName.toUpperCase()
      );
    }
  };
  return domSource;
};

const logDriver = msg$ => {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
};

const run = (mainFn, drivers) => {
  const fakeSinks = {};
  Object.keys(drivers).forEach(key => {
    fakeSinks[key] = xs.create();
  });

  const sources = {};
  Object.keys(drivers).forEach(key => {
    sources[key] = drivers[key](fakeSinks[key]);
  });

  const sinks = mainFn(sources);

  Object.keys(sinks).forEach(key => {
    fakeSinks[key].imitate(sinks[key]);
  });
};

run(main, {
  DOM: makeDOMDriver("#app"),
  log: logDriver
});

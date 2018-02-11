const main = sources => {
  const click$ = sources.DOM;
  return {
    DOM: click$
      .startWith(null)
      .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
      .flatten()
      .map(i => `Seconds elapsed: ${i}`),
    log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
};

const domDriver = text$ => {
  text$.subscribe({
    next: str => {
      const elem = document.querySelector("#app");
      elem.textContent = str;
    }
  });
  const domSource = xs.fromEvent(document, "click");
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
  DOM: domDriver,
  log: logDriver
});

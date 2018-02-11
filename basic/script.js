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
  const fakeDOMSink = xs.create();
  const domSource = domDriver(fakeDOMSink);
  const sinks = mainFn({ DOM: domSource });
  fakeDOMSink.imitate(sinks.DOM);
  /*Object.keys(drivers).forEach(key => {
    if (sinks[key]) {
      drivers[key](sinks[key]);
    }
  });*/
};

run(main, {
  DOM: domDriver,
  log: logDriver
});

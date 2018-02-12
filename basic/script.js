import xs from "xstream";
import fromEvent from "xstream/extra/fromEvent";
import { h, h1, span, makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";

const main = sources => {
  const click$ = sources.DOM.select("span").events("click");
  return {
    DOM: click$
      .startWith(null)
      .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
      .flatten()
      .map(i => h1([span([`Seconds elapsed: ${i}`])])),
    log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
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

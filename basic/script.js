import xs from "xstream";
import { button, p, label, div, makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";

const main = sources => {
  const decClick$ = sources.DOM.select(".dec").events("click");
  const incClick$ = sources.DOM.select(".inc").events("click");

  const dec$ = decClick$.map(() => -1);
  const inc$ = incClick$.map(() => +1);

  const delta$ = xs.merge(dec$, inc$);

  const number$ = delta$.fold((prev, x) => prev + x, 0);

  return {
    DOM: number$.map(number =>
      div([
        button(".dec", "Decrement"),
        button(".inc", "Increment"),
        p([label("Counr: " + number)])
      ])
    )
  };
};

const drivers = {
  DOM: makeDOMDriver("#app")
};

run(main, drivers);

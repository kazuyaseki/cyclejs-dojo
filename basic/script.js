import xs from "xstream";
import { button, p, label, div, makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run } from "@cycle/run";
import { html } from "snabbdom-jsx";

const main = sources => {
  return {
    DOM: vdom$
  };
};

const drivers = {
  DOM: makeDOMDriver("#app")
};

run(main, drivers);

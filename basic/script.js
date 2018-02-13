import xs from "xstream";
import fromEvent from "xstream/extra/fromEvent";
import { makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";

const main = sources => {
  return {};
};

run(main, {
  DOM: makeDOMDriver("#app")
});

import xs from "xstream";
import { button, p, label, div, makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run } from "@cycle/run";
import { html } from "snabbdom-jsx";

const main = sources => {
  const click$ = sources.DOM.select(".get-first").events("click");

  const request$ = click$.map(ev => ({
    url: "https://jsonplaceholder.typicode.com/users/1",
    method: "GET",
    category: "user-data"
  }));

  const response$ = sources.HTTP.select("user-data")
    .flatten()
    .map(res => res.body);

  const vdom$ = response$.startWith({}).map(response => (
    <div>
      <button className="get-first">Get the first User</button>
      <div className="user-details">
        <h1 className="user-name">{response.name}</h1>
        <h4 className="user-email">{response.email}</h4>
        <a className="user-website" href={response.website}>
          {response.website}
        </a>
      </div>
    </div>
  ));

  return {
    DOM: vdom$,
    HTTP: request$
  };
};

const drivers = {
  DOM: makeDOMDriver("#app"),
  HTTP: makeHTTPDriver()
};

run(main, drivers);

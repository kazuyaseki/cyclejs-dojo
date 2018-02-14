import xs from "xstream";
import { button, p, label, input, h2, div, makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run } from "@cycle/run";
import isolate from "@cycle/isolate";
import { html } from "snabbdom-jsx";

const intent = domSource => {
  const changeValue$ = domSource
    .select(".slider")
    .events("input")
    .map(ev => ev.target.value);

  return { changeValue$ };
};

const model = (actions, props$) => {
  const { changeValue$ } = actions;

  return props$
    .map(props => {
      return changeValue$.startWith(props.init).map(value => {
        return {
          value,
          label: props.label,
          unit: props.unit,
          max: props.max,
          min: props.min
        };
      });
    })
    .flatten();
};

const view = state$ => {
  return state$.map(state =>
    div(".labeled-slider", [
      label(".label", state.label + ": " + state.value + state.unit),
      input(".slider", {
        attrs: {
          type: "range",
          min: state.min,
          max: state.max,
          value: state.value
        }
      })
    ])
  );
};

const labeledSlider = sources => {
  const props$ = sources.props;
  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$
  };
};

const main = sources => {
  const weightProps$ = xs.of({
    label: "Weight",
    unit: "kg",
    min: 40,
    max: 150,
    init: 40
  });
  const weightSlider = isolate(labeledSlider, ".weight");
  const weightSinks = weightSlider({
    ...sources,
    props: weightProps$
  });

  const heightProps$ = xs.of({
    label: "Height",
    unit: "cm",
    min: 140,
    max: 220,
    init: 440
  });
  const heightSlider = isolate(labeledSlider, ".height");
  const heightSinks = heightSlider({
    ...sources,
    props: heightProps$
  });

  const vdom$ = xs
    .combine(weightSinks.DOM, heightSinks.DOM)
    .map(([weightVDOM, heightVDOM]) => div([weightVDOM, heightVDOM]));

  return {
    DOM: vdom$
  };
};

const drivers = {
  DOM: makeDOMDriver("#app")
};

run(main, drivers);

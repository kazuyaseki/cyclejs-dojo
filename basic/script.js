import xs from "xstream";
import { button, p, label, input, h2, div, makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run } from "@cycle/run";
import isolate from "@cycle/isolate";
import { html } from "snabbdom-jsx";

import { sliderSettings } from "./settings";

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
    .flatten()
    .remember();
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
    DOM: vdom$,
    value: state$.map(state => state.value)
  };
};

const main = sources => {
  const weightSlider = isolate(labeledSlider, ".weight");
  const weightSinks = weightSlider({
    ...sources,
    props: xs.of(sliderSettings.weight)
  });

  const heightSlider = isolate(labeledSlider, ".height");
  const heightSinks = heightSlider({
    ...sources,
    props: xs.of(sliderSettings.height)
  });

  const bmi$ = xs
    .combine(weightSinks.value, heightSinks.value)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    });

  const vdom$ = xs
    .combine(bmi$, weightSinks.DOM, heightSinks.DOM)
    .map(([bmi, weightVDOM, heightVDOM]) =>
      div([weightVDOM, heightVDOM, h2("BMI: " + bmi)])
    );

  return {
    DOM: vdom$
  };
};

const drivers = {
  DOM: makeDOMDriver("#app")
};

run(main, drivers);

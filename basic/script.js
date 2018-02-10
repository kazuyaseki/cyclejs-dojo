const main = () => {
  return {
    DOM: xs
      .periodic(1000)
      .fold(prev => prev + 1, 0)
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
};

const logDriver = msg$ => {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
};

const sink = main();
domDriver(sink.DOM);
logDriver(sink.log);

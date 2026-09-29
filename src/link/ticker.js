// The GBA frame clock (59.7275 Hz) for the link. It runs in a worker because
// browsers throttle timers in background tabs; a late tick is skipped, never
// made up with a burst the adapter would have to queue.

const WORKER_SOURCE = `
const PERIOD = 1000 / 59.7275;
let next = 0;
let timer = 0;
function loop() {
  const now = performance.now();
  if (now >= next) {
    postMessage(0);
    next += PERIOD;
    if (next <= now) next = now + PERIOD;
  }
  timer = setTimeout(loop, Math.max(0, next - performance.now()));
}
onmessage = (event) => {
  clearTimeout(timer);
  if (event.data === 'start') {
    next = performance.now() + PERIOD;
    loop();
  }
};
`;

export function startTicker(onTick) {
  if (typeof Worker !== 'undefined') {
    try {
      const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
      const worker = new Worker(url);
      worker.onmessage = () => onTick();
      worker.postMessage('start');
      return () => {
        worker.terminate();
        URL.revokeObjectURL(url);
      };
    } catch {
      // Fall back to the page's own timer.
    }
  }
  const timer = setInterval(onTick, 1000 / 59.7275);
  return () => clearInterval(timer);
}

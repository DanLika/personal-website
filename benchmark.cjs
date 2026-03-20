const { performance } = require('perf_hooks');

// Mocks
const window = {
    innerWidth: 1920,
    innerHeight: 1080
};

// Simplified RAF mock
let scheduledRaf = null;
const requestAnimationFrame = (cb) => {
    scheduledRaf = cb;
    return 1; // rafId
};
const executeRafs = () => {
    if (scheduledRaf) {
        scheduledRaf();
        scheduledRaf = null;
    }
};

const mouseRef = { current: { x: 0, y: 0 } };

// Baseline logic (as seen in BlogPage.tsx)
let rafId = null;
let lastUpdate = 0;
const THROTTLE_MS = 16;
let pendingX = 0;
let pendingY = 0;

const updatePosition = () => {
    rafId = null;
    lastUpdate = performance.now();
    mouseRef.current = { x: pendingX, y: pendingY };
};

const baselineHandleMouseMove = (e) => {
    pendingX = (e.clientX / window.innerWidth) * 2 - 1;
    pendingY = -((e.clientY / window.innerHeight) * 2 - 1);
    const now = performance.now();
    if (now - lastUpdate < THROTTLE_MS) {
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
        return;
    }
    lastUpdate = now;
    mouseRef.current = { x: pendingX, y: pendingY };
};

// Optimized logic
let optRafId = null;
let optPendingX = 0;
let optPendingY = 0;

const optimizedHandleMouseMove = (e) => {
    optPendingX = (e.clientX / window.innerWidth) * 2 - 1;
    optPendingY = -((e.clientY / window.innerHeight) * 2 - 1);

    if (!optRafId) {
        optRafId = requestAnimationFrame(() => {
            mouseRef.current = { x: optPendingX, y: optPendingY };
            optRafId = null;
        });
    }
};

// Benchmark
const RUNS = 1000000;
const EVENTS_PER_FRAME = 10; // Simulate 10 mouse move events per frame

function runBenchmark(name, handler) {
    const start = performance.now();

    for (let frame = 0; frame < RUNS / EVENTS_PER_FRAME; frame++) {
        // Simulate mouse moves during this frame
        for (let i = 0; i < EVENTS_PER_FRAME; i++) {
            handler({
                clientX: Math.random() * 1920,
                clientY: Math.random() * 1080
            });
        }

        // Execute RAF at the end of the frame (simulate browser rendering)
        executeRafs();

        // Advance time by 16.6ms (1 frame)
        // Since we are mocking performance.now() implicitly by running in a loop,
        // the original throttle code will evaluate based on real time.
        // To be fair, let's just let it run.
    }

    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)} ms`);
}

// Reset state
rafId = null;
lastUpdate = performance.now();
scheduledRaf = null;
runBenchmark('Baseline (THROTTLE_MS)', baselineHandleMouseMove);

// Reset state
optRafId = null;
scheduledRaf = null;
runBenchmark('Optimized (RAF only)', optimizedHandleMouseMove);

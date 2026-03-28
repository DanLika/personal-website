import { performance } from 'perf_hooks';

const DARK_ICONS_HIGH_ARRAY = ['resend', 'webflow', 'seo'];
const DARK_ICONS_LOW_ARRAY = ['figma', 'tailwind'];

const DARK_ICONS_HIGH_SET = new Set(['resend', 'webflow', 'seo']);
const DARK_ICONS_LOW_SET = new Set(['figma', 'tailwind']);

const testCases = ['resend', 'webflow', 'seo', 'figma', 'tailwind', 'react', 'node', 'typescript', 'mongodb', 'docker'];
const ITERATIONS = 1_000_000;

function benchmarkArray() {
  let count = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    for (const tech of testCases) {
      if (DARK_ICONS_HIGH_ARRAY.includes(tech) || DARK_ICONS_LOW_ARRAY.includes(tech)) {
        count++;
      }
    }
  }
  return count;
}

function benchmarkSet() {
  let count = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    for (const tech of testCases) {
      if (DARK_ICONS_HIGH_SET.has(tech) || DARK_ICONS_LOW_SET.has(tech)) {
        count++;
      }
    }
  }
  return count;
}

const startArray = performance.now();
benchmarkArray();
const endArray = performance.now();
const arrayTime = endArray - startArray;

const startSet = performance.now();
benchmarkSet();
const endSet = performance.now();
const setTime = endSet - startSet;

console.log(`Array.includes: ${arrayTime.toFixed(2)}ms`);
console.log(`Set.has: ${setTime.toFixed(2)}ms`);
console.log(`Improvement: ${(((arrayTime - setTime) / arrayTime) * 100).toFixed(2)}%`);

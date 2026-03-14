import { performance } from "perf_hooks";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
const text = "Hello World! This is a long text for performance testing. Let's make it even longer to see the impact of our optimizations.";

const useOriginalCharsOnly = true;

const availableChars = useOriginalCharsOnly
  ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
  : characters.split("");

const shuffleTextOld = (originalText: string, currentRevealed: Set<number>): string => {
  if (useOriginalCharsOnly) {
    const positions = originalText.split("").map((char, i) => ({
      char,
      isSpace: char === " ",
      index: i,
      isRevealed: currentRevealed.has(i),
    }));

    const nonSpaceChars = positions.filter((p) => !p.isSpace && !p.isRevealed).map((p) => p.char);

    for (let i = nonSpaceChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
    }

    let charIndex = 0;
    return positions
      .map((p) => {
        if (p.isSpace) return " ";
        if (p.isRevealed) return originalText[p.index];
        return nonSpaceChars[charIndex++];
      })
      .join("");
  } else {
    return originalText
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        if (currentRevealed.has(i)) return originalText[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      })
      .join("");
  }
};

const shuffleTextArray = (originalText: string, currentRevealed: Set<number>): string => {
  if (useOriginalCharsOnly) {
    const nonSpaceChars = [];
    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] !== " " && !currentRevealed.has(i)) {
        nonSpaceChars.push(originalText[i]);
      }
    }

    for (let i = nonSpaceChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = nonSpaceChars[i];
      nonSpaceChars[i] = nonSpaceChars[j];
      nonSpaceChars[j] = temp;
    }

    const result = new Array(originalText.length);
    let charIndex = 0;
    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === " ") {
        result[i] = " ";
      } else if (currentRevealed.has(i)) {
        result[i] = originalText[i];
      } else {
        result[i] = nonSpaceChars[charIndex++];
      }
    }
    return result.join("");
  } else {
    const result = new Array(originalText.length);
    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === " ") {
        result[i] = " ";
      } else if (currentRevealed.has(i)) {
        result[i] = originalText[i];
      } else {
        result[i] = availableChars[Math.floor(Math.random() * availableChars.length)];
      }
    }
    return result.join("");
  }
};

const revealed = new Set<number>();
for (let i = 0; i < 20; i++) {
  revealed.add(i);
}

const ITERATIONS = 10000;

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  shuffleTextOld(text, revealed);
}
let end = performance.now();
console.log(`Old: ${end - start}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  shuffleTextArray(text, revealed);
}
end = performance.now();
console.log(`Array: ${end - start}ms`);

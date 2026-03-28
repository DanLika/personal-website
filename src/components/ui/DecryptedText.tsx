import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";

const styles = {
  wrapper: {
    display: "inline-block",
    whiteSpace: "pre-wrap",
  },
  srOnly: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    border: 0,
  },
};

interface DecryptedTextProps extends ComponentProps<typeof motion.span> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "both";
}

export const DecryptedText = ({
  text,
  speed = 30,
  maxIterations = 12,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "view",
  ...props
}: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const isHoveringRef = useRef<boolean>(false);
  const revealedIndicesRef = useRef<Set<number>>(new Set());
  const hasAnimatedRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isScramblingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const previousTextRef = useRef<string>(text);

  // Reset when text changes (e.g., language switch)
  useEffect(() => {
    if (previousTextRef.current !== text) {
      previousTextRef.current = text;
      hasAnimatedRef.current = false;
      revealedIndicesRef.current = new Set();
      isScramblingRef.current = false;
      setDisplayText(text);
    }
  }, [text]);

  useEffect(() => {
    // Clear existing RAF first
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (!isHoveringRef.current) {
      setDisplayText(text);
      revealedIndicesRef.current = new Set();
      isScramblingRef.current = false;
      return;
    }

    let currentIteration = 0;
    isScramblingRef.current = true;
    lastFrameTimeRef.current = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLength - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
      if (useOriginalCharsOnly) {
        const nonSpaceChars: string[] = [];
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

    // Use requestAnimationFrame with speed-based throttling
    const animate = (timestamp: number) => {
      // Throttle based on speed parameter
      if (timestamp - lastFrameTimeRef.current < speed) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const newRevealed = new Set(revealedIndicesRef.current);

      if (sequential) {
        if (newRevealed.size < text.length) {
          const nextIndex = getNextIndex(newRevealed);
          newRevealed.add(nextIndex);
          revealedIndicesRef.current = newRevealed;
          setDisplayText(shuffleText(text, newRevealed));
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          rafIdRef.current = null;
          isScramblingRef.current = false;
        }
      } else {
        setDisplayText(shuffleText(text, newRevealed));
        currentIteration++;
        if (currentIteration >= maxIterations) {
          rafIdRef.current = null;
          isScramblingRef.current = false;
          setDisplayText(text);
        } else {
          rafIdRef.current = requestAnimationFrame(animate);
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "both") return;
    if (hasAnimatedRef.current) return; // Early exit if already animated

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedRef.current && !isScramblingRef.current) {
          isHoveringRef.current = true;
          hasAnimatedRef.current = true;
          // Trigger re-render to start animation
          setDisplayText((prev) => prev);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn]);

  const hoverProps =
    animateOn === "hover" || animateOn === "both"
      ? {
          onMouseEnter: () => {
            isHoveringRef.current = true;
            setDisplayText((prev) => prev); // Trigger re-render
          },
          onMouseLeave: () => {
            isHoveringRef.current = false;
            setDisplayText((prev) => prev); // Trigger re-render
          },
        }
      : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...hoverProps} {...props}>
      <span style={styles.srOnly}>{displayText}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone = revealedIndicesRef.current.has(index) || !isScramblingRef.current || !isHoveringRef.current;

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
};

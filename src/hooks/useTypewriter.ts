import { useEffect, useRef, useState } from "react";

interface UseTypewriterProps {
  words: string[];
  defaultText: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  cycles?: number;
}

export const useTypewriter = ({
  words,
  defaultText,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  cycles = 1,
}: UseTypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setDisplayText(defaultText);
      return;
    }

    if (words.length === 0) {
      // Don't set default text immediately when words array is empty
      // This prevents the default text from showing before typewriter starts
      return;
    }

    // Mark as started when we have words to type
    if (!hasStarted) {
      setHasStarted(true);
    }

    const currentWord = words[currentWordIndex];

    const typeNextChar = () => {
      if (isDeleting) {
        // Deleting
        console.log(
          `Deleting character from "${currentWord}", charIndex: ${currentCharIndex}`
        );
        if (currentCharIndex > 0) {
          setCurrentCharIndex((prev) => prev - 1);
          setDisplayText(currentWord.substring(0, currentCharIndex - 1));
        } else {
          // Finished deleting, move to next word
          console.log(`Finished deleting word at index: ${currentWordIndex}`);
          setIsDeleting(false);
          setCurrentWordIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= words.length) {
              // Completed one full cycle
              console.log(`Completed cycle ${cycleCount + 1} of ${cycles}`);
              setCycleCount((prevCycle) => prevCycle + 1);
              return 0;
            }
            console.log(`Moving to next word at index: ${nextIndex}`);
            return nextIndex;
          });
          setCurrentCharIndex(0);
        }
      } else {
        // Typing
        if (currentCharIndex < currentWord.length) {
          setCurrentCharIndex((prev) => prev + 1);
          setDisplayText(currentWord.substring(0, currentCharIndex + 1));
        } else {
          // Finished typing current word
          console.log(
            `Finished typing word: "${currentWord}" (index: ${currentWordIndex})`
          );

          // Check if this is the final word in the array
          const isLastWordInArray = currentWordIndex === words.length - 1;

          console.log(
            `isLastWordInArray: ${isLastWordInArray}, currentWordIndex: ${currentWordIndex}, totalWords: ${words.length}`
          );

          // For cycles = 1, complete when we reach the last word
          // For cycles > 1, only complete on the last word of the final cycle
          const shouldComplete =
            cycles === 1
              ? isLastWordInArray
              : isLastWordInArray && cycleCount >= cycles - 1;

          if (shouldComplete) {
            // We've reached the final word, don't delete it
            console.log("Completing typewriter animation - reached final word");
            setIsComplete(true);
            return;
          }

          // Start deleting after pause for all other cases
          console.log(
            `Starting deletion timer for "${currentWord}" with ${pauseDuration}ms delay`
          );
          setIsPaused(true);
          timeoutRef.current = setTimeout(() => {
            console.log(
              `Deletion timer fired! Setting isDeleting=true for "${currentWord}"`
            );
            setIsDeleting(true);
            setIsPaused(false);
          }, pauseDuration);
          return;
        }
      }

      // Continue the animation
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeoutRef.current = setTimeout(typeNextChar, speed);
    };

    // Start the animation
    if (!isComplete && cycleCount < cycles && !isPaused) {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      console.log(
        `Setting timeout for next char: speed=${speed}ms, isDeleting=${isDeleting}, currentChar=${currentCharIndex}`
      );
      timeoutRef.current = setTimeout(typeNextChar, speed);
    } else {
      console.log(
        `Animation stopped: isComplete=${isComplete}, cycleCount=${cycleCount}, cycles=${cycles}, isPaused=${isPaused}`
      );
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentWordIndex,
    currentCharIndex,
    isDeleting,
    cycleCount,
    isComplete,
    words,
    defaultText,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    cycles,
    hasStarted,
    isPaused,
  ]);

  return {
    displayText,
    isComplete: isComplete && hasStarted,
  };
};

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isComplete) {
      setDisplayText(defaultText);
      return;
    }

    if (words.length === 0) {
      setDisplayText(defaultText);
      return;
    }

    const currentWord = words[currentWordIndex];

    const typeNextChar = () => {
      if (isDeleting) {
        // Deleting
        if (currentCharIndex > 0) {
          setCurrentCharIndex((prev) => prev - 1);
          setDisplayText(currentWord.substring(0, currentCharIndex - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= words.length) {
              // Completed one full cycle
              setCycleCount((prevCycle) => {
                const newCycleCount = prevCycle + 1;
                if (newCycleCount >= cycles) {
                  setIsComplete(true);
                }
                return newCycleCount;
              });
              return 0;
            }
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
          // Check if this is the last word of the last cycle
          const isLastWord = currentWordIndex === words.length - 1;
          const isLastCycle = cycleCount === cycles - 1;

          if (isLastWord && isLastCycle) {
            // Don't delete the last word, just complete the animation
            setIsComplete(true);
            return;
          }

          // Start deleting after pause for all other cases
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
          return;
        }
      }

      // Continue the animation
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeoutRef.current = setTimeout(typeNextChar, speed);
    };

    // Start the animation
    if (!isComplete && cycleCount < cycles) {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeoutRef.current = setTimeout(typeNextChar, speed);
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
  ]);

  return displayText;
};

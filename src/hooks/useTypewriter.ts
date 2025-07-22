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
    console.log("Typewriter effect - State:", {
      displayText,
      currentWordIndex,
      currentCharIndex,
      isDeleting,
      cycleCount,
      isComplete,
      wordsLength: words.length,
    });

    if (isComplete) {
      console.log("Typewriter complete, showing default text");
      setDisplayText(defaultText);
      return;
    }

    if (words.length === 0) {
      console.log("No words provided, showing default text");
      setDisplayText(defaultText);
      return;
    }

    const currentWord = words[currentWordIndex];
    console.log("Current word:", currentWord);

    const typeNextChar = () => {
      if (isDeleting) {
        // Deleting
        if (currentCharIndex > 0) {
          setCurrentCharIndex((prev) => prev - 1);
          setDisplayText(currentWord.substring(0, currentCharIndex - 1));
        } else {
          // Finished deleting, move to next word
          console.log("Finished deleting, moving to next word");
          setIsDeleting(false);
          setCurrentWordIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= words.length) {
              // Completed one full cycle
              console.log("Completed one cycle");
              setCycleCount((prevCycle) => {
                const newCycleCount = prevCycle + 1;
                if (newCycleCount >= cycles) {
                  console.log("All cycles complete");
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
          // Finished typing current word, start deleting after pause
          console.log("Finished typing word, starting delete after pause");
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
      console.log("Starting typewriter animation");
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

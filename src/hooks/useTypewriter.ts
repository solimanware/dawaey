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
  const [displayText, setDisplayText] = useState(defaultText);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isComplete || cycleCount >= cycles) {
      setDisplayText(defaultText);
      return;
    }

    const currentWord = words[wordIndex];

    const typeWriter = () => {
      if (isDeleting) {
        // Deleting characters
        setDisplayText((prev) => {
          const newText = currentWord.substring(0, prev.length - 1);
          if (newText === "") {
            setIsDeleting(false);
            setWordIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= words.length) {
                setCycleCount((count) => count + 1);
                return 0;
              }
              return nextIndex;
            });
          }
          return newText;
        });
      } else {
        // Typing characters
        setDisplayText((prev) => {
          const newText = currentWord.substring(0, prev.length + 1);
          if (newText === currentWord) {
            setIsTyping(false);
            // Pause before deleting
            timeoutRef.current = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
            return newText;
          }
          return newText;
        });
      }
    };

    if (!isTyping && !isDeleting && cycleCount < cycles) {
      setIsTyping(true);
    }

    if (isTyping || isDeleting) {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeoutRef.current = setTimeout(typeWriter, speed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    displayText,
    isTyping,
    isDeleting,
    wordIndex,
    cycleCount,
    words,
    defaultText,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    cycles,
    isComplete,
  ]);

  // Mark as complete when cycles are done
  useEffect(() => {
    if (cycleCount >= cycles && !isTyping && !isDeleting) {
      setIsComplete(true);
    }
  }, [cycleCount, cycles, isTyping, isDeleting]);

  return displayText;
};

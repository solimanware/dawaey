import { useEffect, useState } from 'react';

interface UseTypewriterOptions {
  words: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
}

export const useTypewriter = ({
  words,
  loop = false,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 1000,
}: UseTypewriterOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete && !loop) return;

    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        // Delete characters
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        
        if (displayText.length === 1) {
          setIsDeleting(false);
          // Move to next word, or complete if we're at the last word and not looping
          const nextIndex = currentWordIndex + 1;
          if (nextIndex >= words.length) {
            if (loop) {
              setCurrentWordIndex(0);
            } else {
              setIsComplete(true);
              return;
            }
          } else {
            setCurrentWordIndex(nextIndex);
          }
        }
      } else {
        // Type characters
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        
        if (displayText.length === currentWord.length - 1) {
          // Word is complete, wait then start deleting (unless it's the last word and not looping)
          const isLastWord = currentWordIndex === words.length - 1;
          if (isLastWord && !loop) {
            setIsComplete(true);
            return;
          }
          
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
          return;
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, currentWordIndex, isDeleting, words, loop, typeSpeed, deleteSpeed, delayBetweenWords, isComplete]);

  return { text: displayText, isComplete };
};
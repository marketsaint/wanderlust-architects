"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function getNextIndex(text, revealed, revealDirection) {
  const len = text.length;

  const findFromStart = () => {
    for (let i = 0; i < len; i += 1) {
      if (text[i] !== ' ' && !revealed.has(i)) return i;
    }
    return -1;
  };

  const findFromEnd = () => {
    for (let i = len - 1; i >= 0; i -= 1) {
      if (text[i] !== ' ' && !revealed.has(i)) return i;
    }
    return -1;
  };

  if (revealDirection === 'start') return findFromStart();
  if (revealDirection === 'end') return findFromEnd();

  const center = (len - 1) / 2;
  let bestIndex = -1;
  let bestDistance = Infinity;

  for (let i = 0; i < len; i += 1) {
    if (text[i] === ' ' || revealed.has(i)) continue;
    const distance = Math.abs(i - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function shuffleText(text, revealed, availableChars, useOriginalCharsOnly) {
  if (useOriginalCharsOnly) {
    const positions = text.split('').map((char, index) => ({
      char,
      index,
      isSpace: char === ' ',
      isRevealed: revealed.has(index)
    }));

    const pool = positions.filter((p) => !p.isSpace && !p.isRevealed).map((p) => p.char);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    let pointer = 0;
    return positions
      .map((p) => {
        if (p.isSpace) return ' ';
        if (p.isRevealed) return text[p.index];
        return pool[pointer++] || p.char;
      })
      .join('');
  }

  return text
    .split('')
    .map((char, index) => {
      if (char === ' ') return ' ';
      if (revealed.has(index)) return text[index];
      return availableChars[Math.floor(Math.random() * availableChars.length)] || char;
    })
    .join('');
}

export function ScrambleHover({
  text,
  scrambleSpeed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'center',
  useOriginalCharsOnly = false,
  characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':,./<>?",
  className,
  scrambledClassName
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const revealedRef = useRef(new Set());
  const iterationRef = useRef(0);

  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(''))).filter((char) => char !== ' ');
    }
    return characters.split('');
  }, [text, characters, useOriginalCharsOnly]);

  useEffect(() => {
    setDisplayText(text);
    revealedRef.current.clear();
    iterationRef.current = 0;
    setIsScrambling(false);
  }, [text]);

  useEffect(() => {
    let intervalId;

    if (isHovering) {
      setIsScrambling(true);
      intervalId = setInterval(() => {
        if (sequential) {
          const nextIndex = getNextIndex(text, revealedRef.current, revealDirection);
          if (nextIndex === -1) {
            setDisplayText(text);
            setIsScrambling(false);
            clearInterval(intervalId);
            return;
          }
          revealedRef.current.add(nextIndex);
          setDisplayText(shuffleText(text, revealedRef.current, availableChars, useOriginalCharsOnly));
          return;
        }

        setDisplayText(shuffleText(text, revealedRef.current, availableChars, useOriginalCharsOnly));
        iterationRef.current += 1;
        if (iterationRef.current >= maxIterations) {
          setDisplayText(text);
          setIsScrambling(false);
          clearInterval(intervalId);
        }
      }, scrambleSpeed);
    } else {
      setDisplayText(text);
      revealedRef.current.clear();
      iterationRef.current = 0;
      setIsScrambling(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovering, text, scrambleSpeed, maxIterations, sequential, revealDirection, useOriginalCharsOnly, availableChars]);

  return (
    <motion.span
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn('inline-block whitespace-pre-wrap', className)}
    >
      <span className='sr-only'>{text}</span>
      <span aria-hidden='true'>
        {displayText.split('').map((char, index) => {
          const isRevealed = char === ' ' || !isScrambling || !isHovering || revealedRef.current.has(index);
          return (
            <span key={`${index}-${char}`} className={cn(!isRevealed && scrambledClassName)}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

export default ScrambleHover;

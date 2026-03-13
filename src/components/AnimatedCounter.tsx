import { useEffect, useState, useRef } from "react";
import { useScrollReveal } from "./useScrollReveal";

export const AnimatedCounter = ({ 
  target, 
  suffix = "", 
  duration = 2000, 
  loopInterval = 4000,
  startDelay = 0
}: { 
  target: number; 
  suffix?: string; 
  duration?: number; 
  loopInterval?: number;
  startDelay?: number;
}) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      if (timerRef.current) clearInterval(timerRef.current);
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      return;
    }

    const interval = 30;
    const steps = duration / interval;
    const stepValue = target / steps;

    const runAnimation = () => {
      let start = 0;
      setCount(0);
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        start += stepValue;
        if (start >= target) {
          setCount(target);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setCount(Math.floor(start));
        }
      }, interval);
    };

    // Start with a delay if provided
    delayTimerRef.current = setTimeout(() => {
      runAnimation();
      
      // Loop every X seconds after the initial run
      loopTimerRef.current = setInterval(() => {
        runAnimation();
      }, loopInterval);
      
    }, startDelay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, [isVisible, target, duration, loopInterval, startDelay]);

  return <span ref={ref}>{count}{suffix}</span>;
};

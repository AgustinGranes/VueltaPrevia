
"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: number;
}

const calculateTimeLeft = (targetDate: number) => {
  const difference = targetDate - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { timeLeft, difference };
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const { timeLeft, difference } = calculateTimeLeft(targetDate);
      setTimeLeft(timeLeft);
      if (difference <= 0) {
        setIsFinished(true);
        clearInterval(timer);
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);


  if (isFinished) {
    return (
      <p className="text-xl font-bold text-red-500">EVENTO FINALIZADO</p>
    )
  }

  if (!timeLeft) {
    return (
      <div id="timer" className="text-3xl md:text-4xl font-mono tracking-wider font-bold text-yellow-400 animate-pulse">
        Calculando...
      </div>
    );
  }

  const f = (n: number) => (n < 10 ? '0' + n : n);

  let countdownText = "";
  if (timeLeft.days > 0) {
      countdownText = `${timeLeft.days}d ${f(timeLeft.hours)}h ${f(timeLeft.minutes)}m ${f(timeLeft.seconds)}s`;
  } else {
      countdownText = `${f(timeLeft.hours)}:${f(timeLeft.minutes)}:${f(timeLeft.seconds)}`;
  }


  return (
    <div id="timer" className="text-3xl md:text-4xl font-mono tracking-wider font-bold text-yellow-400">
      {countdownText}
    </div>
  );
}
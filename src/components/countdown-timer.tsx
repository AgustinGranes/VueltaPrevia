
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
    // Run on client only
    const { timeLeft, difference } = calculateTimeLeft(targetDate);
    setTimeLeft(timeLeft);
    if (difference <= 0) {
      setIsFinished(true);
    }

    const timer = setInterval(() => {
      const { timeLeft, difference } = calculateTimeLeft(targetDate);
      setTimeLeft(timeLeft);
      if (difference <= 0) {
        setIsFinished(true);
        clearInterval(timer);
      }
    }, 1000);

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
  
  return (
    <div className="flex justify-center items-end gap-3 font-mono tracking-wider font-bold text-yellow-400">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="text-3xl md:text-4xl">{timeLeft.days}</div>
          <div className="text-xs font-semibold">DD</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-3xl md:text-4xl">{timeLeft.hours < 10 ? '0' + timeLeft.hours : timeLeft.hours}</div>
        <div className="text-xs font-semibold">HH</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl">{timeLeft.minutes < 10 ? '0' + timeLeft.minutes : timeLeft.minutes}</div>
        <div className="text-xs font-semibold">MM</div>
      </div>
    </div>
  );
}

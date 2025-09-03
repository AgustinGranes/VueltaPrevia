"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
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
  return timeLeft;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (value < 0) return null;
    return (
      <div key={interval} className="flex flex-col items-center">
        <div className="text-2xl md:text-3xl font-bold text-primary font-mono tracking-tighter">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs text-muted-foreground uppercase">{interval}</div>
      </div>
    );
  });

  const isFinished = !Object.values(timeLeft).some(val => val > 0);

  return (
    <div className="grid grid-cols-4 gap-2 text-center auto-cols-max">
      {isFinished ? <div className="col-span-4 text-lg font-semibold text-accent">Session in progress</div> : timerComponents}
    </div>
  );
}

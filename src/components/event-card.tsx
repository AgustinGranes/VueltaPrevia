
import type { Race, Schedule } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CountdownTimer } from './countdown-timer';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface EventCardProps {
  event: Race;
}

const findNextSession = (schedules: Schedule[]): Schedule | null => {
  const now = new Date().getTime();
  // Filter out sessions that have already passed
  const upcomingSessions = schedules.filter(s => s.startAt > now);
  
  if (upcomingSessions.length > 0) {
    // Sort upcoming sessions to find the next one
    return upcomingSessions.sort((a, b) => a.startAt - b.startAt)[0];
  }

  // If no upcoming sessions, return the last session to show "EVENTO FINALIZADO" correctly
  const lastSession = schedules.length > 0 ? schedules[schedules.length - 1] : null;
    if (lastSession && lastSession.startAt < now) {
        return null;
    }
  return lastSession;
};


export function EventCard({ event }: EventCardProps) {
  const { 
    categoryImage,
    name,
    schedules,
    links,
    extra,
  } = event;

  const nextSession = findNextSession(schedules);
  const hasSchedules = schedules && schedules.length > 0;

  const formatPlatformName = (platform: string) => {
    const upperPlatform = platform.toUpperCase();
    if (upperPlatform === 'DISNEYPLUS') return 'DISNEY+';
    if (upperPlatform === 'RALLYTV') return 'RALLY TV';
    return upperPlatform;
  };

  const formatSessionDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const day = date.getDate();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${capitalizedDayName} ${day}/${month}, ${hours}:${minutes}HS`;
  };

  return (
    <div className="race-card bg-card p-5 flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl">
      <div className="flex justify-center items-center h-16">
          {categoryImage && <Image src={categoryImage} alt={`${event.category} Logo`} width={120} height={64} className="max-h-full max-w-full object-contain" />}
      </div>
      <div className="text-center">
          <h2 className="text-2xl font-syncopate uppercase">{name}</h2>
          <p className="text-sm text-gray-400">{extra ? extra.replace(/\$/g, '') : ''}</p>
      </div>
      <div id="countdown-container" className="text-center bg-background p-4 rounded-lg">
          {hasSchedules ? (
            nextSession ? (
              <>
                <p className="text-lg font-semibold uppercase mb-1">PARA LA {nextSession.name.replace(/\?/g, '')}</p>
                <CountdownTimer targetDate={nextSession.startAt} />
              </>
            ) : (
              <p className="text-xl font-bold text-red-500">EVENTO FINALIZADO</p>
            )
          ) : (
            <>
              <p className="text-lg font-semibold uppercase mb-1">A CONFIRMAR</p>
              <div className="flex justify-center items-end gap-3 font-mono tracking-wider font-bold text-yellow-400">
                  <div className="text-center">
                      <div className="text-3xl md:text-4xl">--</div>
                      <div className="text-xs font-semibold">DD</div>
                  </div>
                  <div className="text-center">
                      <div className="text-3xl md:text-4xl">--</div>
                      <div className="text-xs font-semibold">HH</div>
                  </div>
                  <div className="text-center">
                      <div className="text-3xl md:text-4xl">--</div>
                      <div className="text-xs font-semibold">MM</div>
                  </div>
              </div>
            </>
          )}
      </div>
      <div className="flex flex-col items-center gap-2">
          {links && links.length > 0 && <p className="text-xs uppercase text-gray-400">Donde ver:</p>}
          <div className="flex gap-4 items-center h-8">
            {links.map((link, index) => (
                <div key={`${link._id}-${index}`}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    {formatPlatformName(link.platform)}
                  </a>
                </div>
            ))}
          </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="cursor-pointer text-center text-sm text-yellow-400 hover:text-yellow-300 font-semibold py-2 rounded-lg bg-gray-700/50 hover:no-underline">
                  <span className="flex items-center justify-center">
                    VER HORARIOS COMPLETOS
                  </span>
              </AccordionTrigger>
              <AccordionContent>
                {hasSchedules ? (
                  <ul className="mt-3 px-2 divide-y divide-gray-600">
                    {schedules.map(session => {
                        const formattedTime = formatSessionDate(session.startAt);
                        return (
                            <li key={session._id} className="flex justify-between items-center py-1.5">
                                <span className="text-gray-300">{session.name}</span>
                                <span className="font-semibold text-white">{formattedTime}</span>
                            </li>
                        );
                    })}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 mt-3">Horarios sin confirmar aún.</p>
                )}
              </AccordionContent>
          </AccordionItem>
      </Accordion>
    </div>
  );
}

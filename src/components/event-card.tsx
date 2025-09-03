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

const findNextSession = (sessions: Schedule[]): Schedule | null => {
  const now = new Date().getTime();
  const sortedSessions = [...sessions].sort((a, b) => a.startAt - b.startAt);
  const upcomingSession = sortedSessions.find(s => s.startAt > now);

  if (upcomingSession) {
    return upcomingSession;
  }
  return sortedSessions.length > 0 ? sortedSessions[sortedSessions.length - 1] : null;
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

  return (
    <div className="race-card bg-card p-5 flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl">
      <div className="flex justify-center items-center h-16">
          {categoryImage && <Image src={categoryImage} alt={`${event.category} Logo`} width={120} height={64} className="max-h-full max-w-full object-contain" />}
      </div>
      <div className="text-center">
          <h2 className="text-2xl font-syncopate uppercase">{name}</h2>
          <p className="text-sm text-gray-400">{extra}</p>
      </div>
      <div className="text-center bg-background p-4 rounded-lg">
          {nextSession && nextSession.startAt > new Date().getTime() ? (
            <>
              <CountdownTimer targetDate={nextSession.startAt} />
              <p className="text-lg font-semibold uppercase mt-1">PARA LA {nextSession.name.toUpperCase()}</p>
            </>
          ) : (
             <p className="text-xl font-bold text-red-500">EVENTO FINALIZADO</p>
          )}
      </div>
       <div className="flex flex-col items-center gap-2">
          {links && links.length > 0 && <p className="text-xs uppercase text-gray-400">Donde ver:</p>}
          <div className="flex gap-4 items-center h-8">
            {links.map(link => (
                link.platformImage && <a href={link.link} target="_blank" rel="noopener noreferrer" key={link._id}><img src={link.platformImage} alt={link.platform} className="h-6 object-contain" /></a>
            ))}
          </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="flex justify-center items-center cursor-pointer text-center text-sm text-yellow-400 hover:text-yellow-300 font-semibold py-2 rounded-lg bg-gray-700/50 hover:no-underline">
                  <span className="flex-grow">VER HORARIOS COMPLETOS</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
              </AccordionTrigger>
              <AccordionContent>
                  <ul className="mt-3 px-2 divide-y divide-gray-600">
                    {schedules.map(session => {
                        const sessionDate = new Date(session.startAt);
                        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
                        const formattedTime = sessionDate.toLocaleString(undefined, options);
                        return (
                            <li key={session._id} className="flex justify-between items-center py-1.5">
                                <span className="text-gray-300">{session.name}</span>
                                <span className="font-semibold text-white">{formattedTime} hs</span>
                            </li>
                        );
                    })}
                  </ul>
              </AccordionContent>
          </AccordionItem>
      </Accordion>
    </div>
  );
}

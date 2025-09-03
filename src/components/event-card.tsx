import type { Race, Schedule } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CountdownTimer } from './countdown-timer';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventCardProps {
  event: Race;
}

const findNextSession = (sessions: Schedule[]): Schedule | null => {
  const now = new Date().getTime();
  // Sort sessions by start time to correctly find the next one
  const sortedSessions = [...sessions].sort((a, b) => a.startAt - b.startAt);
  // Find the first session that starts in the future
  const upcomingSession = sortedSessions.find(s => s.startAt > now);

  if (upcomingSession) {
    return upcomingSession;
  }
  // If no future sessions, return the last one to show "EVENTO FINALIZADO" correctly
  return sortedSessions.length > 0 ? sortedSessions[sortedSessions.length - 1] : null;
};


export function EventCard({ event }: EventCardProps) {
  const { 
    category,
    categoryImage,
    name,
    schedules,
    links
  } = event;

  const nextSession = findNextSession(schedules);

  const scheduleList = schedules.map(session => {
      const sessionDate = new Date(session.startAt);
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      const formattedTime = sessionDate.toLocaleString(undefined, options);
      return `<li key="${session._id}" class="flex justify-between items-center py-1.5"><span class="text-gray-300">${session.name}</span><span class="font-semibold text-white">${formattedTime} hs</span></li>`;
  }).join('');
  
  const broadcasterLogos = links.map(b => 
      b.platformImage ? `<img src="${b.platformImage}" alt="${b.platform}" class="h-6 object-contain" />` : ''
  ).join('');

  return (
    <div className="race-card p-5 flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex justify-center items-center h-16">
          {categoryImage && <Image src={categoryImage} alt={`${category} Logo`} width={120} height={64} className="max-h-full max-w-full object-contain" />}
      </div>
      <div className="text-center">
          <h2 className="text-2xl font-syncopate uppercase">{name}</h2>
          <p className="text-sm text-gray-400">{event.extra}</p>
      </div>
      <div className="text-center bg-gray-800/50 p-4 rounded-lg">
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
          {broadcasterLogos && <p className="text-xs uppercase text-gray-400">Donde ver:</p>}
          <div className="flex gap-4 items-center h-8" dangerouslySetInnerHTML={{ __html: broadcasterLogos }}>
          </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="flex justify-center items-center cursor-pointer text-center text-sm text-yellow-400 hover:text-yellow-300 font-semibold py-2 rounded-lg bg-gray-700/50 hover:no-underline">
                  VER HORARIOS COMPLETOS
              </AccordionTrigger>
              <AccordionContent>
                  <ul className="mt-3 px-2 divide-y divide-gray-600" dangerouslySetInnerHTML={{ __html: scheduleList }}>
                  </ul>
              </AccordionContent>
          </AccordionItem>
      </Accordion>
    </div>
  );
}

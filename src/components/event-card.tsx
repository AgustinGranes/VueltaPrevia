
'use client';

import type { Race, Schedule } from '@/types';
import { EventDetailsModal } from './event-details-modal';
import { CountdownTimer } from './countdown-timer';
import Image from 'next/image';

interface EventCardProps {
  event: Race;
  index: number;
}

const findNextSession = (schedules: Schedule[]): Schedule | null => {
  const now = new Date().getTime();
  const upcomingSessions = schedules.filter(s => s.startAt > now);
  
  if (upcomingSessions.length > 0) {
    return upcomingSessions.sort((a, b) => a.startAt - b.startAt)[0];
  }

  const lastSession = schedules.length > 0 ? schedules[schedules.length - 1] : null;
    if (lastSession && lastSession.startAt < now) {
        return null;
    }
  return lastSession;
};


export function EventCard({ event, index }: EventCardProps) {
  const { 
    categoryImage,
    name,
    schedules,
    links,
    extra,
  } = event;

  const nextSession = findNextSession(schedules);
  const hasSchedules = schedules && schedules.length > 0;

  const now = new Date().getTime();
  const eventStart = nextSession ? nextSession.startAt : (schedules.length > 0 ? schedules[0].startAt : 0);
  const fourDaysInMillis = 4 * 24 * 60 * 60 * 1000;

  if (hasSchedules && eventStart > now + fourDaysInMillis) {
    return null;
  }

  const formatPlatformName = (platform: string) => {
    const upperPlatform = platform.toUpperCase();
    if (upperPlatform === 'DISNEYPLUS') return 'DISNEY+';
    if (upperPlatform === 'RALLYTV') return 'RALLY TV';
    return upperPlatform;
  };
  
  const isFirst = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;
  const isFourth = index === 3;
  
  let cardStyle = {};
  if (isFirst) {
    cardStyle = { 
      backgroundImage: `url('https://i.postimg.cc/tR807st3/IMAGEN-1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  } else if (isSecond) {
    cardStyle = { 
      backgroundImage: `url('https://i.postimg.cc/C534YT88/IMAGEN-2.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  } else if (isThird) {
    cardStyle = { 
      backgroundImage: `url('https://i.postimg.cc/Qtnb4Wx0/IMAGEN-3.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  } else if (isFourth) {
    cardStyle = { 
      backgroundImage: `url('https://i.postimg.cc/Y0GxJqvk/IMAGEN-4.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }

  const textColorClass = isFirst || isSecond || isThird || isFourth ? 'text-white' : '';


  return (
    <div 
      className="race-card bg-card p-5 flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl"
      style={cardStyle}
    >
      <div className="flex justify-center items-center h-16 flex-shrink-0">
          {categoryImage && <Image src={categoryImage} alt={`${event.category} Logo`} width={120} height={64} className="max-h-full max-w-full object-contain" />}
      </div>
      <div className={`text-center flex-grow flex flex-col justify-center h-20 ${textColorClass}`}>
          <h2 className="text-2xl font-syncopate uppercase break-words">{name}</h2>
          <p className="text-sm text-gray-400">{extra ? extra.replace(/\$/g, '') : ''}</p>
      </div>
      <div id="countdown-container" className="text-center bg-background/80 backdrop-blur-sm p-4 rounded-lg flex-shrink-0">
          {hasSchedules ? (
            nextSession ? (
              <>
                <div className={`text-lg font-semibold uppercase mb-1 flex flex-wrap justify-center items-center h-12 ${textColorClass}`}>
                  <span className="mr-2">PARA LA</span>
                  <span>{nextSession.name.replace(/\?/g, '')}</span>
                </div>
                <CountdownTimer targetDate={nextSession.startAt} />
              </>
            ) : (
              <p className="text-xl font-bold text-red-500 h-12 flex items-center justify-center">EVENTO FINALIZADO</p>
            )
          ) : (
            <>
              <p className={`text-lg font-semibold uppercase mb-1 h-12 flex items-center justify-center ${textColorClass}`}>A CONFIRMAR</p>
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
      <div className={`flex flex-col items-center gap-2 flex-shrink-0 h-12 justify-center`}>
          {links && links.length > 0 && <p className="text-xs uppercase text-gray-400">Donde ver:</p>}
          <div className="flex gap-4 items-center">
            {links.map((link, index) => (
                <div key={`${link._id}-${index}`}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className={`text-sm font-semibold hover:text-gray-200 transition-colors ${textColorClass}`}>
                    {formatPlatformName(link.platform)}
                  </a>
                </div>
            ))}
          </div>
      </div>
      
      <EventDetailsModal event={event}>
        <div className="cursor-pointer text-center text-sm text-yellow-400 hover:text-yellow-300 font-semibold py-2 px-4 rounded-lg bg-background/80 backdrop-blur-sm mt-auto flex-shrink-0">
          <span className="flex items-center justify-center w-full">
            VER HORARIOS COMPLETOS
          </span>
        </div>
      </EventDetailsModal>

    </div>
  );
}

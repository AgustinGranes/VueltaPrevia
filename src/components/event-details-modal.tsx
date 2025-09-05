
'use client';

import type { Race } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface EventDetailsModalProps {
  event: Race;
  children: React.ReactNode;
}

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

const formatPlatformName = (platform: string) => {
    const upperPlatform = platform.toUpperCase();
    if (upperPlatform === 'DISNEYPLUS') return 'DISNEY+';
    if (upperPlatform === 'RALLYTV') return 'RALLY TV';
    return upperPlatform;
  };

export function EventDetailsModal({ event, children }: EventDetailsModalProps) {
  const { name, categoryImage, extra, schedules, links, category } = event;
  const hasSchedules = schedules && schedules.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-syncopate uppercase">{name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full pr-4">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-center items-center h-24">
              {categoryImage && (
                <Image
                  src={categoryImage}
                  alt={`${category} Logo`}
                  width={150}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {extra && <p className="text-center text-gray-400 text-lg">{extra.replace(/\$/g, '')}</p>}

            {links && links.length > 0 && (
              <div className="text-center">
                <p className="text-sm uppercase text-gray-400 mb-2">Donde ver:</p>
                <div className="flex justify-center gap-4 items-center">
                  {links.map((link, index) => (
                    <a
                      key={`${link._id}-${index}`}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      {formatPlatformName(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-center mb-3 text-yellow-400">HORARIOS COMPLETOS</h3>
                {hasSchedules ? (
                  <ul className="divide-y divide-gray-600">
                    {schedules.map(session => {
                        const formattedTime = formatSessionDate(session.startAt);
                        return (
                            <li key={session._id} className="flex justify-between items-center py-2 gap-4">
                                <span className="text-gray-300 text-left break-words flex-1">{session.name}</span>
                                <span className="font-semibold text-white text-right break-words">{formattedTime}</span>
                            </li>
                        );
                    })}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 mt-3">Horarios sin confirmar aún.</p>
                )}
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


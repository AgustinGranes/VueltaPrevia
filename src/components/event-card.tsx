import type { CategoryEvent, Race } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Car, Flag, Trophy, Tv2, Star, Link as LinkIcon } from 'lucide-react';
import { CountdownTimer } from './countdown-timer';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventCardProps {
  event: CategoryEvent;
}

const categoryLogos: { [key: string]: React.ElementType } = {
  'Fórmula 1': Car,
  'Fórmula 2': Car,
  'Fórmula 3': Car,
  'WEC': Trophy,
  'IndyCar': Flag,
  'NASCAR Cup Series': Car,
  default: Car,
};

const platformLogos: { [key: string]: React.ElementType } = {
  youtube: Star,
  disneyplus: Tv2,
  default: LinkIcon
};

export function EventCard({ event }: EventCardProps) {
  const { 
    category,
    name,
    nextSession,
    races,
    links
  } = event;

  const CategoryLogo = categoryLogos[category] || categoryLogos.default;
  
  const allSessions = races.flatMap(r => r.schedules.map(s => ({...s, raceName: r.name}))).sort((a,b) => a.startAt - b.startAt);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 bg-card">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
          <CategoryLogo className="w-8 h-8" />
        </div>
        <div>
          <CardTitle className="font-headline text-2xl">{category}</CardTitle>
          <CardDescription className="text-base">{name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        {nextSession && (
          <div className="space-y-2 text-center border rounded-lg p-4 bg-background">
            <p className="text-sm font-medium text-muted-foreground">
              Next Session: <span className="text-foreground font-semibold">{nextSession.name}</span>
            </p>
            <CountdownTimer targetDate={nextSession.startAt} />
          </div>
        )}
        
        {links && links.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Where to Watch</h4>
            <div className="flex items-center gap-4">
              {links.map((info) => {
                const Logo = platformLogos[info.platform] || platformLogos.default;
                return (
                  <a key={info.platform} href={info.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <div className="bg-muted p-2 rounded-md">
                      <Logo className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-sm capitalize">{info.platform}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 bg-background/50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-t">
            <AccordionTrigger className="px-6 py-3 text-sm font-semibold hover:no-underline hover:bg-muted/50">
              Full Schedule
            </AccordionTrigger>
            <AccordionContent>
              <ul className="px-6 pb-4 pt-2 space-y-3">
                {allSessions.map((session, index) => (
                   <li key={session.id}>
                      <div className="flex justify-between items-center text-sm">
                        <div className='flex flex-col text-left'>
                            <span className="font-medium text-muted-foreground">{session.name}</span>
                            <span className="text-xs text-muted-foreground/80">{session.raceName}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{format(new Date(session.startAt), 'EEE, MMM d')}</p>
                          <p className="text-muted-foreground text-xs">{format(new Date(session.startAt), 'h:mm a')}</p>
                        </div>
                      </div>
                      {index < allSessions.length - 1 && <Separator className="mt-3" />}
                   </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

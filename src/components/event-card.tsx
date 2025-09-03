import type { CategoryEvent } from '@/types';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import { CountdownTimer } from './countdown-timer';
import { format } from 'date-fns';

interface EventCardProps {
  event: CategoryEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { 
    categoryName,
    categoryLogo: CategoryLogo,
    eventName,
    trackName,
    trackFlag,
    nextSession,
    viewingInfo,
    sessions,
  } = event;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 bg-card">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
          <CategoryLogo className="w-8 h-8" />
        </div>
        <div>
          <CardTitle className="font-headline text-2xl">{categoryName}</CardTitle>
          <CardDescription className="text-base">{eventName}</CardDescription>
          <p className="text-sm text-muted-foreground mt-1">{trackFlag} {trackName}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2 text-center border rounded-lg p-4 bg-background">
          <p className="text-sm font-medium text-muted-foreground">
            Next Session: <span className="text-foreground font-semibold">{nextSession.name}</span>
          </p>
          <CountdownTimer targetDate={nextSession.date} />
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Where to Watch</h4>
          <div className="flex items-center gap-4">
            {viewingInfo.map((info) => (
              <div key={info.channel} className="flex items-center gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <info.logo className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-sm">{info.channel}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 bg-background/50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-t">
            <AccordionTrigger className="px-6 py-3 text-sm font-semibold hover:no-underline hover:bg-muted/50">
              Full Schedule
            </AccordionTrigger>
            <AccordionContent>
              <ul className="px-6 pb-4 pt-2 space-y-3">
                {sessions.map((session, index) => (
                   <li key={session.name}>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">{session.name}</span>
                        <div className="text-right">
                          <p className="font-semibold">{format(new Date(session.date), 'EEE, MMM d')}</p>
                          <p className="text-muted-foreground text-xs">{format(new Date(session.date), 'h:mm a')}</p>
                        </div>
                      </div>
                      {index < sessions.length - 1 && <Separator className="mt-3" />}
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

import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type Session = {
  name: string;
  date: string; // ISO string for dates
};

export type ViewingInfo = {
  channel: string;
  logo: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

export type CategoryEvent = {
  categoryName: string;
  categoryLogo: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  eventName: string;
  trackName: string;
  trackFlag: string;
  sessions: Session[];
  nextSession: Session;
  viewingInfo: ViewingInfo[];
};

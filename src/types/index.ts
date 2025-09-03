export type Schedule = {
  id: string;
  name: string;
  phaseId: string;
  confirmed: boolean;
  startAt: number; // timestamp
  _id: string;
  raceName?: string;
};

export type Link = {
  _id: string;
  platform: string;
  link: string;
};

export type Race = {
  _id: string;
  name: string;
  completeName: string;
  start: number; // timestamp
  categoryShort: string;
  category: string;
  categoryId: string;
  extra: string;
  schedules: Schedule[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  links: Link[];
};

export type CategoryEvent = Race & {
    races: Race[],
    nextSession: Schedule | null;
}

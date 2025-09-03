export type Schedule = {
  id: string;
  name: string;
  phaseId: string;
  confirmed: boolean;
  startAt: number; // timestamp
  _id: string;
};

export type Link = {
  _id: string;
  platform: string;
  link: string;
  platformImage?: string;
};

export type Race = {
  _id: string;
  name: string;
  completeName: string;
  start: number; // timestamp
  categoryShort: string;
  category: string;
  categoryId: string;
  categoryImage?: string; 
  extra: string; // Used for circuit name
  schedules: Schedule[];
  createdAt: string; // ISO date string
  updatedAt:string; // ISO date string
  __v: number;
  links: Link[];
};

export type Category = {
  _id: string;
  categoryId: string;
  categoryShort: string;
  category: string;
  categoryImage: string;
  categoryColor: string;
  enabled: boolean;
  scrapping: boolean;
  group: string;
  priority: number;
};

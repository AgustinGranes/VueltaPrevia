import type { CategoryEvent } from '@/types';
import { Car, Flag, Trophy, Tv2, Star } from 'lucide-react';

const now = new Date();

export const events: CategoryEvent[] = [
  {
    categoryName: 'Formula 1',
    categoryLogo: Car,
    eventName: 'Italian Grand Prix',
    trackName: 'Monza Circuit',
    trackFlag: '🇮🇹',
    nextSession: {
      name: 'Qualifying',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    },
    sessions: [
      { name: 'Practice 1', date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Practice 2', date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString() },
      { name: 'Practice 3', date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Qualifying', date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString() },
      { name: 'Race', date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString() },
    ],
    viewingInfo: [
      { channel: 'ESPN', logo: Tv2 },
      { channel: 'F1 TV', logo: Star },
    ],
  },
  {
    categoryName: 'WEC',
    categoryLogo: Trophy,
    eventName: '6 Hours of Fuji',
    trackName: 'Fuji Speedway',
    trackFlag: '🇯🇵',
    nextSession: {
      name: 'Hyperpole',
      date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    },
    sessions: [
      { name: 'Free Practice 1', date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Free Practice 2', date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Hyperpole', date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString() },
      { name: 'Race', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    viewingInfo: [
      { channel: 'MotorTrend', logo: Tv2 },
      { channel: 'FIA WEC TV', logo: Star },
    ],
  },
  {
    categoryName: 'IndyCar',
    categoryLogo: Flag,
    eventName: 'Grand Prix of Portland',
    trackName: 'Portland Intl. Raceway',
    trackFlag: '🇺🇸',
    nextSession: {
      name: 'Race',
      date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
    },
    sessions: [
      { name: 'Practice', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Qualifying', date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Warm-up', date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString() },
      { name: 'Race', date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString() },
    ],
    viewingInfo: [
      { channel: 'NBC', logo: Tv2 },
      { channel: 'Peacock', logo: Star },
    ],
  },
];

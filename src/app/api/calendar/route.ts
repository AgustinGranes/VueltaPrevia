
import { NextResponse } from 'next/server';
import type { Race } from '@/types';

// Function to format a date for iCalendar
const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

// Function to generate the iCalendar content
const generateIcsContent = (races: Race[]): string => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VueltaPrevia//Motorsport Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Vuelta Previa Motorsport',
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:Calendario de carreras de motorsport de Vuelta Previa',
  ];

  const now = new Date();

  races.forEach(race => {
    if (race.schedules && race.schedules.length > 0) {
      race.schedules.forEach(schedule => {
        const startDate = new Date(schedule.startAt);
        // Assuming a duration of 1 hour for each session if no end time is provided.
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

        const event = [
          'BEGIN:VEVENT',
          `UID:${schedule._id}@vueltaprevia.com`,
          `DTSTAMP:${formatDate(now)}`,
          `DTSTART:${formatDate(startDate)}`,
          `DTEND:${formatDate(endDate)}`,
          `SUMMARY:${race.category} - ${schedule.name}`,
          `DESCRIPTION:Evento: ${race.name}. Circuito: ${race.extra ? race.extra.replace(/\$/g, '') : 'No especificado'}`,
          `LOCATION:${race.extra ? race.extra.replace(/\$/g, '') : 'No especificado'}`,
          'END:VEVENT'
        ];
        icsContent.push(...event);
      });
    }
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

export async function GET() {
  try {
    const now = new Date();
    // Fetch a wider range of races for the calendar
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 90);

    const minDate = startDate.getTime();
    const maxDate = endDate.getTime();

    const response = await fetch(`https://backend-vuelta-rapida-production.up.railway.app/api/races?minDate=${minDate}&maxDate=${maxDate}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch race data: ${response.statusText}`);
    }

    const data = await response.json();
    const races: Race[] = data.races || [];

    const icsContent = generateIcsContent(races);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Error generating iCalendar file:", error);
    return new NextResponse('Error generating iCalendar file', { status: 500 });
  }
}

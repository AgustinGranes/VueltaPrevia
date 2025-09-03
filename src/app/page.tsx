import { EventCard } from "@/components/event-card";
import type { Race } from "@/types";

async function getRaceData(): Promise<Race[]> {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1); // Start of current week (Monday)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 13); // 2 weeks from start date

    const minDate = startDate.getTime();
    const maxDate = endDate.getTime();

    const response = await fetch(`https://backend-vuelta-rapida-production.up.railway.app/api/races?minDate=${minDate}&maxDate=${maxDate}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      console.error("Failed to fetch race data:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.races || [];
  } catch (error) {
    console.error("Error fetching race data:", error);
    return [];
  }
}

export default async function Home() {
  const events = await getRaceData();

  // Group events by category
  const eventsByCategory: { [key: string]: Race[] } = events.reduce((acc, event) => {
    const category = event.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {} as { [key: string]: Race[] });


  const categoryEvents = Object.values(eventsByCategory).map(categoryRaces => {
     // Sort sessions by date to find the next one
    const sortedRaces = [...categoryRaces].sort((a, b) => a.start - b.start);
    const now = new Date().getTime();

    let nextSessionRace: Race | null = null;
    let nextSessionSchedule = null;

    for (const race of sortedRaces) {
        const upcomingSession = race.schedules.find(s => s.startAt > now);
        if (upcomingSession) {
            nextSessionRace = race;
            nextSessionSchedule = upcomingSession;
            break;
        }
    }
    
    // Fallback to the last session of the first race if no upcoming session is found
    if (!nextSessionRace) {
        nextSessionRace = sortedRaces[0];
        nextSessionSchedule = sortedRaces[0].schedules[sortedRaces[0].schedules.length - 1];
    }
    
    return {
        ...nextSessionRace,
        races: sortedRaces,
        nextSession: nextSessionSchedule
    };
  });

  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2 tracking-tight">
          Motorsports Schedule
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your ultimate guide to the race weekend. Never miss a session with live countdowns and viewing information.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categoryEvents.map((event) => (
          <EventCard key={event._id} event={event as any} />
        ))}
      </div>
    </main>
  );
}
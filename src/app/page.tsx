
import { EventCard } from "@/components/event-card";
import type { Race, Category, Schedule } from "@/types";

async function getRaceData(): Promise<Race[]> {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() || 7) + 1); 
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 13); 

    const minDate = startDate.getTime();
    const maxDate = endDate.getTime();
    
    const response = await fetch(`https://backend-vuelta-rapida-production.up.railway.app/api/races?minDate=${minDate}&maxDate=${maxDate}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error("Failed to fetch race data:", response.statusText);
      return [];
    }
    
    const data = await response.json();
    const races: Race[] = data.races || [];

    // Adjust all schedule times by subtracting 3 hours
    const adjustedRaces = races.map(race => ({
      ...race,
      schedules: race.schedules.map(schedule => ({
        ...schedule,
        startAt: schedule.startAt - (3 * 60 * 60 * 1000)
      }))
    }));

    return adjustedRaces;
  } catch (error) {
    console.error("Error fetching race data:", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`https://backend-vuelta-rapida-production.up.railway.app/api/categories`, {
      next: { revalidate: 3600 * 24 } // Revalidate once a day
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

const findNextSessionStart = (schedules: Schedule[]): number | null => {
  const now = new Date().getTime();
  const upcomingSessions = schedules
    .filter(s => s.startAt > now)
    .sort((a, b) => a.startAt - b.startAt);

  if (upcomingSessions.length > 0) {
    return upcomingSessions[0].startAt;
  }
  
  if (schedules.length > 0) {
    // If no upcoming sessions, it could be finished or not started.
    // If last session is in the past, event is over. Use Infinity to sort at the end.
    const lastSession = schedules[schedules.length - 1];
    if (lastSession.startAt < now) {
      return Infinity; // Event finished, place at the end
    }
    // If not finished, it must be an event in the future. Sort by first session.
    return schedules[0].startAt;
  }

  return null; // No schedules
};

export default async function Home() {
  const [races, categories] = await Promise.all([getRaceData(), getCategories()]);

  const categoryMap = new Map(categories.map(cat => [cat.categoryId, cat.categoryImage]));

  const eventsWithImages = races.map(race => ({
    ...race,
    categoryImage: categoryMap.get(race.categoryId) || race.categoryImage,
  })).filter(event => event.categoryImage);

  const sortedEvents = eventsWithImages.sort((a, b) => {
    const nextSessionA = findNextSessionStart(a.schedules);
    const nextSessionB = findNextSessionStart(b.schedules);

    if (nextSessionA === null && nextSessionB === null) return 0;
    if (nextSessionA === null) return 1;
    if (nextSessionB === null) return -1;
    
    return nextSessionA - nextSessionB;
  });


  return (
    <div className="dark">
      <div className="p-4 md:p-8">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-syncopate tracking-widest uppercase">Vuelta Previa</h1>
            <p className="text-gray-400 mt-2">El calendario del motorsport</p>
        </header>

        <main id="events-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Desarrollado con base en la idea de VueltaPrevia.com.ar</p>
        </footer>
      </div>
    </div>
  );
}

import { EventCard } from "@/components/event-card";
import type { Race } from "@/types";

async function getRaceData(): Promise<Race[]> {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1); // Start of current week (Monday)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 13); // 2 weeks from start date

    const minDate = startDate.getTime();
    const maxDate = endDate.getTime();
    
    // Fetch data from the provided API endpoint
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

  return (
    <div className="dark">
      <body className="p-4 md:p-8">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-syncopate tracking-widest uppercase">Vuelta Rápida</h1>
            <p className="text-gray-400 mt-2">El calendario del motorsport</p>
        </header>

        <main id="events-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Desarrollado con base en la idea de VueltaRápida.com.ar</p>
        </footer>
      </body>
    </div>
  );
}
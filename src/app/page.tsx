import { events } from "@/lib/data";
import { EventCard } from "@/components/event-card";

export default function Home() {
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
        {events.map((event) => (
          <EventCard key={event.categoryName} event={event} />
        ))}
      </div>
    </main>
  );
}

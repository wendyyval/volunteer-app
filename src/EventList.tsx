import { useState, useEffect } from 'react';
import './EventList.css';
import EventInfo from './EventInfo'; 

interface Event {
    id: string;
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: string;
    eventDate: string[];
}



function EventList() {

    const [events, setEvents] = useState<Event[]>([]);

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const selectedEvent = events.find(event => event.id === selectedEventId);


    async function fetchEventsFromBackend() {

        try {
            const response = await fetch("/api/events");
            const allEvents = await response.json();
            setEvents(allEvents);
            console.log("Fetched events from backend:", allEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }

    }

    useEffect(() => {
        fetchEventsFromBackend();
    }, []);




    return (
        <div className="dashboard-container">
            {/* Left panel: event list */}
            <div className="event-panel">
                <h3>Events</h3>
                <div className="event-list">
                    {events.map(event => (
                        <div
                            key={event.id}
                            className={`event-item ${selectedEventId === event.id ? 'selected' : ''}`}
                            onClick={() => setSelectedEventId(event.id)}
                        >
                            <strong>{event.eventName}</strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel: Event Details */}
            <div className="event-details-container"> 
                {selectedEvent ? (
                    <EventInfo
                        event={selectedEvent}
                    />
                ) : (
                    <p className="event-info-placeholder">Select an event from the list to see details.</p>
                )}
            </div>
        </div>
    );
}


export default EventList;
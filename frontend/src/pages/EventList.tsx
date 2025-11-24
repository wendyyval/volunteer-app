import { useState, useEffect } from 'react';
import './EventList.css';
import EventInfo, {AppEvent} from './EventInfo'; 
import { apiFetch } from '../utils/http';

export default function EventList() {

    const [events, setEvents] = useState<AppEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

    useEffect(() => {
        async function fetchEvents(){
            try {
                const res = await apiFetch('/events');
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const mapped: AppEvent [] = data.map((ev: any) => ({
                    id: ev.event_id,
                    eventName: ev.event_name,
                    description: ev.description,
                    location: ev.location,
                    urgency: ev.urgency,
                    eventDate: ev.event_date,
                    requiredSkills: ev.event_skills.map((es: any) => es.skill.skill_name),
                }));
                setEvents(mapped);
            }catch(err){
                console.error('Error fetching events: ', err);
            }
        }
        fetchEvents();
        }, []);

    return (
        <div className="dashboard-container">
            <div className="event-panel">
                <h3>Events</h3>
                <div className="event-list">
                    {events.map((event) => (
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

            <div className="event-details-container"> 
                {selectedEvent ? (
                    <EventInfo
                        event={selectedEvent}
                    />
                ) : (
                    <p className="event-info-placeholder">
                        Select an event from the list to see details.
                    </p>
                )}
            </div>
        </div>
    );
}
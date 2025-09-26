import React, { useState } from 'react';
import './EventList.css';
import EventInfo from './EventInfo'; // Import the detail component

// Define Event interface locally
interface Event {
    id: number;
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: 'Low' | 'Medium' | 'High';
    date: string; // ISO date string
}

// Define the Events array locally (renamed from 'Events' to 'events' for consistency with volunteer data)
const events: Event[] = [
    {
        id: 1,
        name: 'Community Kitchen',
        description: 'Prepare meals for the local shelter.',
        location: 'Downtown Community Center',
        requiredSkills: ['Cooking'],
        urgency: 'High',
        date: '2025-09-25',
    },
    {
        id: 2,
        name: 'First Aid Training',
        description: 'Train volunteers on basic first aid.',
        location: 'Health Center',
        requiredSkills: ['Medical'],
        urgency: 'Medium',
        date: '2025-09-26',
    },
    {
        id: 3,
        name: 'Neighborhood Cleanup',
        description: 'Pick up trash and recyclables around the neighborhood.',
        location: 'Central Park',
        requiredSkills: ['Logistics'],
        urgency: 'Low',
        date: '2025-09-27',
    },
    {
        id: 4,
        name: 'Blood Donation Drive',
        description: 'Organize and assist donors at the blood drive.',
        location: 'City Hospital',
        requiredSkills: ['Medical'],
        urgency: 'High',
        date: '2025-09-28',
    },
];


function EventList() {
    // State to hold the ID of the currently selected event (Managed internally)
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    // Find the full event object based on the selected ID
    const selectedEvent = events.find(event => event.id === selectedEventId);

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
                            <strong>{event.name}</strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel: Event Details */}
            <div className="event-details-container"> {/* Renamed class to avoid conflict */}
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
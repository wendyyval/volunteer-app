import React, { useState } from 'react';
import './EventList.css'; // you can style it separately

const events = [
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
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    return (
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
                        {/*<p>{event.description}</p>*/}
                        {/*<p><strong>Location:</strong> {event.location}</p>*/}
                        {/*<p><strong>Skills:</strong> {event.requiredSkills.join(', ')}</p>*/}
                        {/*<p><strong>Urgency:</strong> {event.urgency}</p>*/}
                        {/*<p><strong>Date:</strong> {event.date}</p>*/}
                    </div>
                ))}
            </div>
        </div>
    );
}


export default EventList;
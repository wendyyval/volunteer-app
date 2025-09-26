import React from 'react';
import './EventInfo.css';

// Define the Event interface locally
interface Event {
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: 'Low' | 'Medium' | 'High';
    date: string; // ISO date string
}

interface Props {
    event: Event;
}

const EventInfo: React.FC<Props> = ({ event }) => {
    return (
        <div className="details-panel">
            {/* Event Name */}
            <h2>{event.name}</h2>

            {/* Event Description */}
            <p>{event.description}</p>

            {/* Skills / Tags */}
            <div className="tags-container">
                <strong>Required Skills:</strong>
                {event.requiredSkills.map(skill => (
                    <span key={skill} className="tag">{skill}</span>
                ))}
            </div>

            {/* Horizontal line */}
            <hr className="details-divider" />

            {/* Event Info Grid */}
            <div className="details-grid">
                <div className="details-item">
                    <strong>Date:</strong>
                    <p>{event.date}</p>
                </div>
                <div className="details-item">
                    <strong>Location:</strong>
                    <p>{event.location}</p>
                </div>
                <div className="details-item">
                    <strong>Urgency:</strong>
                    <p>{event.urgency}</p>
                </div>
                <div className="details-item">
                    {/* Placeholder for future expansion or just display */}
                    <strong>Status:</strong>
                    <p>Open</p>
                </div>
            </div>
        </div>
    );
}

export default EventInfo;



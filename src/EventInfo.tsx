import React from 'react';
import './EventInfo.css';

interface Event {
    id: string;
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: string;
    eventDate: string[];
}

interface Props {
    event: Event;
}

const EventInfo: React.FC<Props> = ({ event }) => {
    return (
        <div className="details-panel">
            <h2>{event.eventName}</h2>

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
                    <p>{event.eventDate}</p>
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
                    <strong>Status:</strong>
                    <p>Open</p>
                </div>
            </div>
        </div>
    );
}

export default EventInfo;



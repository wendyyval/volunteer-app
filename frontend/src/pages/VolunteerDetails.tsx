import React from 'react';
import './VolunteerDetails.css';

import type { Volunteer } from '../server/src/types'  // ✅ shared import

interface Props {
    volunteer: Volunteer;
}

const VolunteerDetails: React.FC<Props> = ({ volunteer }) => {
    return (
        <div className="details-panel">

            <div className="header-with-button">
                <h2>{volunteer.name}</h2>
                <button className="assign-button">Assign Selected Event</button>
            </div>

            <div className="tags-container">
                <strong>Skills:</strong>
                {volunteer.skills.map(skill => (
                    <span key={skill} className="tag">{skill}</span>
                ))}
            </div>

            <hr className="details-divider" />

            {/* Volunteer Info Section */}
            <div className="details-grid">
                <div className="details-item">
                    <strong>Location:</strong>
                    <p>{volunteer.city}, {volunteer.state}</p>
                </div>
                <div className="details-item">
                    <strong>ZipCode:</strong>
                    <p>{volunteer.zip}</p>
                </div>
                <div className="details-item">
                    <strong>Availability:</strong>
                    <p>{volunteer.availability.join(', ')}</p>
                </div>
                <div className="details-item">
                    <strong>Current Assigned Event:</strong>
                    <p>{volunteer.currentEvent || 'None'}</p>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDetails;





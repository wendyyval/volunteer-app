import React from 'react';
import './VolunteerDetails.css';
import { apiFetch } from '../utils/http';

interface SimpleEvent {
  id: number;
  eventName: string;
}

interface Volunteer {
  id: number;
  name: string;
  city: string;
  state: string;
  zip: string;
  skills: string[];
  availability: string[];
  preferences: string | null;
}

interface Props {
  volunteer: Volunteer;
  selectedEvent: SimpleEvent | null;
  onAssigned?: () => void;
}

const VolunteerDetails: React.FC<Props> = ({ volunteer, selectedEvent, onAssigned }) => {

  async function assignEvent() {
    if (!selectedEvent) {
      alert("Select an event first!");
      return;
    }

    try {
      const res = await apiFetch("/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: volunteer.id,
          event_id: selectedEvent.id,
          status: "Registered"
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        alert("Failed to assign event.");
        return;
      }

      alert("Event assigned!");
      if (onAssigned) onAssigned();

    } catch (err) {
      console.error("Assign error:", err);
    }
  }

  return (
    <div className="details-panel">

      <div className="header-with-button">
        <h2>{volunteer.name}</h2>
        <button className="assign-button" onClick={assignEvent}>
          Assign Selected Event
        </button>
      </div>

      <div className="tags-container">
        <strong>Skills:</strong>
        {volunteer.skills.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>

      <hr className="details-divider" />

      <div className="details-grid">
        <div className="details-item">
          <strong>Location:</strong>
          <p>
            {volunteer.city}, {volunteer.state}
          </p>
        </div>

        <div className="details-item">
          <strong>ZipCode:</strong>
          <p>{volunteer.zip}</p>
        </div>

        <div className="details-item">
          <strong>Availability:</strong>
          <p>{volunteer.availability.join(", ")}</p>
        </div>

        <div className="details-item">
          <strong>Assignments:</strong>
          <p>View in volunteer history.</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetails;

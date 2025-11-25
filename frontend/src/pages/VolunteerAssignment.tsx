import { useState } from "react";
import VolunteerList, { Volunteer } from "../pages/VolunteerList";
import EventList from "./EventList";
import VolunteerDetails from "./VolunteerDetails";
import type { AppEvent } from "./EventInfo";
import toast from "react-hot-toast";

export default function VolunteerAssign() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  return (
    <div className="auth-shell">
      <h1 className="dashboard-title">Volunteer Assignment Page</h1>

      <div className="assignment-grid">
        <div className="volunteer-panel">
          <VolunteerList onSelectVolunteer={setSelectedVolunteer} />
        </div>
        <div className="event-panel">
          <EventList onSelectEvent={setSelectedEvent} />
        </div>

        <div className="details-container">
          {selectedVolunteer ? (
            <VolunteerDetails
              volunteer={selectedVolunteer}
              selectedEvent={selectedEvent}
              onAssigned={() => {
                toast("Assignment saved!", { icon: "💾"});
              }}
            />
          ) : (
            <p>Select a volunteer from the list.</p>
          )}
        </div>
      </div>
    </div>
  );
}

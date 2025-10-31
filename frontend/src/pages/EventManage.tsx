import { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import EventManageLayout from "../pages/EventManageLayout";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";

//const skillOptions = [
//  { value: "skill 1", label: "skill 1" },
//  { value: "skill 2", label: "skill 2" },
//  { value: "skill 3", label: "skill 3" },
//  { value: "skill 4", label: "skill 4" },
//  { value: "skill 5", label: "skill 5" },
//  { value: "skill 6", label: "skill 6" },
//];



interface Event {
  event_id?: number;
  event_name: string;
  description: string;
  location: string;
  urgency: "Low" | "Medium" | "High";
  event_date: string;
  requiredSkills: string[];
  volunteer_history?: any[];
}

export default function EventManage() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High">("Low");
  const [eventDate, setEventDate] = useState<DateObject[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
    const [err, setErr] = useState("");
    const [skillOptions, setSkillOptions] = useState<{ value: string; label: string }[]>([]);

  // --- Fetch Events from Backend ---
  async function fetchEventsFromBackend() {
      try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("/api/events");
      const allEvents = await response.json();
      setEvents(allEvents.events || []); // backend returns { events: [...] }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  // --- Send New Event to Backend ---
  async function sendEventToBackend(newEvent: Event) {
      try {
          const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify(newEvent),
      });
          const savedEvent = await response.json();
          console.log("Saved event:", savedEvent);
      setEvents((prev) => [...prev, savedEvent]);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }

    // --- Delete Event from Backend ---
    async function deleteEventFromBackend(eventId: number) {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setEvents((prev) => prev.filter((event) => event.event_id !== eventId));
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    }

    async function fetchSkills() {
        try {
            const response = await fetch("http://localhost:3000/api/skills");
            const data = await response.json();
            const options = data.skills.map((skill: any) => ({
                value: skill.skill_name,
                label: skill.skill_name,
            }));
            setSkillOptions(options);
        } catch (err) {
            console.error("Failed to fetch skills:", err);
        }
    }

  // --- Form Submission ---
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (
      !eventName ||
      !description ||
      !location ||
      requiredSkills.length === 0 ||
      !urgency ||
      eventDate.length === 0
    ) {
      return setErr("Please fill in all required fields.");
    }

      const newEvent: Event = {
          event_name: eventName,
          description,
          location,
          urgency,
          event_date: eventDate[0].format("YYYY-MM-DD"), 
          requiredSkills,
      };


    sendEventToBackend(newEvent);

    // Reset form
    setEventName("");
    setDescription("");
    setLocation("");
    setRequiredSkills([]);
    setUrgency("Low");
    setEventDate([]);

    fetchEventsFromBackend();
  }

  // --- Load Events on Mount ---
  useEffect(() => {
      fetchEventsFromBackend();
      fetchSkills();
  }, []);

    
  return (
    <EventManageLayout
      left={
        <div className="event-form-container">
          <h1 className="event-form-heading">Event Management Form</h1>
          <form onSubmit={onSubmit} className="event-form">
            {/* Event Name */}
            <div className="event-field">
              <label>Event Name</label>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="(required)"
              />
            </div>

            {/* Description */}
            <div className="event-field">
              <label>Description</label>
              <textarea
                className="input-modern"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="In depth description of the event."
                rows={5}
              />
            </div>

            {/* Location */}
            <div className="event-field">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="(required)"
              />
            </div>

            {/* Required Skills */}
            <div className="event-field">
              <label>Required Skills</label>
              <Select
                isMulti
                options={skillOptions}
                value={skillOptions.filter((option) =>
                  requiredSkills.includes(option.value)
                )}
                onChange={(selected) =>
                  setRequiredSkills(selected.map((option) => option.value))
                }
                placeholder="Select required skills..."
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "12px",
                    padding: "2px 6px",
                    color: "var(--text)",
                    boxShadow: "0 1px 0 rgba(255,255,255,.03) inset",
                  }),
                  input: (provided) => ({ ...provided, color: "black" }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "rgba(229, 231, 235, .55)",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#eee" : "white",
                    color: "black",
                    cursor: "pointer",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            </div>

            {/* Urgency */}
            <div className="event-field">
              <label>Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as "Low" | "Medium" | "High")}
              >
                <option value="">Select urgency...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Event Date */}
            <div className="event-field">
              <label>Event Date</label>
              <DatePicker
                multiple
                value={eventDate}
                onChange={(dates: DateObject[]) => setEventDate(dates)}
                format="MM/DD/YYYY"
                placeholder="Select event date"
              />
            </div>

            {/* Error Message */}
            {err && (
              <p className="error" style={{ marginLeft: "50px" }}>
                {err}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary h-12 text-base mt-2 w-1/4"
              style={{
                width: "90%",
                display: "block",
                margin: "0 auto",
                marginLeft: "10%",
                fontSize: "15px",
              }}
            >
              Create Event
            </button>
          </form>
        </div>
      }
      right={
        <div className="event-cards">
          {Array.isArray(events) && events.length > 0 ? (
            events.map((ev) => (
              <div key={ev.event_id} className="event-card">
                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => deleteEventFromBackend(ev.event_id)}
                >
                  ×
                </button>

                {/* Header */}
                <div className="event-card-header">{ev.event_name}</div>

                {/* Card Content */}
                <div className="event-card-content">
                  <div className="description-box">
                    <p>{ev.description}</p>
                  </div>

                  {/* Location */}
                  <p>
                    <strong>Location:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "#e0e7ff",
                        color: "#1e293b",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        display: "inline-block",
                      }}
                    >
                      {ev.location}
                    </span>
                  </p>

                  {/* Skills */}
                  <p>
                    <strong>Skills:</strong>{" "}
                    {(ev.requiredSkills || []).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: "#bfebff",
                          color: "#000",
                          padding: "2px 6px",
                          borderRadius: "8px",
                          marginRight: "4px",
                          fontSize: "0.85rem",
                          display: "inline-block",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </p>

                  {/* Urgency */}
                  <p>
                    <strong>Urgency:</strong>{" "}
                    <span
                      style={{
                        backgroundColor:
                          ev.urgency === "Low"
                            ? "#4ade80"
                            : ev.urgency === "Medium"
                            ? "#facc15"
                            : "#f87171",
                        color: "#000",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        display: "inline-block",
                      }}
                    >
                      {ev.urgency}
                    </span>
                  </p>

                  {/* Dates */}
                  <p>
                    <strong>Date:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "#f0f9ff",
                        color: "#1e3a8a",
                        padding: "2px 6px",
                        borderRadius: "6px",
                      }}
                    >
                      {ev.event_date}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      }
    />
  );
}

         

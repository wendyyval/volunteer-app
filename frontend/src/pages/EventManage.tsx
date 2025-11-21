import { useState } from "react";
import { useEffect } from "react"; 
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import EventManageLayout from "../pages/EventManageLayout";
import { v4 as uuidv4 } from "uuid";
import { apiFetch } from "../utils/http";
import toast from "react-hot-toast";

interface Event {
  id: string;
  eventName: string;
  description: string;
  location: string;
  requiredSkills: string[];
  urgency: string;
  eventDate: string[];
}

export default function EventManage() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [urgency, setUrgency] = useState("");
  const [eventDate, setEventDate] = useState<DateObject[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [err, setErr] = useState("");
  
  const skillOptions = [
    { value: "First Aid", label: "First Aid" },
    { value: "Leadership", label: "Leadership" },
    { value: "Organization", label: "Organization" },
    { value: "Teamwork", label: "Teamwork" },
  ];

  async function fetchEventsFromBackend() {
  try {
    const res = await apiFetch("/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    const raw = await res.json();

    const safeEvents = Array.isArray(raw) ? raw : [];
    const formatted = safeEvents.map((ev: any) => ({
      id: ev.event_id ?? ev.id ?? "",
      eventName: ev.event_name ?? ev.eventName ?? "Untitled Event",
      description: ev.description ?? "",
      location: ev.location ?? "",
      urgency: ev.urgency ?? "Low",
      eventDate: [
        new Date(ev.event_date ?? Date.now()).toLocaleDateString(),
      ],
      requiredSkills:
        ev.requiredSkills ??
        ev.event_skills?.map((es: any) => es.skill?.skill_name ?? "") ??
        [],
    }));

    console.log("Fetched events:", formatted);
    setEvents(formatted);
  } catch (err) {
    console.error("Error fetching events:", err);
    setEvents([]);
  }
}
async function sendEventToBackend(newEvent: Event) {
  try {
    const res = await apiFetch("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: newEvent.eventName,
        description: newEvent.description,
        location: newEvent.location,
        urgency: newEvent.urgency,
        event_date: newEvent.eventDate[0],
        requiredSkills: newEvent.requiredSkills,
        creatorId: localStorage.getItem("userId"),
      }),
    });

    if (!res.ok) throw new Error("Failed to save event");

    const savedEvent = await res.json();
    setEvents((prev) => [...prev, savedEvent]);
    toast.success("Event created successfully!");
  } catch (err) {
    console.error("Error creating event:", err);
    toast.error("Failed to create event");
  }
}
async function deleteEventFromBackend(eventId: string) {
    try {
      const res = await apiFetch(`/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted!");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event");
    }
  }

async function onSubmit(e: React.FormEvent) {
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
          id: uuidv4(),
          eventName,
          description,
          location,
          requiredSkills,
          urgency,
          eventDate: eventDate.map((d) => d.format("YYYY-MM-DD")),
        };

        await sendEventToBackend(newEvent);

        setEventName("");
        setDescription("");
        setLocation("");
        setRequiredSkills([]);
        setUrgency("");
        setEventDate([]);

        await fetchEventsFromBackend();
      }   
      useEffect(() => {
        fetchEventsFromBackend();
      }, []);

  return (
    <EventManageLayout
      left={
        <div className="event-form-container">
          <h1 className="event-form-heading">Event Management Form</h1>
          <form onSubmit={onSubmit} className="event-form">
            <div className="event-field">
              <label>Event Name</label>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="(required)"
              />
            </div>

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

            <div className="event-field">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="(required)"
              />
            </div>

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
                  multiValueLabel: (provided) => ({ ...provided, color: "black" }),
                }}
              />
            </div>

            <div className="event-field">
              <label>Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="">Select urgency...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

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

            {err && <p className="error" style={{ marginLeft: "50px" }}>{err}</p>}

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
          {events.map((ev, idx) => (
            <div key={idx} className="event-card">
              <button
                className="delete-btn"
                onClick={() => {
                  deleteEventFromBackend(ev.id);
                }}
              >
                ×
              </button>
              <div className="event-card-header">{ev.eventName}</div>
              <div className="event-card-content">
                <div className="description-box">
                  <p>{ev.description}</p>
                </div>
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
                <p>
                  <strong>Skills:</strong>{" "}
                  {ev.requiredSkills.map((skill, i) => (
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
                <p>
                  <strong>Date:</strong>{" "}
                  {ev.eventDate.map((d, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "#f0f9ff",
                        color: "#1e3a8a",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        marginRight: "4px",
                        display: "inline-block",
                      }}
                    >
                      {d}
                      {d}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
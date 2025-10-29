export type Urgency = "Low" | "Medium" | "High" | "Critical";

export type ParticipationStatus =
    | "Registered"
    | "Confirmed"
    | "Attended"
    | "No-Show"
    | "Cancelled"
    | "Withdrawn"
;

export type EventHistoryItem = {
    id: string;
    eventName: string;
    eventDescription: string;
    location: string;
    requiredSkills: string[];
    urgency: Urgency;
    eventDate: string;
    participationStatus: ParticipationStatus;
    hours?: number;
};

<<<<<<< HEAD:src/types/event.ts

export type Event = {
    id: string;
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: Urgency;
    eventDate: string;
};

=======
export type HistoryItem = EventHistoryItem;
>>>>>>> wandy:frontend/src/types/event.ts

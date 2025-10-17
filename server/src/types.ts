export type Role = "volunteer" | "admin";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  profile?: UserProfile;
}; 

export type UserProfile = {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string; // 2-letter
  zip: string;   // 5–9 chars
  skills: string[];
  preferences?: string;
  availability: string[]; // ISO dates
};

export type EventUrgency = "Low" | "Medium" | "High";

export type Event = {
  id: string;
  name: string;
  description: string;
  location: string;
  requiredSkills: string[];
  urgency: EventUrgency;
  date: string; // ISO
};

export type ParticipationStatus =
  | "Registered" | "Confirmed" | "Attended" | "No-Show" | "Cancelled" | "Withdrawn";

export type HistoryItem = {
  id: string;
  userId: string;
  eventId: string;
  participationStatus: ParticipationStatus;
  hours?: number;
};

export type NoticeKind = "success" | "info" | "warning" | "error";
export type NoticeTopic = "event_assignment" | "event_update" | "reminder" | "system";

export type Notice = {
  id: string;
  userId: string;
  kind: NoticeKind;
  topic: NoticeTopic;
  title: string;
  message?: string;
  ts: number;
  read?: boolean;
};

export type Volunteer = {
    id: string;
    name: string;
    city: string;
    state: string;
    zip: string;
    skills: string[];
    availability: string[];
    preferences: string; 
};


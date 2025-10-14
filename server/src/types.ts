export type Role = "volunteer" | "coordinator" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type ParticipationStatus =
  | "Registered"
  | "Confirmed"
  | "Attended"
  | "No-Show"
  | "Cancelled"
  | "Withdrawn";

export interface HistoryItem {
  id: string;
  userId: string;
  eventName: string;
  eventDate: string; // ISO string
  location: string;
  requiredSkills: string[];
  urgency: "Low" | "Medium" | "High";
  participationStatus: ParticipationStatus;
  hours?: number;
}

export type NoticeKind = "success" | "info" | "warning" | "error";
export type NoticeTopic = "event_assignment" | "event_update" | "reminder" | "system";

export interface AppNotification {
  id: string;
  userId: string;
  kind: NoticeKind;
  topic: NoticeTopic;
  title: string;
  message?: string;
  ts: number;
  read: boolean;
}

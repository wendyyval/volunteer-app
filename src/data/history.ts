import type { EventHistoryItem } from "../types/event";

export const mockHistory: EventHistoryItem[] =[
    {
        id: "1",
        eventName: "Beach Clean-Up",
        eventDescription: "Picking up litter at beach", 
        location: "Galveston",
        requiredSkills: ["Trash Pickup", "Sorting"],
        urgency: "Medium",
        eventDate: "2025-09-25",
        participationStatus: "Attended", 
        hours: 3,
    },
    {
        id: "2",
        eventName: "Food Drive",
        eventDescription: "Organizing/handing out food", 
        location: "Houston Food Bank",
        requiredSkills: ["Organization", "Lifting"],
        urgency: "High",
        eventDate: "2025-10-31",
        participationStatus: "Confirmed"
    },
    {
        id: "3",
        eventName: "Senior Holiday Show",
        eventDescription: "Singing carols to senior residents", 
        location: "Senior Home",
        requiredSkills: ["Walking", "Patience"],
        urgency: "Low",
        eventDate: "2024-12-21",
        participationStatus: "No-Show"
    }
]
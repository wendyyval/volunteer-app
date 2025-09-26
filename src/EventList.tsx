import React, { useState } from 'react';
import './EventList.css';
import EventInfo from './EventInfo'; 

interface Event {
    id: number;
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: 'Low' | 'Medium' | 'High';
    date: string; 
}

const events: Event[] = [
    {
        id: 1,
        name: 'Community Kitchen',
        description: 'Prepare meals for the local shelter.',
        location: 'Downtown Community Center',
        requiredSkills: ['Cooking'],
        urgency: 'High',
        date: '2025-09-25',
    },
    {
        id: 2,
        name: 'First Aid Training',
        description: 'Train volunteers on basic first aid.',
        location: 'Health Center',
        requiredSkills: ['Medical'],
        urgency: 'Medium',
        date: '2025-09-26',
    },
    {
        id: 3,
        name: 'Neighborhood Cleanup',
        description: 'Pick up trash and recyclables around the neighborhood.',
        location: 'Central Park',
        requiredSkills: ['Logistics'],
        urgency: 'Low',
        date: '2025-09-27',
    },
    {
        id: 4,
        name: 'Blood Donation Drive',
        description: 'Organize and assist donors at the blood drive.',
        location: 'City Hospital',
        requiredSkills: ['Medical', 'First Aid'],
        urgency: 'High',
        date: '2025-09-28',
    },
    {
        id: 5,
        name: 'Disaster Relief Logistics',
        description: 'Coordinate the sorting and transport of emergency supplies.',
        location: 'Warehouse District',
        requiredSkills: ['Logistics', 'Driving'],
        urgency: 'High',
        date: '2025-09-29',
    },
    {
        id: 6,
        name: 'Tutoring Session',
        description: 'Help local students with after-school homework and study skills.',
        location: 'Local Library',
        requiredSkills: ['Teaching'],
        urgency: 'Medium',
        date: '2025-09-30',
    },
    {
        id: 7,
        name: 'Senior Buddy Program',
        description: 'Visit and provide companionship to elderly residents.',
        location: 'Retirement Home A',
        requiredSkills: ['Compassion'], 
        urgency: 'Low',
        date: '2025-10-01',
    },
    {
        id: 8,
        name: 'Shelter Intake Assistance',
        description: 'Help process new intakes and organize records at the homeless shelter.',
        location: 'Downtown Shelter',
        requiredSkills: ['Logistics'],
        urgency: 'Medium',
        date: '2025-10-02',
    },
    {
        id: 9,
        name: 'Park Restoration',
        description: 'Planting new trees and maintaining existing flora in the city park.',
        location: 'Riverside Park',
        requiredSkills: ['Gardening'], 
        urgency: 'Low',
        date: '2025-10-03',
    },
    {
        id: 10,
        name: 'Community Garden Planting',
        description: 'Help set up and plant the season\'s crops in the community garden.',
        location: 'Westside Garden',
        requiredSkills: ['Gardening', 'Logistics'],
        urgency: 'Medium',
        date: '2025-10-04',
    },
    {
        id: 11,
        name: 'Tech Support for Non-Profits',
        description: 'Provide basic computer maintenance and software support to local charities.',
        location: 'City Hall Annex',
        requiredSkills: ['Teaching'], 
        urgency: 'Low',
        date: '2025-10-05',
    },
    {
        id: 12,
        name: 'Roadside Assistance Team',
        description: 'Volunteer to help with minor roadside issues during a major holiday weekend.',
        location: 'Highway I-95 Rest Stop',
        requiredSkills: ['Driving', 'First Aid'],
        urgency: 'High',
        date: '2025-10-06',
    },
    {
        id: 13,
        name: 'Vaccination Clinic Support',
        description: 'Assist medical staff by registering patients and managing flow at a free clinic.',
        location: 'Fairgrounds Pavillion',
        requiredSkills: ['Medical', 'Logistics'],
        urgency: 'Medium',
        date: '2025-10-07',
    },
    {
        id: 14,
        name: 'Toy Drive Sorting',
        description: 'Sort and categorize donated toys for distribution to families in need.',
        location: 'Old Elementary School Gym',
        requiredSkills: ['Logistics'],
        urgency: 'Low',
        date: '2025-10-08',
    },
    {
        id: 15,
        name: 'Holiday Meal Service',
        description: 'Serve and clean up after a free Thanksgiving meal for the community.',
        location: 'St. Patrick\'s Hall',
        requiredSkills: ['Cooking', 'Logistics'],
        urgency: 'High',
        date: '2025-11-28',
    },
    {
        id: 16,
        name: 'Animal Shelter Cleaning',
        description: 'Assist with cleaning kennels, feeding, and socializing animals.',
        location: 'City Animal Services',
        requiredSkills: ['Cleaning'], 
        urgency: 'Medium',
        date: '2025-10-10',
    },
    {
        id: 17,
        name: 'Financial Literacy Workshop',
        description: 'Lead or assist in a workshop teaching basic personal finance skills.',
        location: 'Community College',
        requiredSkills: ['Teaching'],
        urgency: 'Low',
        date: '2025-10-11',
    },
    {
        id: 18,
        name: 'Environmental Survey',
        description: 'Hike local trails to collect data on pollution and wildlife habitats.',
        location: 'State Forest Trailhead',
        requiredSkills: ['Logistics'],
        urgency: 'Medium',
        date: '2025-10-12',
    },
    {
        id: 19,
        name: 'School Supply Packing',
        description: 'Pack backpacks with supplies for distribution to students before the new semester.',
        location: 'District Office',
        requiredSkills: ['Logistics'],
        urgency: 'High',
        date: '2025-09-20',
    },
    {
        id: 20,
        name: 'Water Distribution Team',
        description: 'Drive and distribute bottled water to homes following a water main break.',
        location: 'Emergency Depot B',
        requiredSkills: ['Driving', 'Logistics'],
        urgency: 'High',
        date: '2025-09-27',
    },
];


function EventList() {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const selectedEvent = events.find(event => event.id === selectedEventId);

    return (
        <div className="dashboard-container">
            {/* Left panel: event list */}
            <div className="event-panel">
                <h3>Events</h3>
                <div className="event-list">
                    {events.map(event => (
                        <div
                            key={event.id}
                            className={`event-item ${selectedEventId === event.id ? 'selected' : ''}`}
                            onClick={() => setSelectedEventId(event.id)}
                        >
                            <strong>{event.name}</strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel: Event Details */}
            <div className="event-details-container"> 
                {selectedEvent ? (
                    <EventInfo
                        event={selectedEvent}
                    />
                ) : (
                    <p className="event-info-placeholder">Select an event from the list to see details.</p>
                )}
            </div>
        </div>
    );
}


export default EventList;
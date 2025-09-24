import React, { useState } from 'react'
import './VolunteerList.css'

// Sample volunteer data
const volunteers = [
    {
        id: 1,
        name: 'Alice Johnson',
        skills: ['Cooking', 'First Aid'],
        city: 'New York',
        availability: ['2025-09-25', '2025-09-27']
    },
    {
        id: 2,
        name: 'Bob Smith',
        skills: ['Logistics', 'Event Planning'],
        city: 'Los Angeles',
        availability: ['2025-09-26', '2025-09-28']
    },
    {
        id: 3,
        name: 'Charlie Brown',
        skills: ['Fundraising', 'Community Outreach'],
        city: 'Chicago',
        availability: ['2025-09-27', '2025-09-29']
    },
    {
        id: 4,
        name: 'Diana Prince',
        skills: ['Social Media', 'Marketing'],
        city: 'Houston',
        availability: ['2025-09-28', '2025-09-30']
    },
    {
        id: 5,
        name: 'Ethan Hunt',
        skills: ['Public Speaking', 'Advocacy'],
        city: 'Phoenix',
        availability: ['2025-09-29', '2025-09-30']
    },
    {
        id: 6,
        name: 'Fiona Gallagher',
        skills: ['Graphic Design', 'Content Creation'],
        city: 'Philadelphia',
        availability: ['2025-09-30', '2025-10-01']
    },
    {
        id: 7,
        name: 'George Costanza',
        skills: ['Negotiation', 'Conflict Resolution'],
        city: 'San Antonio',
        availability: ['2025-10-01', '2025-10-02']
    },
    {
        id: 8,
        name: 'Hannah Montana',
        skills: ['Music', 'Performance'],
        city: 'San Diego',
        availability: ['2025-10-02', '2025-10-03']
    },
    {
        id: 9,
        name: 'Ian Malcolm',
        skills: ['Data Analysis', 'Research'],
        city: 'Dallas',
        availability: ['2025-10-03', '2025-10-04']
    },
    {
        id: 10,
        name: 'Jane Doe',
        skills: ['Writing', 'Editing'],
        city: 'San Jose',
        availability: ['2025-10-04', '2025-10-05']
    },
    
]

function VolunteerList() {
    const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null)

    return (
        <div className="dashboard-container">
            {/* Left panel: volunteer list */}
            <div className="volunteer-panel">
                <h3>Volunteers</h3>
                <div className="volunteer-list">
                    {volunteers.map(v => (
                        <div
                            key={v.id}
                            className={`volunteer-item ${selectedVolunteerId === v.id ? 'selected' : ''
                                }`}
                            onClick={() => setSelectedVolunteerId(v.id)}
                        >
                            {v.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel: placeholder */}
            {/* show selected volunteer details */}
            <div className="details-panel">
                {selectedVolunteerId ? (
                    (() => {
                        const volunteer = volunteers.find(v => v.id === selectedVolunteerId);
                        return volunteer ? (
                            <div>
                                <h2>{volunteer.name}</h2>
                                <p><strong>City:</strong> {volunteer.city}</p>
                                <p><strong>Skills:</strong> {volunteer.skills.join(', ')}</p>
                                <p><strong>Availability:</strong> {volunteer.availability.join(', ')}</p>
                            </div>
                        ) : null;
                    })()
                ) : (
                    <p>Select a volunteer from the list</p>
                )}
            </div>
        </div>
    )
}

export default VolunteerList






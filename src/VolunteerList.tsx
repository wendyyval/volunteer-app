import React, { useState } from 'react'
import './VolunteerList.css'
import VolunteerDetails from './VolunteerDetails';


// Sample volunteer data
const volunteers = [
    {
        id: 1,
        name: 'Alice Johnson',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        skills: ['Cooking', 'First Aid'],
        availability: ['2025-09-25', '2025-09-27'],
        preferences: 'Morning shifts preferred',
    },
    {
        id: 2,
        name: 'Bob Smith',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        skills: ['Teaching', 'Driving'],
        availability: ['2025-09-26', '2025-09-28'],
        preferences: 'Evenings only',
    },
    {
        id: 3,
        name: 'Charlie Brown',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        skills: ['Medical', 'Logistics'],
        availability: ['2025-09-25', '2025-09-29'],
        preferences: '',
    },
    {
        id: 4,
        name: 'Diana Prince',
        city: 'San Francisco',
        state: 'CA',
        zip: '94101',
        skills: ['Cooking', 'Teaching'],
        availability: ['2025-09-27', '2025-09-30'],
        preferences: 'Afternoon shifts preferred',
    },
    {
        id: 5,
        name: 'Ethan Hunt',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        skills: ['Driving', 'Logistics'],
        availability: ['2025-09-25', '2025-09-28'],
        preferences: '',
    },
    {
        id: 6,
        name: 'Fiona Gallagher',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        skills: ['Medical', 'First Aid'],
        availability: ['2025-09-26', '2025-09-29'],
        preferences: 'Weekends only',
    },
    {
        id: 7,
        name: 'George Miller',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        skills: ['Teaching', 'Cooking'],
        availability: ['2025-09-27', '2025-09-30'],
        preferences: '',
    },
    {
        id: 8,
        name: 'Hannah Lee',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
        skills: ['Logistics', 'Driving'],
        availability: ['2025-09-25', '2025-09-28'],
        preferences: 'Mornings only',
    },
    {
        id: 9,
        name: 'Ian Wright',
        city: 'Denver',
        state: 'CO',
        zip: '80201',
        skills: ['Medical', 'Cooking'],
        availability: ['2025-09-26', '2025-09-29'],
        preferences: '',
    },
    {
        id: 10,
        name: 'Jessica Adams',
        city: 'Atlanta',
        state: 'GA',
        zip: '30301',
        skills: ['Teaching', 'First Aid'],
        availability: ['2025-09-27', '2025-09-30'],
        preferences: '',
    },
    {
        id: 11,
        name: 'Kevin Hart',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        skills: ['Driving', 'Logistics'],
        availability: ['2025-09-25', '2025-09-28'],
        preferences: 'Evenings only',
    },
    {
        id: 12,
        name: 'Laura Kim',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001',
        skills: ['Medical', 'Teaching'],
        availability: ['2025-09-26', '2025-09-29'],
        preferences: 'Weekends preferred',
    },
    {
        id: 13,
        name: 'Michael Scott',
        city: 'Scranton',
        state: 'PA',
        zip: '18501',
        skills: ['Logistics', 'Driving'],
        availability: ['2025-09-25', '2025-09-27'],
        preferences: '',
    },
    {
        id: 14,
        name: 'Natalie Portman',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90002',
        skills: ['Cooking', 'Medical'],
        availability: ['2025-09-26', '2025-09-30'],
        preferences: '',
    },
    {
        id: 15,
        name: 'Oliver Queen',
        city: 'Star City',
        state: 'CA',
        zip: '94016',
        skills: ['Teaching', 'Driving'],
        availability: ['2025-09-25', '2025-09-28'],
        preferences: 'Mornings preferred',
    },
    {
        id: 16,
        name: 'Pam Beesly',
        city: 'Scranton',
        state: 'PA',
        zip: '18502',
        skills: ['First Aid', 'Cooking'],
        availability: ['2025-09-26', '2025-09-29'],
        preferences: '',
    },
    {
        id: 17,
        name: 'Quentin Tarantino',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90003',
        skills: ['Logistics', 'Medical'],
        availability: ['2025-09-27', '2025-09-30'],
        preferences: 'Afternoon shifts preferred',
    },
    {
        id: 18,
        name: 'Rachel Green',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        skills: ['Cooking', 'Teaching'],
        availability: ['2025-09-25', '2025-09-28'],
        preferences: '',
    },
    {
        id: 19,
        name: 'Steve Rogers',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11201',
        skills: ['Driving', 'First Aid'],
        availability: ['2025-09-26', '2025-09-29'],
        preferences: '',
    },
    {
        id: 20,
        name: 'Tony Stark',
        city: 'Malibu',
        state: 'CA',
        zip: '90265',
        skills: ['Logistics', 'Medical'],
        availability: ['2025-09-27', '2025-09-30'],
        preferences: 'Flexible schedule',
    },
];


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

            {/*Right panel: placeholder */}
            {/*show selected volunteer details */}
            <div className="details-container">
                {selectedVolunteerId ? (
                    <VolunteerDetails
                        volunteer={volunteers.find(v => v.id === selectedVolunteerId)!}
                    />
                ) : (
                    <p>Select a volunteer from the list</p>
                )}
            </div>
        </div>
       

    )
}

export default VolunteerList





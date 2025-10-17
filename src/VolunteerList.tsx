import { useState } from 'react'
import './VolunteerList.css'
import VolunteerDetails from './VolunteerDetails';
import { db } from '../server/src/store';

// Assuming `db.users` is your array of User objects
const volunteers = db.users
    .filter(user => user.profile) // only include users that have a profile
    .map(user => {
        const profile = user.profile!;
        return {
            id: user.id,               // id from User
            name: profile.fullName,    // fullName from UserProfile
            city: profile.city,
            state: profile.state,
            zip: profile.zip,
            skills: profile.skills,
            availability: profile.availability,
            preferences: profile.preferences,
        };
    });




function VolunteerList() {
    const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null)

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





import { useState, useEffect } from 'react'
import './VolunteerList.css'
import VolunteerDetails from './VolunteerDetails'
import {apiFetch} from '../utils/http';

interface Volunteer{
    id: number;
    name: string;
    city: string;
    state: string;
    zip: string;
    skills: string[];
    availability: string[];
    preferences: string | null;
}

function VolunteerList() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchVolunteers() {
            try {
                const res = await apiFetch('/users');
                if (!res.ok) throw new Error(`HTTP error ${res.status}`)

                const users = await res.json()

                const volunteerList: Volunteer[] = users
                    .filter((user: any) => user.profile)
                    .map((user: any) => ({
                        id: user.id,
                        name: user.profile.fullName,
                        city: user.profile.city,
                        state: user.profile.state,
                        zip: user.profile.zip,
                        skills: Array.isArray(user.profile.skills) ? user.profile.skills : [],
                        availability: Array.isArray(user.profile.availability) ? user.profile.availability : [],
                        preferences: user.profile.preferences ?? null,
                        currentEvent: user.profile.currentEvent ?? null,
                    }))




                setVolunteers(volunteerList)
            } catch (err) {
                console.error('Error fetching volunteers:', err)
            }
        }

        fetchVolunteers()
    }, [])

    useEffect(() => {
        console.log('Volunteers state updated:', volunteers)

    }, [volunteers])


    return (
        <div className="dashboard-container">
            <div className="volunteer-panel">
                <h3>Volunteers</h3>
                <div className="volunteer-list">
                    {volunteers.map(v => (
                        <div
                            key={v.id}
                            className={`volunteer-item ${selectedVolunteerId === v.id ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedVolunteerId(v.id);
                            }}
                        >
                            {v.name}
                        </div>
                    ))}
                </div>
            </div>

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

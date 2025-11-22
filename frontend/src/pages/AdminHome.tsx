import { useNavigate } from "react-router-dom";

export default function AdminHome(){
    const nav = useNavigate();

    return(
        <div className="admin-dash">
            <h1 className="admin-title">Administrator Dashboard</h1>
            <div className="admin-section">
                <div className="admin-card">

                    <h2>Manage Events</h2>
                    <p>
                        Create, edit, or delete events.
                    </p>
                </div>

                <div className="admin-card">

                    <h2>Volunteer Matching</h2>
                    <p>
                        Assign volunteers to events based on skills and availability.
                    </p>
                </div>

                <div className="admin-card">

                    <h2>Reports</h2>
                    <p>
                        Generate activity reports, event participation, and volunteer hours.
                    </p>
                </div>


            </div>
                

        </div>
    );
}
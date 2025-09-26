import VolunteerList from './VolunteerList';
import EventList from './EventList';

// EventInfo is no longer needed here as it's used inside EventList.tsx

function App() {
    return (
        <div>
            <h1 className="dashboard-title">EVENT MANAGER</h1>

            {/* VolunteerList will handle its own list and details panels */}
            <VolunteerList />

            {/* EventList will handle its own list and details panels */}
            <EventList />

            {/* NOTE: If you have a specific layout in App.css that relies on
                 VolunteerList and EventList rendering within a container, 
                 you may need to wrap them here. Assuming they manage their 
                 positioning using absolute/fixed styles (like the CSS snippets suggest). */}
        </div>
    );
}

export default App;











//import VolunteerList from './VolunteerList'
//import EventList from './EventList'
//import './App.css'

//function App() {
//    return (
//        <div className="main-dashboard">
//            {/* Volunteer section */}
//            <div className="dashboard-section">
//                <h1>Volunteer Dashboard</h1>
//                <VolunteerList />
//            </div>

//            {/* Event section */}
//            <div className="dashboard-section">
//                <h1>Event Dashboard</h1>
//                <EventList />
//            </div>
//        </div>
//    )
//}

//export default App



import EventList from './EventList'
import VolunteerList from './VolunteerList'
import EventInfo from './EventInfo'; 

function App() {
    return (
        <div>
            <h1 className="dashboard-title">EVENT MANAGER</h1>
            <VolunteerList />
            <EventList /> 
            <EventInfo />
        </div>
    )
}

export default App




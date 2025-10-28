import VolunteerList from "../pages/VolunteerList";
import EventList from "./EventList";

export default function VolunteerAssign() {
  return (
    <div className="auth-shell">
      <h1 className="dashboard-title">Volunteer Assignment Page</h1>
      <VolunteerList />
      <EventList />
    </div>
  );
}

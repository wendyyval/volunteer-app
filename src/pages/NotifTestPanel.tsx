import { useNotify } from "../notifications/useNotify";

export default function NotifTestPanel() {
  const notify = useNotify();
  return (
    <div className="grid gap-2 p-3 rounded-xl border border-white/10 bg-white/5 max-w-sm">
      <button className="btn-primary" onClick={() => notify.send("success","system","It works!","Success toast + log")}>Success</button>
      <button className="btn-primary" onClick={() => notify.send("info","system","Heads up","Informational toast")}>Info</button>
      <button className="btn-primary" onClick={() => notify.send("warning","reminder","Reminder","Tomorrow 9:00 AM")}>Reminder</button>
      <button className="btn-primary" onClick={() => notify.send("error","system","Oops","Something failed")}>Error</button>
      <button className="btn-primary" onClick={() => notify.eventAssigned("Food Drive – Downtown","Oct 12, 9:00 AM")}>Event Assigned</button>
    </div>
  );
}
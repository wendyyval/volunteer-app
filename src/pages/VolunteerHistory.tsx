import {useMemo, useState} from "react";
import type { EventHistoryItem, ParticipationStatus } from "../types/event";
import { mockHistory } from "../data/history";




type SortKey = keyof Pick<EventHistoryItem, "eventName" | "eventDate" | "urgency" | "participationStatus" | "location">;

type SortDir = "asc" | "desc";

const statusColors: Record<ParticipationStatus, string> ={
    Registered: "bg-white/10 text-blue-200 border-blue-300/30",
    Confirmed: "bg-white/10 text-cyan-200 border-cyan-300/30",
    Attended: "bg-white/10 text-green-200 border-green-300/30",
    "No-Show": "bg-white/10 text-rose-200 border-rose-300/30",
    Cancelled: "bg-white/10 text-zinc-200 border-zinc-300/30",
    Withdrawn: "bg-white/10 text-amber-200 border-amber-300/30",
};

export default function VolunteerHistory(){
    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<ParticipationStatus | "All">("All");
    const [sortKey, setSortKey] = useState<SortKey>("eventDate");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const filtered = useMemo(() => {
        let data = [...mockHistory];
    

        if (status != "All"){
            data = data.filter(d => d.participationStatus === status);
        }

        if (query.trim()){
            const q = query.toLowerCase();
            data = data.filter(d =>
                d.eventName.toLowerCase().includes(q) ||
                d.location.toLowerCase().includes(q) ||
                d.requiredSkills.join(",").toLowerCase().includes(q)
            );
        }

        data.sort((a, b) => {
            const va = a[sortKey];
            const vb = b[sortKey];
            if (sortKey === "eventDate"){
                const da = new Date(String(va)).getTime();
                const db = new Date(String(vb)).getTime();
                return sortDir === "asc" ? da - db : db - da;
            }

            const sa = String(va).toLowerCase();
            const sb = String(vb).toLowerCase();

            if(sa < sb) return sortDir === "asc" ? -1:1;
            if(sa > sb) return sortDir === "asc" ? 1:-1;
            return 0;
        });

        return data;
        }, [query, status, sortKey, sortDir]);
        
        function toggleSort(k: SortKey){
            if(k === sortKey) setSortDir(d=> (d === "asc" ? "desc" : "asc"));
            else {setSortKey(k); setSortDir("asc");}
        }

        return(
            <div className="page-shell min-h-screen">
                <div className="page-frame">

            <div className="panel-card p-6 md:p-8">
                <div className="panel-card">
                    <header className="history-header">
                        <h1 className="history-title">Volunteer History</h1>
                        <p className="history-sub">
                            All events you've participated in.
                        </p>
                    </header>
                    <div className="flex gap-3">
                        <input
                            className="input-modern"
                            placeholder="Search via event, location, or skill..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            />
                            <select
                                className="input-modern"
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                                >
                                    {["All", "Registered", "Confirmed", "Attended", "No-Show", "Cancelled", "Withdrawn"].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                            </select>
                    </div>
                </div>

                <div className="table-glass overflow-x-auto rounded-2xl">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                            <tr className="border-b border-white/10">
                                    <Th label="Event"   onClick={() => toggleSort("eventName")} active={sortKey==="eventName"} dir={sortDir} />
                                    <Th label="Date"   onClick={() => toggleSort("eventDate")} active={sortKey==="eventDate"} dir={sortDir} />
                                    <Th label="Location" onClick={() => toggleSort("location")} active={sortKey==="location"} dir={sortDir} />
                                    <th className="py-3 px-4">Required Skills</th>
                                    <Th label="Urgency" onClick={() => toggleSort("urgency")} active={sortKey==="urgency"} dir={sortDir} />
                                    <Th label="Status" onClick={() => toggleSort("participationStatus")} active={sortKey==="participationStatus"} dir={sortDir} />
                                    <th className="py-3 px-4">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 &&(
                                <tr>
                                    <td colSpan={7} className="py-10 px-4 text-center opacity-75">
                                        No history just yet. Once you have been assigned or attend any events, they'll show up here.
                                    </td>
                                </tr>
                            )}
                            {filtered.map(item => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 font-medium">{item.eventName}</td>
                                    <td className="py-3 px-4">{formatDate(item.eventDate)}</td>
                                    <td className="py-3 px-4">{item.location}</td>
                                    <td className="py-3 px-4">
                                        <ul className="skill-list">
                                            {item.requiredSkills.map(s => (
                                                <li key={s} className="chip chip-skill">{s}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="py-3 px-4">{item.urgency}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${statusColors[item.participationStatus]}`}>
                                            {item.participationStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{item.hours ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> 
            </div>
        </div>
    </div>
        );
    }

    function Th({
        label, onClick, active, dir
    }: {label: string; onClick: () => void; active: boolean; dir: SortDir}){
        return (
            <th className="py-3 px-4 select-none">
                <button onClick={onClick} className="inline-flex items-center gap-1 font-semibold">
                    {label}
                    {active && <span className="opacity-70">{dir === "asc" ? "🔺" : "🔻"}</span>}
                </button>
            </th>
        );
    }
    function formatDate(iso: string){
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {year: "numeric", month: "short", day: "numeric"});
    }
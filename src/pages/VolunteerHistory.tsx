import { useEffect, useMemo, useState } from "react";
import type { EventHistoryItem, ParticipationStatus } from "../types/event";
import { useNavigate } from "react-router-dom";
import { handle401, fetchMyHistory, addMyHistory, seedMyHistory } from "../api/history";
import toast from "react-hot-toast";

/** sort keys / directions */
type SortKey = keyof Pick<EventHistoryItem, "eventName" | "eventDate" | "urgency" | "participationStatus" | "location">;
type SortDir = "asc" | "desc";

const statusColors: Record<ParticipationStatus, string> = {
  Registered: "bg-white/10 text-blue-200 border-blue-300/30",
  Confirmed:  "bg-white/10 text-cyan-200 border-cyan-300/30",
  Attended:   "bg-white/10 text-green-200 border-green-300/30",
  "No-Show":  "bg-white/10 text-rose-200 border-rose-300/30",
  Cancelled:  "bg-white/10 text-zinc-200 border-zinc-300/30",
  Withdrawn:  "bg-white/10 text-amber-200 border-amber-300/30",
};

export default function VolunteerHistory() {
  const nav = useNavigate();

  // server data
  const [rows, setRows] = useState<EventHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ui state
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<ParticipationStatus | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("eventDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMyHistory();
        if (handle401(res, () => nav("/login"))) return;
        const data = await res.json().catch(() => []);
        setRows(Array.isArray(data) ? data : []);
      } catch {
        setErr("Failed to load history.");
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  // derived table data
  const filtered = useMemo(() => {
    let data = [...rows];

    if (status !== "All") {
      data = data.filter(d => d.participationStatus === status);
    }
    if (query.trim()) {
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
      if (sortKey === "eventDate") {
        const da = new Date(String(va)).getTime();
        const db = new Date(String(vb)).getTime();
        return sortDir === "asc" ? da - db : db - da;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [rows, query, status, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  }

  // actions
  async function onAddSample() {
    try {
      const res = await addMyHistory({
        eventName: "Community Park Cleanup",
        location: "Austin, TX",
        requiredSkills: ["Teamwork", "Lifting"],
        urgency: "Medium",
        participationStatus: "Registered",
        // leave eventDate undefined => server defaults to today
      });
      if (handle401(res, () => nav("/login"))) return;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return toast.error(typeof err.error === "string" ? err.error : "Failed to add row");
      }
      const row = await res.json();
      setRows(prev => [row, ...prev]);
      toast.success("Added to history");
    } catch {
      toast.error("Network error");
    }
  }

  async function onSeed() {
    try {
      const res = await seedMyHistory();
      if (handle401(res, () => nav("/login"))) return;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return toast.error(typeof err.error === "string" ? err.error : "Seed failed");
      }
      // re-fetch after seeding
      const re = await fetchMyHistory();
      if (!re.ok) return;
      const list = await re.json();
      setRows(Array.isArray(list) ? list : []);
      toast.success("Seeded sample history");
    } catch {
      toast.error("Network error");
    }
  }

  return (
    <div className="page-shell min-h-screen">
      <div className="page-frame">
        <div className="panel-card p-6 md:p-8">

          {/* Header */}
          <header className="history-header mb-6">
            <h1 className="history-title">Volunteer History</h1>
            <p className="history-sub">All events you've participated in.</p>
          </header>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <div className="flex-1 flex gap-3">
              <input
                className="input-modern flex-1"
                placeholder="Search via event, location, or skill..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select
                className="input-modern"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
              >
                {["All", "Registered", "Confirmed", "Attended", "No-Show", "Cancelled", "Withdrawn"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button type="button" className="btn-primary" onClick={onAddSample}>+ Add sample</button>
              <button type="button" className="btn-primary" onClick={onSeed}>Seed 2</button>
            </div>
          </div>

          {/* Content states */}
          {loading && (
            <div className="py-10 text-center opacity-75">Loading history…</div>
          )}
          {!loading && err && (
            <div className="py-10 text-center error">{err}</div>
          )}

          {/* Table */}
          {!loading && !err && (
            <div className="table-glass overflow-x-auto rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                  <tr className="border-b border-white/10">
                    <Th label="Event"      onClick={() => toggleSort("eventName")}           active={sortKey==="eventName"}           dir={sortDir} />
                    <Th label="Date"       onClick={() => toggleSort("eventDate")}           active={sortKey==="eventDate"}           dir={sortDir} />
                    <Th label="Location"   onClick={() => toggleSort("location")}            active={sortKey==="location"}            dir={sortDir} />
                    <th className="py-3 px-4">Required Skills</th>
                    <Th label="Urgency"    onClick={() => toggleSort("urgency")}             active={sortKey==="urgency"}             dir={sortDir} />
                    <Th label="Status"     onClick={() => toggleSort("participationStatus")} active={sortKey==="participationStatus"} dir={sortDir} />
                    <th className="py-3 px-4">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 px-4 text-center opacity-75">
                        No history yet. Use “Add sample” or “Seed 2” to create some rows.
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
          )}

        </div>
      </div>
    </div>
  );
}

function Th({
  label, onClick, active, dir
}: { label: string; onClick: () => void; active: boolean; dir: "asc" | "desc" }) {
  return (
    <th className="py-3 px-4 select-none">
      <button onClick={onClick} className="inline-flex items-center gap-1 font-semibold">
        {label}
        {active && <span className="opacity-70">{dir === "asc" ? "🔺" : "🔻"}</span>}
      </button>
    </th>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

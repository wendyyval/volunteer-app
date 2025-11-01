import { useEffect, useMemo, useState } from "react";
import type { ParticipationStatus } from "../types/event";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { apiFetch } from "../utils/http";

type HistoryItem = {
  history_id: number;
  eventName: string;
  date: string;
  location: string;
  requiredSkills: string[];
  status: ParticipationStatus;
};

type SortKey = keyof Pick<HistoryItem, "eventName" | "date" | "location" | "status">;
type SortDir = "asc" | "desc";

const statusColors: Record<ParticipationStatus, string> = {
  Registered: "bg-white/10 text-blue-200 border-blue-300/30",
  Confirmed: "bg-white/10 text-cyan-200 border-cyan-300/30",
  Attended: "bg-white/10 text-green-200 border-green-300/30",
  "No-Show": "bg-white/10 text-rose-200 border-rose-300/30",
  Cancelled: "bg-white/10 text-zinc-200 border-zinc-300/30",
  Withdrawn: "bg-white/10 text-amber-200 border-amber-300/30",
};

export default function VolunteerHistory() {
  const nav = useNavigate();
  const [rows, setRows] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<ParticipationStatus | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    async function loadHistory() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("You must be logged in to view history.");
          return nav("/login");
        }

        const res = await apiFetch(`/history/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load history:", err);
        setErr("Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [nav]);

  const filtered = useMemo(() => {
    let data = [...rows];
    if (status !== "All") data = data.filter((d) => d.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (d) =>
          d.eventName.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.requiredSkills.join(",").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (sortKey === "date") {
        const da = new Date(va).getTime();
        const db = new Date(vb).getTime();
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
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  return (
    <MainLayout>
      <div className="panel-card p-6 md:p-8">
        <header className="history-header mb-6">
          <h1 className="history-title">Volunteer History</h1>
          <p className="history-sub">All events you've participated in.</p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex-1 flex gap-3">
            <input
              className="input-modern flex-1"
              placeholder="Search via event, location, or skill..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="input-modern"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              {["All", "Registered", "Confirmed", "Attended", "No-Show", "Cancelled", "Withdrawn"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {loading && <div className="py-10 text-center opacity-75">Loading history…</div>}
        {!loading && err && <div className="py-10 text-center error">{err}</div>}

        {!loading && !err && (
          <div className="table-glass overflow-x-auto rounded-2xl">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                <tr className="border-b border-white/10">
                  <Th label="Event" onClick={() => toggleSort("eventName")} active={sortKey === "eventName"} dir={sortDir} />
                  <Th label="Date" onClick={() => toggleSort("date")} active={sortKey === "date"} dir={sortDir} />
                  <Th label="Location" onClick={() => toggleSort("location")} active={sortKey === "location"} dir={sortDir} />
                  <th className="py-3 px-4">Required Skills</th>
                  <Th label="Status" onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 px-4 text-center opacity-75">
                      No history yet.
                    </td>
                  </tr>
                )}

                {filtered.map((item) => (
                  <tr key={item.history_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.eventName}</td>
                    <td className="py-3 px-4">{formatDate(item.date)}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4">
                      <ul className="skill-list">
                        {item.requiredSkills.map((s) => (
                          <li key={s} className="chip chip-skill">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function Th({
  label,
  onClick,
  active,
  dir,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
}) {
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

export default function Reports() {
  // --- Volunteer Participation Reports ---
  const handleVolunteerReport = async (format: "pdf" | "csv") => {
    try {
      console.log("Downloading volunteer report...");

      const res = await fetch(
        `http://localhost:3001/api/generate-volunteer-report?format=${format}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate volunteer report");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `volunteer_participation.${format}`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating volunteer participation report");
    }
  };

  // --- Event Details Reports ---
  const handleEventDetailsReport = async (format: "pdf" | "csv") => {
    try {
      console.log("Downloading event details report...");

      const res = await fetch(
        `http://localhost:3001/api/generate-event-report?format=${format}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate event details report");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `event_details.${format}`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating event details report");
    }
  };

  return (
    <div
      className="page-shell"
      style={{
        padding: "40px 10%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1>Reports Dashboard</h1>
      <p>Select a report to download.</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Volunteer Participation Reports</h2>

      <button
        className="btn-primary"
        onClick={() => handleVolunteerReport("pdf")}
        style={{ marginRight: "10px", marginTop: "10px" }}
      >
        Volunteer Report (PDF)
      </button>

      <button
        className="btn-primary"
        onClick={() => handleVolunteerReport("csv")}
        style={{ marginTop: "10px" }}
      >
        Volunteer Report (CSV)
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Event Details Reports</h2>

      <button
        className="btn-primary"
        onClick={() => handleEventDetailsReport("pdf")}
        style={{ marginRight: "10px", marginTop: "10px" }}
      >
        Event Details Report (PDF)
      </button>

      <button
        className="btn-primary"
        onClick={() => handleEventDetailsReport("csv")}
        style={{ marginTop: "10px" }}
      >
        Event Details Report (CSV)
      </button>
    </div>
  );
}

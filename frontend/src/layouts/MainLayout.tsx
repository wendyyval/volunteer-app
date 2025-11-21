import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { clearAuth } from "../utils/auth";
import BellMenu from "../notifications/BellMenu";

type Props = { children: ReactNode };

export default function MainLayout({ children }: Props) {
  const nav = useNavigate();

  function signOut() {
    clearAuth();
    nav("/login");
  }

   const handleGenerateReport = async () => {
    try {
      console.log("Downloading report...");

      const res = await fetch("http://localhost:3001/api/generate-report", {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "volunteer_report.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating report");
    }
  };
  

  return (
    <div className="page-shell min-h-screen">
      <header className="site-header">
        <div className="site-header__inner">
          {/* Brand */}
          <Link to="/history" className="brand" aria-label="HelpingHands Home">
            <span className="brand__dot" />
            <span className="brand__name">HelpingHands</span>
          </Link>

          {/* Nav */}
          <nav className="site-nav" aria-label="Primary">
            <NavLink to="/history" className="nav-link">History</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            <NavLink to="/manage"  className="nav-link">Events</NavLink>
            <button
              className="nav-link"
              onClick={handleGenerateReport}
              >
                Generate Report
            </button>
          </nav>

          <div className="spacer" />

          {/* Notifications + Sign out */}
          <div className="header-actions">
             <BellMenu />
            <button className="signout-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="page-frame">{children}</main>
    </div>
  );
}

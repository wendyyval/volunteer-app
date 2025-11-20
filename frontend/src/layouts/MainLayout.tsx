import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { clearAuth } from "../utils/auth";
import BellMenu from "../notifications/BellMenu";

type Props = { children: ReactNode };

export default function MainLayout({ children }: Props) {
  const nav = useNavigate();
  const {pathname} = useLocation();

  function signOut() {
    clearAuth();
    nav("/login");
  }

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
          <nav className="flex gap-6">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/history" className="nav-link">History</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            <NavLink to="/manage"  className="nav-link">Events</NavLink>
          </nav>

          <div className="spacer" />

          {/* Notifications + Sign out */}
          <div className="header-actions">
             <BellMenu />
            <button className="signout-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <main className={pathname === "/" ? "" : "page-frame"}>
        {children}
      </main>
    </div>
  );
}

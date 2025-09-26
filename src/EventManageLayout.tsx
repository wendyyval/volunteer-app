import type { ReactNode } from "react";

interface EventManageLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function EventManageLayout({ left, right }: EventManageLayoutProps) {
  return (
    <div className="profile-shell">
      <div className="event-frame">
        <div className="event-left">{left}</div>
        <div className="event-right">{right}</div>
      </div>
    </div>
  );
}
import type { ReactNode } from "react";
import { useState } from "react";
import avatar1 from "../src/assets/default-avatar.jpg";
import avatar2 from "../src/assets/dude-avatar.jpg";
import avatar3 from "../src/assets/girl-avatar.jpg";

const presetAvatars = [avatar1, avatar2, avatar3];

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatar1);

  return (
    <div className="profile-shell">
      <div className="profile-frame">
        {/* Left Side */}
        <div className="profile-left">
          <div className="avatar-section">
            <div className="avatar-placeholder">
              <img
                src={selectedAvatar}
                alt="Selected Avatar"
                className="avatar-current"
              />
            </div>
          </div>

          <div className="bottom-section">
            {presetAvatars.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt={`Avatar ${idx + 1}`}
                className={`avatar-option ${
                  selectedAvatar === avatar ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="profile-right">{children}</div>
      </div>
    </div>
  );
}







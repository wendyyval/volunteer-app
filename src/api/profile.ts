import { authHeaders } from "../utils/auth";
import { apiFetch } from "../utils/http";

export type ProfileData = {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  skills: string[];
  preferences?: string;
  availability: string[];
};

export async function fetchProfile() {
    const res = await apiFetch("/api/profile/me", 
        { 
            headers:authHeaders()
        });
    return res.json()
}

export async function saveProfile(profile: ProfileData){
    const res = await apiFetch("/api/profile/me", 
        {
            method: "POST",
            headers:authHeaders({"Content-Type": "application/json"}),
            body: JSON.stringify(profile),
        });
    return res.json()
}
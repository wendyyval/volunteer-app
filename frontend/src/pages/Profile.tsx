import {useState, useEffect} from 'react';
import CreatableSelect from "react-select/creatable";
import type { StylesConfig } from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import ProfileLayout from "../pages/ProfileLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { UserProfile } from "../types/user";
import { fetchProfile } from "../api/history";
import { apiFetch } from "../utils/http";


export default function Profile() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [skills, setSkills] = useState<string[]>([])
    const [preferences, setPreferences] = useState("")
    const [availability, setAvailability] = useState<DateObject[]>([])
    const [err, setErr] = useState("");
    const [availableSkills, setAvailableSkills] = useState<{ value: string; label: string }[]>([]);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
    async function loadSkills() {
      try {
        const res = await apiFetch("/skills"); 
        const data = await res.json();
        setAvailableSkills(
          data.map((s: any) => ({ value: s.skill_name, label: s.skill_name }))
        );
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    }
    loadSkills();
  }, []);
    useEffect(() => {
        async function loadProfile() {
        try {
            const data = await fetchProfile();
            if (data) {
            setFullName(data.fullName);
            setAddress1(data.address1);
            setAddress2(data.address2 || "");
            setCity(data.city);
            setState(data.state);
            setZipCode(data.zip);
            setSkills(data.skills || []);
            setPreferences(data.preferences || "");
            setAvailability(
                data.availability?.map((d: string) => new DateObject(d)) || []
            );
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
        }
        loadProfile();
    }, []);

    async function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");
        if(!fullName || !address1 || !city || !state || !zipCode || skills.length == 0 || availability.length == 0)
            return setErr("Plase fill in all required fields.")
        if(zipCode.length < 5)
            return setErr("Zip code must be at least 5 characters long.")

        const profile: UserProfile = {
            fullName,
            address1,
            address2,
            city,
            state,
            zip: zipCode,
            skills,
            preferences,
            availability: availability.map((d) => d.format("YYYY-MM-DD")),
        };

        try {
            await toast.promise(
                apiFetch("/users/saveprofile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, profile }),
                }).then((res) => {
                    if (!res.ok) throw new Error("Failed to save profile");
                }),
                {
                    loading: "Saving profile...",
                    success: "Profile saved!",
                    error: "Failed to save profile",
                }
            );
            navigate("/history");
            } catch (err) {
                console.error(err);
                setErr("Failed to save profile");
            }
        }

    const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "2px 6px",
            color: "var(--text)",
            boxShadow: "0 1px 0 rgba(255,255,255,.03) inset",
        }),
        input: (provided) => ({
            ...provided,
            color: "black",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "rgba(229, 231, 235, .55)",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "white",
            color: "black",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#eee" : "white",
            color: "black",
            cursor: "pointer",
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "white",
            color: "black",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "black",
        }),
        };    

    return (
        <ProfileLayout>
            <div className="profile-form-container">
                <h1 className="profile-form-heading">User Profile</h1>
                <form onSubmit={onSubmit} className="profile-form">

                    <div className="profile-field">
                        <label>Full Name</label>
                        <input 
                            placeholder="(required)"
                            value={fullName}
                            onChange={e=>setFullName(e.target.value.slice(0,50))}
                            maxLength={50}
                        />
                    </div>
                    
                    <div className="profile-field">
                        <label>Address 1</label>
                        <input 
                            placeholder="(required)"
                            value={address1}
                            onChange={e => setAddress1(e.target.value.slice(0, 100))}
                            maxLength={100}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Address 2</label>
                        <input 
                            placeholder="(optional)"
                            value={address2}
                            onChange={e => setAddress2(e.target.value.slice(0, 100))}
                            maxLength={100}
                        />
                    </div>

                    <div className="profile-field">
                        <label>City</label>
                        <input 
                            placeholder="(required)"
                            value={city}
                            onChange={e => setCity(e.target.value.slice(0, 100))}
                            maxLength={100}
                        />
                    </div>

                    <div className="profile-field">
                        <label>State</label>
                        <select
                            value={state}
                            onChange={e=>setState(e.target.value)} 
                        >
                            <option value="">Select a state...</option>
                            <option value="AL">AL</option>
                            <option value="AK">AK</option>
                            <option value="AZ">AZ</option>
                            <option value="AR">AR</option>
                            <option value="CA">CA</option>
                            <option value="CO">CO</option>
                            <option value="CT">CT</option>
                            <option value="DE">DE</option>
                            <option value="FL">FL</option>
                            <option value="GA">GA</option>
                            <option value="HI">HI</option>
                            <option value="ID">ID</option>
                            <option value="IL">IL</option>
                            <option value="IN">IN</option>
                            <option value="IA">IA</option>
                            <option value="KS">KS</option>
                            <option value="KY">KY</option>
                            <option value="LA">LA</option>
                            <option value="ME">ME</option>
                            <option value="MD">MD</option>
                            <option value="MA">MA</option>
                            <option value="MI">MI</option>
                            <option value="MN">MN</option>
                            <option value="MS">MS</option>
                            <option value="MO">MO</option>
                            <option value="MT">MT</option>
                            <option value="NE">NE</option>
                            <option value="NV">NV</option>
                            <option value="NH">NH</option>
                            <option value="NJ">NJ</option>
                            <option value="NM">NM</option>
                            <option value="NY">NY</option>
                            <option value="NC">NC</option>
                            <option value="ND">ND</option>
                            <option value="OH">OH</option>
                            <option value="OK">OK</option>
                            <option value="OR">OR</option>
                            <option value="PA">PA</option>
                            <option value="RI">RI</option>
                            <option value="SC">SC</option>
                            <option value="SD">SD</option>
                            <option value="TN">TN</option>
                            <option value="TX">TX</option>
                            <option value="UT">UT</option>
                            <option value="VT">VT</option>
                            <option value="VA">VA</option>
                            <option value="WA">WA</option>
                            <option value="WV">WV</option>
                            <option value="WI">WI</option>
                            <option value="WY">WY</option>
                        </select>
                    </div>

                    <div className="profile-field">
                        <label>Zip Code</label>
                        <input 
                            placeholder="(required)"
                            value={zipCode}
                            onChange={e => setZipCode(e.target.value.slice(0, 9))}
                            maxLength={9}
                        />
                    </div>

                    <div className="profile-field">
                    <label>Skills</label>
                    <CreatableSelect
                        isMulti
                        options={availableSkills}
                        value={availableSkills.filter(opt => skills.includes(opt.value))}
                        onChange={async (selected: any, actionMeta: any) => {
                            const newValues = selected.map((opt: any) => opt.value);
                            setSkills(newValues);
                            if (actionMeta.action === "create-option") {
                                const newSkill = selected[selected.length - 1].value;
                                try {
                                const res = await apiFetch("/skills", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ skill_name: newSkill }),
                                });

                                if (!res.ok) throw new Error("Failed to add skill");
                                console.log(`Added new skill: ${newSkill}`);
                                const updatedRes = await apiFetch("/skills");
                                const data = await updatedRes.json();
                                setAvailableSkills(
                                    data.map((s: any) => ({ value: s.skill_name, label: s.skill_name }))
                                );
                                } catch (err) {
                                console.error("Error adding skill:", err);
                                }
                            }
                        }}
                        placeholder="Select or create skills..."
                        styles={selectStyles}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Preferences</label>
                        <textarea
                            className="input-modern"
                            placeholder="Write any specific preferences...(optional)"
                            value={preferences}
                            onChange={e => setPreferences(e.target.value.slice(0, 500))} // optional limit
                            maxLength={500}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Availability</label>
                        <DatePicker
                            multiple
                            value={availability}
                            onChange={(dates: DateObject[]) => {setAvailability(dates);}}
                            format="MM/DD/YYYY"
                            placeholder="Select your available dates"
                        />
                    </div>

                    <div>
                        {err && <p className="error">{err}</p>}
                        <button type="submit" className="btn-primary h-12 text-base mt-2 w-1/4">Submit Profile</button>
                    </div>
                </form>
            </div>
        </ProfileLayout>
    );
}
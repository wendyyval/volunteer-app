import {useState} from 'react';
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import ProfileLayout from "../pages/ProfileLayout"; 


const skillOptions = [
  { value: "skill 1", label: "skill 1" },
  { value: "skill 2", label: "skill 2" },
  { value: "skill 3", label: "skill 3" },
  { value: "skill 4", label: "skill 4" },
  { value: "skill 5", label: "skill 5" },
  { value: "skill 6", label: "skil 6" },
];

export default function Profile() {

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

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");
        if(!fullName || !address1 || !city || !state || !zipCode || skills.length == 0 || availability.length == 0)
            return setErr("Plase fill in all required fields.")
        if(zipCode.length < 5)
            return setErr("Zip code must be at least 5 characters long.")
        alert("Profile saved!")
    }
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
                            onChange={e=>setFullName(e.target.value)}
                        />
                    </div>
                    
                    <div className="profile-field">
                        <label>Address 1</label>
                        <input 
                            placeholder="(required)"
                            value={address1}
                            onChange={e=>setAddress1(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Address 2</label>
                        <input 
                            placeholder="(optional)"
                            value={address2}
                            onChange={e=>setAddress2(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label>City</label>
                        <input 
                            placeholder="(required)"
                            value={city}
                            onChange={e=>setCity(e.target.value)}
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
                            onChange={e=>setZipCode(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label > Skills</label>
                        <Select isMulti
                            options={skillOptions}
                            value={skillOptions.filter(option => skills.includes(option.value))}
                            onChange={(selected) =>setSkills(selected.map(option => option.value))}
                            placeholder = "Select your skills..."
                            styles={{
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
                            }}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Preferences</label>
                        <textarea
                            className="input-modern"
                            placeholder="Write any specific preferences...(optional)"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
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
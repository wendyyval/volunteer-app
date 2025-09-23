import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Profile() {
    const nav = useNavigate();
    const [fullName, setFullName] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [skills, setSkills] = useState<string[]>([])
    const [preferences, setPreferences] = useState("")
    const [availability, setAvailability] = useState<Date[]>([])
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
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>
            <form onSubmit={onSubmit} className="flex flex-col space-y-4">

                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >Full Name</label>
                    <input 
                        className="border p-2 w-full rounded"
                        placeholder="(required)"
                        value={fullName}
                        onChange={e=>setFullName(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >Address 1</label>
                    <input 
                        className="border p-2 w-full rounded"
                        placeholder="(required)"
                        value={address1}
                        onChange={e=>setAddress1(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >Address 2</label>
                    <input 
                        className="border p-2 w-full rounded"
                        placeholder="(optional)"
                        value={address2}
                        onChange={e=>setAddress2(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >City</label>
                    <input 
                        className="border p-2 w-full rounded"
                        placeholder="(required)"
                        value={city}
                        onChange={e=>setCity(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >State</label>
                    <select
                        className="border p-2 rounded"
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

                <div className="flex flex-col">
                    <label className="mb-1 font-medium" >Zip Code</label>
                    <input 
                        className="border p-2 w-full rounded"
                        placeholder="(required)"
                        value={zipCode}
                        onChange={e=>setZipCode(e.target.value)}
                    />
                </div>


            </form>
        </div>
    );
}
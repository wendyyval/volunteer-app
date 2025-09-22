import {useState} from 'react';
import {useNavigate} from 'react-router-dom';


export default function Register(){
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    
    function isValidEmail(value: string){
        return /\S+@\S+\.\S+/.test(value);
    }

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");

        if(!isValidEmail(email)){
            return setErr("Please enter a valid email address.");
        }
        if(password.length < 6){
            return setErr("Password must be at least 6 characters long.");
        }
        //mock register
        //POST later
        alert("Registered! Please log in.");
        nav("/login");
    }
    return(
        <div className='container'>
            <h1>Sign Up Today!</h1>
            <form onSubmit={onSubmit} className="form">
                <label className="label">Email</label>
                <input
                    
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    />

                 
                <input
                    className="input"
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    />

                {err && <p className="error">{err}</p>}
                <button className="btn" type="submit">Create an Account</button>
            </form>
        </div>
    );
}

import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

export default function Login(){
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");
        if(!email || !password)
            return setErr("Email and password are required");

        //to mock login
        localStorage.setItem("token", "dev-token");
        localStorage.setItem("role", email.includes("admin") ? "admin" : "volunteer");
    
        nav("/profile");
    }

    return(
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    className="border p-2 w-full"
                    placeholder="Email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    />
                    <input
                    className="border p-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    />
                    {err && <p className="text-red-600 text-sm">{err}</p>}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
                    </form>
                    <p className="text-sm mt-3">
                        No account? <Link to="/register" className="text-blue-600">Register</Link>
                    </p>
        </div>
    );
}

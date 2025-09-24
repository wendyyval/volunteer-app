import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthLayout from "../AuthLayout";

export default function Login(){
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");
        if(!email || !password)
            return setErr("Email and password are required");
        if(!/\S+@\S+\.\S+/.test(email)){
            return setErr("Email is invalid. Please enter a valid email address.");
        }
        if(password.length < 6){
            return setErr("Password must be at least 6 characters long.");
        }
        setLoading(true);
        setTimeout(()=>{
            localStorage.setItem("token", "dev-token");
            localStorage.setItem("role", email.includes("admin") ? "admin" : "volunteer");
            nav("/profile");
        }, 500); //simulate api call delay
    }

    return(
        <AuthLayout>
            <h1 className='text-3xl font-semibold leading-tight mb-2'>Welcome back!</h1>
            <p className='text-gray-500 text-[15px] mb-8'>Sign in to start lending a hand!</p>
            <form onSubmit={onSubmit} className="grid gap-5">
                            <div className='grid gap-2' />
                                <label className='text-sm font-semibold'>Email</label>
                                <input
                                    className="input-modern input-lg"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                    autoComplete="email"
                                    inputMode="email"
                                />
                            <div className='grid gap-2'>
                                <label className="text-sm font-semibold">Password</label>
                                <input
                                    className="input-modern input-lg"
                                    type='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={e=>setPassword(e.target.value)}
                                    autoComplete='current-password'
                                />
                            </div>
            {err && <p className='error mt-1'>{err}</p>}

            <button className='btn-primary btn-block h-12 text-base mt-2' type = "submit" disabled={loading}>
                    {loading ? "Creating..." : "Sign in"}
                </button>
            </form>
        </AuthLayout>
    );
}

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { apiFetch } from "../utils/http";



export default function Login(){
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    // quick client-side checks
    if (!email || !password) return setErr("Email and password are required");
    if (!/\S+@\S+\.\S+/.test(email)) return setErr("Email is invalid. Please enter a valid email address.");
    if (password.length < 6) return setErr("Password must be at least 6 characters long.");

    setLoading(true);
    try {
        const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({} as any));

        if (!res.ok) {
        if (res.status === 401) return setErr("Invalid email or password.");
        if (res.status === 400) return setErr("Please check your inputs and try again.");
        return setErr(typeof data.error === "string" ? data.error : "Login failed.");
        }

        // success -> save token & role, navigate
        localStorage.setItem("token", data.token);
        if (data.user?.role) localStorage.setItem("role", data.user.role);
        // optional: toast.success("Welcome back!");
        nav("/profile"); // or "/history" — can be changed
    } catch {
        setErr("Network error. Please try again.");
    } finally {
        setLoading(false);
    }
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

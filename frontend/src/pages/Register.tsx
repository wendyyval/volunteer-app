import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";
import { apiFetch } from "../utils/http";



export default function Register(){
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("Submitting form...");
        setErr("");


    if (!/\S+@\S+\.\S+/.test(email)) return setErr("Please enter a valid email address.");
    if (!email || !password) return setErr("Email and password are required");
    if (password.length < 6) return setErr("Password must be at least 6 characters long.");

    setLoading(true);
    try {
        const API_BASE =
            import.meta.env.VITE_API_URL || "http://localhost:3000";

        console.log("API_BASE →", API_BASE);

        const res = await apiFetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            });

       
        const data = await res.json().catch(() => ({} as any));

        if (!res.ok) {
      
        if (res.status === 409) return setErr("This email is already registered.");
        if (res.status === 400) return setErr("Please check your inputs and try again.");
        return setErr(typeof data.error === "string" ? data.error : "Registration failed.");
        }

      
        toast.success("Account created. Please sign in.");
        setTimeout(() => nav("/login"), 600);
    } catch (err) {
        setErr("Network error. Please try again.");
    } finally {
        setLoading(false);
    }
    }
    return(
        <AuthLayout>
            <h1 className="text-3xl font-semibold text-white mb-2">Create an account today!</h1>
            <p className="text-slate-300 mb-8">Join us in making a difference!</p>

            <form onSubmit ={onSubmit} className="grid gap-5" noValidate>
                <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-200">Email</label>
                    <input
                        className="input-modern input-lg"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        autoComplete={"email"}
                        />
                </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-200">Password</label>
                            <input
                                className="input-modern input-lg"
                                type="password"
                                placeholder="Must have at least 6 characters"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                                autoComplete="new-password"
                                />
                        </div>

                        {err && <p className="error mt-1">{err}</p>}
                        
                        <button className="btn-primary btn-block h-12 text-base mt-2" type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                            
                    </form>
        </AuthLayout>
        
    );
}
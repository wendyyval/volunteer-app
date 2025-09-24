import { Link, useLocation} from "react-router-dom";
import type {ReactNode} from "react";
import hero from "./assets/64646.jpg";


export default function AuthLayout({children}: {children: ReactNode}){
    const { pathname } = useLocation();
    const isLogin = pathname === "/login";
    const isRegister = pathname === "/register";
    return(
        <div className="auth-shell min-h-screen relative overflow-hidden">
            {/*background circles*/}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] to-[#0f172a]" />
            {/*blurred circles*/}
            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-400 rounded-full opacity-30 blur-3xl animate-blob animation-delay-4000" />
            
            {/*main content*/}
            <div className="relative z-10 grid place-items-center px-6 py-16 min-h-screen">
                <div className="auth-frame">
                    {/*left visual*/}
                    <div className="auth-visual relative hidden md:block">
                        <div className="visual-frame">
                        <img src={hero} alt="Volunteering" className="h-full w-full object-cover" />
                        </div>
                    
                    {/*brand row*/}
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-white/90">
                        <svg width={22} height={22} viewBox='0 0 24 24' aria-hidden="true">
                            <path 
                            fill="currentColor" 
                            d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 1 1 0 8h-1v1a5 5 0 1 1-10 0v-1H6a4 4 0 1 1 0-8h1V7a5 5 0 0 1 5-5z"></path>
                        </svg>
                        <span className='font-semibold'>HelpingHands</span>
                    </div>

                    <div className="absolute bottom-6 left-6 text-white/80">
                        <p className="text-lg font-medium">Empower change. One act at a time.</p>
                        <Link to ="/" className="underline text-sm">Back to Home</Link>
                    </div>
                </div>
            <div className="auth-form">
                {/*right side*/}
                <div className="aith-form p-8 md:p-12">
                    <div className="auth-tabs mb-8" role="tablist" aria-label="Authentication">
                        <Link
                            to="/login"
                            className={`auth-tab ${isLogin ? "is-active" : ""}`}
                            aria-current={isLogin ? "page" : undefined}
                            >
                                Sign In
                        </Link>
                        <Link
                            to="/register"
                            className={`auth-tab ${isRegister ? "is-active": ""}`}
                            aria-current={isRegister ? "page" : undefined}
                            >
                                Create Account
                            </Link>
                </div>

                    {children}
                    </div>
            </div>
        </div>
    </div>
    </div>
    );
}                    
                    
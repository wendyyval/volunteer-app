import {useNavigate} from "react-router-dom";
import volunteerImage from "../assets/pano_volunteer.jpg";
import MainLayout from "../layouts/MainLayout";

export default function Home(){
    const nav = useNavigate();

    return(
        <MainLayout>
        <div className="home-container min-h-screen text-white bg-gradient-to-b from-[#1a1a2e] to -[#16213e]">
            <header className="px-8 pt-20 pb-16 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                        Welcome! Find Volunteer Opportunities Near You
                </h1>
                <p className="mt-4 text-lg opacity-90 max-w-2xl">
                    Join us in making a diffrence, explore new opportunities, connect and grow with your community!
                </p>
            

            {/*<div className="flex justify-center gap-6 mt-10">
                <button onClick={() => nav("/login")}
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-md"
                >
                    Login
                </button>
            <button onClick={() => nav("/register")}
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-md"
                >
                    Register
            </button>
            </div>*/}
        </header>
        
        <div className="w-full flex justify-center">
            <img
                src={volunteerImage}
                alt="Volunteers at a food drive"
                className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl object-cover"
                style={{maxHeight: "420px"}}
                />
        </div>

        <section className="text-center mt-16 mb-20">
            <h2 className="text-3xl font-bold mb-4">Start Helping a Hand and Make a Change</h2>
            <p className="text-gray-300 mb-6">
                Discover local volunteer opportunities near you, connect with organizations to make an impact within your community, and start helping someone today!

            </p>
            <button onClick={() => nav("/manage")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md">
                Explore Events
            </button>
        </section>
        </div>

        <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                <div className="bg-white/5 border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-2">Find Opportunities</h3>
                    <p className="text-gray-300">
                        Search hundreds of local volunteer events tailored to your interests and skills. Make a difference anytime, anywhere.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                <div className="bg-white/5 border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-2">Connect with Nonprofits</h3>
                    <p className="text-gray-300">
                        Discover local organizations in need of volunteers. You can help and build meaningful connections within your community. Add your own organization too!
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                <div className="bg-white/5 border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-2">Track Your Impact</h3>
                    <p className="text-gray-300">
                        View and track your volunteer history, hours, events attended, and upcoming opportunities all in one place.
                    </p>
                </div>
            </div>
        </section>
        </MainLayout>
    );
}
            
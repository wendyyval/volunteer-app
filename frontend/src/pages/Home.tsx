import {useNavigate} from "react-router-dom";
import volunteerImage from "../assets/pano_volunteer.jpg";
import girlVolunteer from "../assets/volunteer.jpg";
import groupPlant from "../assets/group_plant.jpg";
import groupOrg from "../assets/organization_volunteer.jpg";
import MainLayout from "../layouts/MainLayout";

export default function Home(){
    const nav = useNavigate();

    return(
        <MainLayout>
            <div className="home-page-container">
                <div className="home-banner">
                    <img
                        src={volunteerImage}
                        alt="Volunteers at a food drive"
                        className="home-header-img"
                        style={{maxHeight: "420px"}}
                        />
                    <div className="home-header-overlay">
                        <h1 className="home-header-title">
                                Welcome! Find Volunteer Opportunities Near You
                        </h1>
                        <p className="home-header-subtitle">
                            Join us in making a difference, explore new opportunities, connect and grow with your community!
                        </p>
                    </div>
                </div>

                <div className="home-intro">
                    <p>
                        Discover local volunteer opportunities near you, connect with organizations to make an impact within your community, and start helping someone today! 
                        Whether you are supporting local food banks or participating in community clean-ups, every effort brings change. 
                        Join us in making a difference!
                    </p>
                    <button className="home-intro-btn"
                        onClick={() => nav("/register")}>
                            Start helping today!
                    </button>
                </div>
                
                    <div className="home-card-grid">

                        <div className="home-card">
                            <img
                            src={groupPlant}
                            alt="group of people holding a plant"
                            className="home-card-img"
                            />
                            <h3>Find Opportunities</h3>
                            <p>
                                Search hundreds of local volunteer events tailored to your interests and skills. Make a difference anytime, anywhere.
                            </p>
                        </div>


                        <div className="home-card">
                            <img
                            src={groupOrg}
                            alt="Group organization at a volunteer event"
                            className="home-card-img"
                            />
                            <h3>Connect with Nonprofits</h3>
                            <p>
                                Discover local organizations in need of volunteers. You can help and build meaningful connections within your community. Add your own organization too!
                            </p>
                        </div>


                        <div className="home-card">
                            <img
                            src={girlVolunteer}
                            alt="Girl volunteer"
                            className="home-card-img"
                            />
                            <h3>Track Your Impact</h3>
                            <p>
                                View and track your volunteer history, hours, events attended, and upcoming opportunities all in one place.
                            </p>
                        </div>

                    </div>
            </div>
        </MainLayout>
    );
}
            
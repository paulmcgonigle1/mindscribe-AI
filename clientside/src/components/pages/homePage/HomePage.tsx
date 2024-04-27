import { useNavigate } from "react-router-dom";

import Services from "./Features";
import Icon4 from "../../../assets/mindscribe2/svg/logo-no-background.svg";

import Illustration1 from "../../../assets/mindscribe2/svg/park.svg";
import AboutSection from "./AboutSection";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
interface HomePageProps {}

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="bg-gra shadow-md">
      <div className="mx-40 flex justify-between items-center py-4">
        <img src={Icon4} alt="MindScribe Logo" className="h-20" />
        <div>
          <button
            onClick={() => handleScroll("services")}
            className="text-gray-800 hover:text-gray-600 px-3 font-medium"
          >
            Services
          </button>
          <button
            onClick={() => handleScroll("testimonials")}
            className="text-gray-800 hover:text-gray-600 px-3 font-medium"
          >
            Testimonials
          </button>
          <button
            onClick={() => handleScroll("about")}
            className="text-gray-800 hover:text-gray-600 px-3 font-medium"
          >
            About
          </button>
          <button
            onClick={() => navigate("/sign-up", { state: { isLogin: true } })}
            className="bg-warm-orange-bright hover:bg-warm-orange-dark text-black font-semibold py-2 px-4 rounded ml-4"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/sign-up", { state: { isLogin: false } })}
            className="bg-warm-orange-bright hover:bg-warm-orange-dark text-black font-semibold py-2 px-4 rounded ml-2"
          >
            Signup
          </button>
        </div>
      </div>
    </nav>
  );
};
const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light-yellow">
      <Navbar />

      <div className=" mx-40  ">
        {/* Main container with grid layout */}
        <div className="pl-10 pt-30 grid grid-cols-1 md:grid-cols-2 items-center h-[50vh]">
          {/* Text container */}
          <div className="flex flex-col space-y-8 pl-20">
            <h1 className="text-5xl text-gray-800 font-semibold mb-4">
              Welcome to MindScribe
            </h1>
            <p className="text-lg text-gray-600 mb-4 ">
              Your personal space to reflect, grow, and track your mental health
              journey. Discover insights, track your mood, and get personalized
              tasks to help improve your mental health
            </p>

            <div className="flex flex-col items-start space-y-4">
              <button
                onClick={() =>
                  navigate("/sign-up", { state: { isLogin: true } })
                }
                className="bg-warm-orange-bright hover:bg-warm-orange-dark text-black font-semibold py-2 px-4 rounded"
              >
                Try Mindscribe now
              </button>
            </div>
          </div>
          {/* Image container */}
          <div className="hidden md:block">
            {/* Replace with your image path */}
            <img
              src={Illustration1}
              alt="Descriptive Alt Text"
              className=" pl-56 h-[40vh] "
            />
          </div>
        </div>

        <div id="services">
          <Services />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="about" className="mb-10">
          <AboutSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

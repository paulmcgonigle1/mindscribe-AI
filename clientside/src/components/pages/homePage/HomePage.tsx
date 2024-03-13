import { useNavigate } from "react-router-dom";

import Services from "./Features";
import Icon4 from "../../../assets/journaling.png";
interface HomePageProps {
  // Define any props you might need. For now, it seems we don't need any.
}

const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className=" px-28 bg-light-yellow ">
      {/* Main container with grid layout */}
      <div className="pt-40 grid grid-cols-1 md:grid-cols-2 items-center h-[50vh]">
        {/* Text container */}
        <div className="flex flex-col space-y-8">
          <h1 className="text-5xl text-gray-800 font-bold mb-4">
            Welcome to MindScribe
          </h1>
          <p className="text-lg text-gray-600 mb-6 ">
            Your personal space to reflect, grow, and track your mental health
            journey.
          </p>

          <div className="flex flex-col items-start space-y-4">
            <button
              onClick={() => navigate("/sign-up", { state: { isLogin: true } })}
              className="bg-warm-orange-bright hover:bg-warm-orange-dark text-black font-semibold py-2 px-4 rounded"
            >
              Login
            </button>
            <button
              onClick={() =>
                navigate("/sign-up", { state: { isLogin: false } })
              }
              className=" bg-warm-orange-bright hover:bg-warm-orange-dark text-black font-semibold py-2 px-4 rounded"
            >
              Signup
            </button>
            <p className="text-gray-500 font-sans">
              Discover insights, track your mood, and get personalized tasks to
              help improve your mental health.
            </p>
          </div>
        </div>
        {/* Image container */}
        <div className="hidden md:block">
          {/* Replace with your image path */}
          <img
            src={Icon4}
            alt="Descriptive Alt Text"
            className="px-20 h-[40vh] object-cover"
          />
        </div>
      </div>
      <Services />
    </div>
  );
};

export default HomePage;

import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import Icon4 from "../../../assets/mindscribe/png/logo-black.png";
function SignupPage() {
  const location = useLocation(); // Correctly call useLocation
  // Extract the login from the state passed through on the home page
  const initialState = location.state?.isLogin ?? true;
  // State for the user's input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState<ErrorData>({});
  const [errorMessage, setErrorMessage] = useState("");

  const [isLogin, setIsLogin] = useState(initialState); //sets the toggle between sign up or login
  const navigate = useNavigate();
  const { registerUser, loginUser } = useContext(AuthContext)!; // Adjust according to your context
  interface ErrorData {
    [key: string]: string[]; // Dynamic keys with array of error messages
  }
  const handleSignup = async (event: any) => {
    registerUser(
      event,
      () => navigate("/"),
      (errorData: ErrorData) => {
        setErrors(errorData); // Update the state with the returned errors
      }
    );
  };
  //setting whether the form is login or sign-up mode
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }
    loginUser(
      e,
      () => navigate("/"),
      (error: any) => {
        setErrorMessage(error); // Set the error message received from loginUser
        console.error(error); // Optionally log the error
      }
    );
  };

  return (
    <section className="flex  justify-center min-h-screen items-center bg-light-yellow">
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg ">
              <div className="g-0 lg:flex lg:flex-wrap">
                {/* <!-- Left column container--> */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    {/* <!--Logo--> */}
                    <button
                      onClick={() => navigate("/home")}
                      className="text-md text-black  bg-warm-orange-bright mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 max-w-max font-medium  leading-normal"
                    >
                      Return to home
                    </button>
                    <div className="md:mx-6 md:p-12">
                      {/* Conditional rendering based on isLogin state */}
                      {isLogin ? (
                        <>
                          <div className="text-center">
                            <img
                              className="mx-auto w-96"
                              src={Icon4}
                              alt="logo"
                            />
                            <h4 className="mb-12 mt-1 pb-1 text-xl text-black ">
                              Login to your Mindscribe account
                            </h4>
                          </div>
                          {/* Login Form */}
                          <form onSubmit={handleLogin}>
                            {errorMessage && (
                              <div className="text-red-500 text-center mb-4">
                                {errorMessage}
                              </div>
                            )}

                            <p className="mb-4 text-black">
                              Please Login an account
                            </p>
                            {/* <!--Username input--> */}
                            <label
                              className="block text-gray-800 text-sm  mb-2"
                              htmlFor="username"
                            >
                              Username
                            </label>
                            <input
                              type="text"
                              value={username}
                              name="username"
                              className="mb-4"
                              onChange={(e) => setUsername(e.target.value)}
                            ></input>

                            {/* <!--Password input--> */}
                            <label
                              className="block text-gray-700 text-sm  mb-2"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              className="mb-4"
                              placeholder="****"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>

                            {/* <!--Submit button--> */}
                            <div className="mb-12 pb-1 pt-1 text-center">
                              <button
                                className="bg-warm-orange-bright mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs uppercase leading-normal text-black "
                                type="submit"
                              >
                                Login
                              </button>

                              {/* <!--Forgot password link--> */}

                              <a className="text-black" href="#!">
                                Terms and conditions
                              </a>
                            </div>

                            {/* <!--Register button--> */}
                            <div className="flex items-center justify-between pb-6">
                              {/* <p className="mb-0 mr-2">Have an account?</p> */}
                              <p className="mb-0 mr-2 text-black">
                                Don't have an account?
                              </p>

                              <button
                                type="button"
                                onClick={toggleForm}
                                className="bg-rich-green text-black inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal  "
                              >
                                Sign up.
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        // SIGN UP BEGGINS HERE ---------------------------------------------------------------
                        <>
                          <div className="text-center">
                            <img
                              className="mx-auto w-96"
                              src={Icon4}
                              alt="logo"
                            />
                            <h4 className="mb-12 mt-1 pb-1 text-xl text-black">
                              Sign-Up to join The Mindscribe Team
                            </h4>
                          </div>
                          {/* Sign Up Form */}
                          <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                              <label
                                className="block text-gray-700 text-sm mb-2"
                                htmlFor="username"
                              >
                                Username
                              </label>
                              <input
                                type="text"
                                value={username}
                                name="username"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-gray-700 text-sm mb-2"
                                htmlFor="email"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                value={email}
                                name="email"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-gray-700 text-sm mb-2"
                                htmlFor="password"
                              >
                                Password
                              </label>
                              <div className="flex items-center">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="ml-2 text-gray-600 hover:text-gray-800 p-2"
                                  aria-label={
                                    showPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  <i
                                    className={
                                      showPassword
                                        ? "fas fa-eye-slash"
                                        : "fas fa-eye"
                                    }
                                  ></i>
                                </button>
                              </div>
                            </div>
                            <div>
                              <label
                                className="block text-gray-700 text-sm mb-2"
                                htmlFor="password2"
                              >
                                Verify Password
                              </label>
                              <div className="flex items-center">
                                <input
                                  type={showPassword2 ? "text" : "password"}
                                  name="password2"
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  value={password2}
                                  onChange={(e) => setPassword2(e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowPassword2(!showPassword2)
                                  }
                                  className="ml-2 text-gray-600 hover:text-gray-800 p-2"
                                  aria-label={
                                    showPassword2
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  <i
                                    className={
                                      showPassword2
                                        ? "fas fa-eye-slash"
                                        : "fas fa-eye"
                                    }
                                  ></i>
                                </button>
                              </div>
                            </div>
                            {errors.non_field_errors &&
                              errors.non_field_errors.map((message, index) => (
                                <p
                                  key={index}
                                  className="text-red-500 text-center"
                                >
                                  {message}
                                </p>
                              ))}
                            {errorMessage && (
                              <div className="text-red-500 text-sm mb-2">
                                {errorMessage}
                              </div>
                            )}
                            <div className="text-center">
                              <button
                                className="bg-warm-orange-bright inline-block w-full rounded px-6 pb-2 pt-2.5 text-sm uppercase leading-normal text-black mt-4"
                                type="submit"
                              >
                                Sign up
                              </button>

                              {/* <!--Forgot password link--> */}
                              <a className="text-black" href="#!">
                                Terms and conditions
                              </a>
                            </div>

                            {/* <!--Register button--> */}
                            <div className="flex items-center justify-between pb-6">
                              <p className="mb-0 mr-2 text-black">
                                Have an account?
                              </p>

                              <button
                                type="button"
                                onClick={toggleForm}
                                className="bg-rich-green text-black inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal  "
                              >
                                Log in.
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* <!-- Right column container with background and description--> */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                  style={{
                    background:
                      "linear-gradient(to right, #F9CC48, #FDDA77, #A9C9FF, #729BFF)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold text-black">
                      Join us to access the many offered features
                    </h4>
                    <div>
                      <p className="text-md text-black">
                        Welcome to MindScribe, where your journey towards
                        improved mental wellness begins. Our platform offers a
                        secure and private environment for you to express your
                        thoughts and feelings through journaling. By tracking
                        your mood and thoughts daily, MindScribeAI helps you
                        uncover patterns and insights that can lead to greater
                        self-awareness and emotional well-being. Join us to
                        discover new ways to manage stress, enhance your mood,
                        and cultivate a positive mindset. Every entry is a step
                        forward in your personal growth journey, and our
                        AI-driven insights will guide you along the way.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;

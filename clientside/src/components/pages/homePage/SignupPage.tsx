import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import { TEInput, TERipple } from "tw-elements-react";
import Icon4 from "../../../assets/journaling.png";
function SignupPage() {
  const location = useLocation(); // Correctly call useLocation
  // Extract the login from the state passed through on the home page
  const initialState = location.state?.isLogin ?? true;
  // State for the user's input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<ErrorData>({});

  const [isLogin, setIsLogin] = useState(initialState); //sets the toggle between sign up or login
  const navigate = useNavigate();
  const { registerUser, loginUser } = useContext(AuthContext)!; // Adjust according to your context
  interface ErrorData {
    [key: string]: string[]; // Dynamic keys with array of error messages
  }
  const handleSignup = async (event: any) => {
    // Here you will call your context or service to register the user
    // Adjust registerUser to match your implementation
    registerUser(
      event,
      () => navigate("/multi-step-form"),
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
    // Wrap navigate in a function to pass as onSuccess callback
    loginUser(e, () => navigate("/"));
  };

  return (
    <section className="flex  justify-center min-h-screen items-center bg-neutral-200 dark:bg-neutral-700 ">
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                {/* <!-- Left column container--> */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    {/* <!--Logo--> */}
                    <button
                      onClick={() => navigate("/home")}
                      className="text-xl text-white  bg-blue-500 mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 max-w-max font-medium  leading-normal"
                    >
                      Return to home
                    </button>
                    <div className="md:mx-6 md:p-12">
                      {/* Conditional rendering based on isLogin state */}
                      {isLogin ? (
                        <>
                          <div className="text-center">
                            <img
                              className="mx-auto w-48"
                              src={Icon4}
                              alt="logo"
                            />
                            <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                              Login to your mindscribe account
                            </h4>
                          </div>
                          {/* Login Form */}
                          <form onSubmit={handleLogin}>
                            <p className="mb-4">Please Login an account</p>
                            {/* <!--Username input--> */}
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
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
                              className="block text-gray-700 text-sm font-bold mb-2"
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
                              <TERipple rippleColor="light" className="w-full">
                                <button
                                  className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                  type="submit"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                                  }}
                                >
                                  Login
                                </button>
                              </TERipple>

                              {/* <!--Forgot password link--> */}

                              <a href="#!">Terms and conditions</a>
                            </div>

                            {/* <!--Register button--> */}
                            <div className="flex items-center justify-between pb-6">
                              {/* <p className="mb-0 mr-2">Have an account?</p> */}
                              <TERipple rippleColor="light">
                                <button
                                  type="button"
                                  onClick={toggleForm}
                                  className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                                >
                                  Don't have an account? Sign up.
                                </button>
                              </TERipple>
                            </div>
                          </form>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <img
                              className="mx-auto w-48"
                              src={Icon4}
                              alt="logo"
                            />
                            <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                              Sign-Up to join The Mindscribe Team
                            </h4>
                          </div>
                          {/* Sign Up Form */}
                          <form onSubmit={handleSignup}>
                            <p className="mb-4">Please register an account</p>
                            {/* <!--Username input--> */}
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
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
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              value={email}
                              name="email"
                              className="mb-4"
                              onChange={(e) => setEmail(e.target.value)}
                            ></input>

                            {/* <!--Password input--> */}
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
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

                            {/* <!--Password input--> */}
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="password2"
                            >
                              Verify Password
                            </label>
                            <input
                              type="password"
                              name="password2"
                              className="mb-4"
                              placeholder="****"
                              value={password2}
                              onChange={(e) => setPassword2(e.target.value)}
                            ></input>
                            {errors.non_field_errors &&
                              errors.non_field_errors.map((message, index) => (
                                <p key={index} className="error">
                                  {message}
                                </p>
                              ))}

                            {/* <!--Submit button--> */}
                            <div className="mb-12 pb-1 pt-1 text-center">
                              <TERipple rippleColor="light" className="w-full">
                                <button
                                  className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                  type="submit"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                                  }}
                                >
                                  Sign up
                                </button>
                              </TERipple>

                              {/* <!--Forgot password link--> */}
                              <a href="#!">Terms and conditions</a>
                            </div>

                            {/* <!--Register button--> */}
                            <div className="flex items-center justify-between pb-6">
                              <p className="mb-0 mr-2">Have an account?</p>
                              <TERipple rippleColor="light">
                                <button
                                  type="button"
                                  onClick={toggleForm}
                                  className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                                >
                                  Log in.
                                </button>
                              </TERipple>
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
                      "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      Join us to access the many offered features
                    </h4>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
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

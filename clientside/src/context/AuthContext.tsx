import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  //using forms
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any
  ) => Promise<void>;
  //logout
  logoutUser: () => void;
  //using forms
  registerUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any,
    onError: any
  ) => Promise<void>;
  user: { name?: string; username?: string } | null; // Auser property to store user information
  authTokens: { access: string; refresh?: string } | null; //]adjust as necessary
}
// Create context with an initial value of the same type or undefined

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

// props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

type AuthTokens = {
  access: string;
  refresh: string;
} | null;

interface MyTokenPayload {
  username: string;
  // include other properties you expect to have
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use a function to initialize authTokens state lazily
  const [authTokens, setAuthTokens] = useState<AuthTokens>(() => {
    try {
      // Attempt to get the item from localStorage
      const item = localStorage.getItem("authTokens");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      // If an error occurs, log it and return null
      console.error("Error reading authTokens from localStorage:", error);
      return null;
    }
  });
  let [user, setUser] = useState<{ username: string } | null>(null);
  let [loading, setLoading] = useState(true);

  //this is called every time this page is refreshed.
  useEffect(() => {
    // If authTokens are present, decode them to set the user (you might already be doing something similar)
    const token = authTokens?.access; // Assuming authTokens has an 'access' property holding the token string
    if (token && typeof token === "string") {
      try {
        // Assuming you have a function to decode the JWT and extract user info
        const decodedUser = jwtDecode<MyTokenPayload>(authTokens.access); // Make sure to define or import jwtDecode
        // console.log(
        //   "Below is JWT token details after decode -- these can be updated"
        // );
        // console.log(decodedUser);
        setUser({ username: decodedUser.username });
      } catch (error) {
        console.error("Error decoding authTokens:", error);
      }
    }
  }, [authTokens]); // Re-run this effect if authTokens change

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: () => void
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log(
      "Form Submitted with username:" + username + " and password: " + password
    );
    try {
      // needs to be updated to use AXIOS THROUGH the service like all of the other ones
      let response = await fetch(
        "https://mindscribe-36297a9e5954.herokuapp.com/myapp/api/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      let data = await response.json();
      //this gets the jwt response access token and set sit or errors
      if (response.status === 200) {
        setAuthTokens(data);
        //using jwt decode to get the access key
        setUser(jwtDecode(data.access));
        //setting authJWTTokens in localStorage
        localStorage.setItem("authTokens", JSON.stringify(data));
        //for working with login
        onSuccess(); // Execute the callback after successful login
      } else {
        alert("Something Went Wrong in authcontext");
      }

      // console.log("Login Success", data);
      // console.log("response", response);
      //end of try
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  //for logging user out and resettin user and tokens
  let logoutUser = () => {
    console.log("calling logoutUser in Auth Provider");
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };
  //to register a user
  const registerUser = async (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: () => void,
    onError: (errorData: any) => void
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;

    try {
      //
      let response = await fetch(
        "https://mindscribe-36297a9e5954.herokuapp.com/myapp/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, password2 }),
        }
      );
      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        onError(errorData); // Save error messages to state
      }
    } catch (error) {
      console.error("An error occured during the signup", error);
      onError({ non_field_errors: ["An unexpected error occurred."] }); // Provide a way to handle unexpected errors
    }
  };

  let updateToken = async () => {
    console.log("Update Token Called");

    if (authTokens) {
      let response = await fetch(
        "https://mindscribe-36297a9e5954.herokuapp.com/myapp/api/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        console.log("Token updated and refreshed successfully");
        //using jwt decode to get the access key
        setUser(jwtDecode(data.access));
        //setting authJWTTokens in localStorage
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
      //sets loading false if
      if (loading) {
        setLoading(false);
      }
    } else {
      console.log("No authTokens available for refresh");
    }
  };

  let contextData: AuthContextType = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    user: user,
    authTokens: authTokens,
  };

  //for refreshing token every 5 mins
  useEffect(() => {
    if (loading) {
      updateToken();
    }
    //can update this if needed
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens && authTokens.refresh) {
        updateToken();
      }
    }, fourMinutes); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [authTokens, loading]); // Consider if `loading` is necessary here
  return (
    //also adding condition that none of the children render out before loading completed
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthContextType {
  //using forms
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any,
    onError: any
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
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
    // If authTokens are present, decode them to set the user
    const token = authTokens?.access;
    if (token && typeof token === "string") {
      try {
        // Assuming you have a function to decode the JWT and extract user info
        const decodedUser = jwtDecode<MyTokenPayload>(authTokens.access); // Make sure to define or import jwtDecode

        // console.log(decodedUser);
        setUser({ username: decodedUser.username });
      } catch (error) {
        console.error("Error decoding authTokens:", error);
      }
    }
  }, [authTokens]); // Re-run this effect if authTokens change

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: () => void,
    onError: (errorMessage: string) => void
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await axios.post(
        "https://mindscribe-36297a9e5954.herokuapp.com/myapp/api/token/",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      onSuccess(); // Execute the callback after successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let errorMessage =
          "Authentication failed. Please check your credentials.";
        if (error.response) {
          // More specific error handling if the server sends a response
          errorMessage = error.response.data.detail || errorMessage;
        }
        onError(errorMessage); // Pass the error message to the onError callback
      } else {
        console.error("Login request failed:", error);
        onError("An error occurred during login.");
      }
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

    // Check if passwords match
    if (password !== password2) {
      onError({ non_field_errors: ["Passwords do not match."] });
      return;
    }

    try {
      const response = await axios.post(
        "https://mindscribe-36297a9e5954.herokuapp.com/myapp/api/register/",
        {
          username,
          email,
          password,
          password2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onSuccess();
      } else {
        // Handle non-200 HTTP responses
        onError(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Error responses from the server will be handled here
        onError(error.response.data);
      } else {
        // Generic error handling if the error is not from Axios
        console.error("An error occurred during the signup", error);
        onError({ non_field_errors: ["An unexpected error occurred."] });
      }
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

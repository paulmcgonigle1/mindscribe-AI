import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define a type for  context state
interface AuthContextType {
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any
  ) => Promise<void>;
  logoutUser: () => void; // Define logoutUser function type
  user: { name?: string; username?: string } | null; // Add a user property to store user information
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

  interface MyTokenPayload {
    username: string;
    // include other properties you expect to have
  }

  useEffect(() => {
    // If authTokens are present, decode them to set the user (you might already be doing something similar)
    const token = authTokens?.access; // Assuming authTokens has an 'access' property holding the token string
    if (token && typeof token === "string") {
      try {
        // Assuming you have a function to decode the JWT and extract user info
        const decodedUser = jwtDecode<MyTokenPayload>(authTokens.access); // Make sure to define or import jwtDecode
        console.log(decodedUser);
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

    console.log("Form Submitted with:", username, password);
    try {
      // example, needs to be updated to a service perhaps
      let response = await fetch("http://127.0.0.1:8000/myapp/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

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
        alert("Something Went Wrong");
      }

      console.log("Login Success", data);
      console.log("response", response);
      //end of try
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  //for logging user out and resettin user and tokens
  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  let contextData: AuthContextType = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    user: user,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define a type for  context state
interface AuthContextType {
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any
  ) => Promise<void>;
  user: { name?: string; username?: string } | null; // Add a user property to store user information
}
// Create context with an initial value of the same type or undefined

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

// props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  localStorage.getItem("authTokens");
  let [authTokens, setAuthTokens] = useState<string | null>(null);
  let [user, setUser] = useState<{ name: string } | null>(null);

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

  let contextData: AuthContextType = {
    loginUser,
    user: user,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

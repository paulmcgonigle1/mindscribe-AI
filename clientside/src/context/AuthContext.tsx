import { createContext, useState, useEffect, ReactNode } from "react";

// Define a type for  context state
interface AuthContextType {
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  user: { name: string } | null; // Add a user property to store user information
}
// Create context with an initial value of the same type or undefined

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

// props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  let [authToken, setAuthTokens] = useState<string | null>(null);
  let [user, setUser] = useState<{ name: string } | null>(null);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log("Form Submitted with:", username, password);
    try {
      // example, needs to be updated
      let response = await fetch("http://127.0.0.1:8000/myapp/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      console.log("Login Success", data);
      //end of try
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  let contextData: AuthContextType = {
    loginUser,
    user,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

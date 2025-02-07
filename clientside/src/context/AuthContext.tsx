import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthContextType {
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any,
    onError: any
  ) => Promise<void>;
  logoutUser: () => void;
  registerUser: (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: any,
    onError: any
  ) => Promise<void>;
  user: { name?: string; username?: string } | null;
  authTokens: { access: string; refresh?: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

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
      const item = localStorage.getItem("authTokens");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading authTokens from localStorage:", error);
      return null;
    }
  });

  let [user, setUser] = useState<{ username: string } | null>(null);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authTokens?.access;
    if (token && typeof token === "string") {
      try {
        const decodedUser = jwtDecode<MyTokenPayload>(authTokens.access);
        setUser({ username: decodedUser.username });
      } catch (error) {
        console.error("Error decoding authTokens:", error);
      }
    }
  }, [authTokens]);

  // ✅ Get API base URL from environment variable
  const API_URL = "https://mindscribe-ai-05be876e196b.herokuapp.com";

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
        `${API_URL}/myapp/api/token/`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let errorMessage =
          "Authentication failed. Please check your credentials.";
        if (error.response) {
          errorMessage = error.response.data.detail || errorMessage;
        }
        onError(errorMessage);
      } else {
        console.error("Login request failed:", error);
        onError("An error occurred during login.");
      }
    }
  };

  let logoutUser = () => {
    console.log("calling logoutUser in Auth Provider");
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

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

    if (password !== password2) {
      onError({ non_field_errors: ["Passwords do not match."] });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/myapp/api/register/`,
        { username, email, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || 201) {
        console.log("New user signed up");
        onSuccess();
      } else {
        onError(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        onError(error.response.data);
      } else {
        console.error("An error occurred during signup", error);
        onError({ non_field_errors: ["An unexpected error occurred."] });
      }
    }
  };

  let updateToken = async () => {
    console.log("Update Token Called");

    if (authTokens) {
      let response = await fetch(`${API_URL}/myapp/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        console.log("Token updated and refreshed successfully");
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }

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

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens && authTokens.refresh) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

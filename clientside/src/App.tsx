import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./components/pages/statsPage/StatsDashboard";
import Layout from "./components/shared/Layout";
import Products from "./components/pages/statsPage/Products";
import JournalDashboard from "./components/pages/mainPage/JournalDashboard";
import StatsDashboard from "./components/pages/statsPage/StatsDashboard";
import ImprovementsDashboard from "./components/pages/improvementsPage/ImprovementsDashboard";
import HomePage from "./components/pages/homePage/HomePage";
import LoginPage from "./components/pages/homePage/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import Settings from "./components/pages/settingsPage/Settings";
import SignupPage from "./components/pages/homePage/SignupPage";
import Questionnaire from "./components/pages/homePage/multi-step-form/page";
// Example authentication check function

function App() {
  const ProtectedRoute = () => {
    const { authTokens } = useContext(AuthContext) ?? {};

    return authTokens ? <Outlet /> : <Navigate to="/sign-up" replace />;
  };
  // Correctly handle potentially undefined context
  const authContext = useContext(AuthContext);

  // This fixed my undefined error
  const { user } = authContext ?? {};

  return (
    //Auth Provider now allow the context to be available throughout all the components
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<JournalDashboard />} />
              <Route path="statistics" element={<StatsDashboard />} />
              <Route path="improvements" element={<ImprovementsDashboard />} />
              <Route path="settings" element={<Settings />}></Route>
            </Route>
          </Route>
          {/* <Route path="login" element={<LoginPage />}></Route> */}
          {/* <Route path="multi-step-form" element={<Questionnaire />}></Route> */}
          <Route path="sign-up" element={<SignupPage />}></Route>
          <Route path="home" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/statsPage/StatsDashboard";
import Layout from "./components/shared/Layout";
import Products from "./components/pages/statsPage/Products";
import JournalDashboard from "./components/pages/mainPage/JournalDashboard";
import StatsDashboard from "./components/pages/statsPage/StatsDashboard";
import ImprovementsDashboard from "./components/pages/improvementsPage/ImprovementsDashboard";
import HomePage from "./components/pages/homePage/HomePage";
import LoginPage from "./components/pages/homePage/LoginPage";
import { AuthProvider } from "./context/AuthContext";
// Example authentication check function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  // For example, check if a user token exists in local storage
  return Boolean(localStorage.getItem("userToken"));
};
function App() {
  return (
    //Auth Provider now allow the context to be available throughout all the components
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<JournalDashboard />} />
            <Route path="statistics" element={<StatsDashboard />} />
            <Route path="improvements" element={<ImprovementsDashboard />} />
          </Route>

          <Route path="login" element={<LoginPage />}></Route>
          <Route
            path="home"
            //this needs to be updated so that i can go on home page
            element={
              isAuthenticated() ? (
                <HomePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

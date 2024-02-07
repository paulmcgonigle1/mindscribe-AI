import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/statsPage/StatsDashboard";
import Layout from "./components/shared/Layout";
import Products from "./components/pages/statsPage/Products";
import JournalDashboard from "./components/pages/mainPage/JournalDashboard";
import StatsDashboard from "./components/pages/statsPage/StatsDashboard";
import ImprovementsDashboard from "./components/pages/improvementsPage/ImprovementsDashboard";
import HomePage from "./components/pages/homePage/HomePage";
import LoginPage from "./components/pages/homePage/LoginPage";
function App() {
  return (
    //this will have to be swapped around to have home as the default etc
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<JournalDashboard />} />
          <Route path="statistics" element={<StatsDashboard />} />
          <Route path="improvements" element={<ImprovementsDashboard />} />
        </Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="home" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

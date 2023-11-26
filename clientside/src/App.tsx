import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/statsPage/StatsDashboard";
import Layout from "./components/shared/Layout";
import Products from "./components/pages/statsPage/Products";
import JournalDashboard from "./components/pages/mainPage/JournalDashboard";
import StatsDashboard from "./components/pages/statsPage/StatsDashboard";
import ImprovementsDashboard from "./components/pages/improvementsPage/ImprovementsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<JournalDashboard />} />
          <Route path="statistics" element={<StatsDashboard />} />
          <Route path="improvements" element={<ImprovementsDashboard />} />
        </Route>
        <Route path="login" element={<div>This is login page</div>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

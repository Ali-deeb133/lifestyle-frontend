import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import DashboardPage from "./pages/DashboardPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;
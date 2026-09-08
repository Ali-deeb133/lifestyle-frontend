// src/router/index.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import  { Toaster } from "react-hot-toast";
import { Dashboard } from "./pages/Dashboard";

const Router = () => {

  
  return (
    
    <BrowserRouter>

    <Toaster
  position="top-center"
  containerStyle={{ top: 70}}
  toastOptions={{duration: 3000,}}
/>

    
      <Routes>
        
        
        
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
    </BrowserRouter>
    
  );
};

export default Router;
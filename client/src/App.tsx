import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import Layout from "./assets/Layout";
import HomePage from "./pages/Home";
import MapPage from "./pages/Map";
import { Toaster } from "sonner";
import ExampleStartupWrapperPage from "@/pages/ExampleStartupWrapperPage.tsx";


function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/example-startup" element={<ExampleStartupWrapperPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

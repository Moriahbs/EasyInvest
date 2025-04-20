import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import Layout from "./assets/Layout";
import HomePage from "./pages/Home";
import MapPage from "./pages/Map";
import { Toaster } from "sonner";
import StartupWrapperPage from "@/pages/StartupWrapperPage.tsx";
import CreateStartupPage from "@/pages/CreateStartup.tsx";
import SmartSearchPage from "@/pages/SmartSearch.tsx";
import TopicsChat from "./components/TopicsChat";

function App() {
  return (
    <>
      <Toaster richColors />
      <TopicsChat />

      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-startup" element={<CreateStartupPage />} />
            <Route path="/smart-search" element={<SmartSearchPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/startup/:id" element={<StartupWrapperPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

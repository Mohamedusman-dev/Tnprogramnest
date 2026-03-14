import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteDataProvider } from "./context/SiteDataContext";
import Admin from "./pages/Admin";

const App = () => (
  <SiteDataProvider>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </SiteDataProvider>
);

export default App;

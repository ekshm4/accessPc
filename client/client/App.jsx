import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Files from "./pages/Files";
import Folders from "./pages/Folders";
import Videos from "./pages/Videos";
import Audio from "./pages/Audio";
import Images from "./pages/Images";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Play from "./pages/playing.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1  overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<Files />} />
            <Route path="/folders" element={<Folders />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/images" element={<Images />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/playing" element={<Play />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

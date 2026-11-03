import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";

// Step 16: Lazy loading Gallery & Feedback to reduce initial bundle size
const Gallery = lazy(() => import("./pages/Gallery"));
const Feedback = lazy(() => import("./pages/Feedback"));

function App() {
    const { theme } = useTheme();

    return (
        <div className={theme}>
            <Navbar />
            <Suspense fallback={<div className="page"><p>Loading section...</p></div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;

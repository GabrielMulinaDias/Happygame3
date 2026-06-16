import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Ranking from "./pages/Ranking";
import IA from "./pages/IA";
import Sobre from "./pages/Sobre";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/quiz" element={<Quiz />} />

        <Route path="/ranking" element={<Ranking />} />

        <Route path="/ia" element={<IA />} />

        <Route path="/sobre" element={<Sobre />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
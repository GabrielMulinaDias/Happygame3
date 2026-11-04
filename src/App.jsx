import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Ranking from "./pages/Ranking";
import IA from "./pages/IA";
import Sobre from "./pages/Sobre";
import Projecao from "./pages/Projecao";
import Evolucao from "./pages/Evolucao";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="*" element={<main className="min-h-screen bg-slate-900 text-white p-10 text-center"><h1 className="text-3xl font-bold">Página não encontrada</h1><Link className="inline-block mt-6 text-cyan-400 underline" to="/">Voltar ao início</Link></main>} />
        <Route path="/" element={<Home />} />

        <Route path="/quiz" element={<Quiz />} />

        <Route path="/ranking" element={<Ranking />} />

        <Route path="/ia" element={<IA />} />

        <Route path="/sobre" element={<Sobre />} />

        <Route path="/projecao" element={<Projecao />} />
        <Route path="/evolucao" element={<Evolucao />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

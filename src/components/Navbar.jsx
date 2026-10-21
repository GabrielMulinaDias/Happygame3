import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav aria-label="Navegação principal" className="bg-slate-950/80 backdrop-blur border-b border-slate-800 text-white px-6 py-4">

      <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-cyan-400">
          Happy Game
        </Link>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base">

          <Link to="/" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Home
          </Link>

          <Link to="/quiz" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Quiz
          </Link>

          <Link to="/ranking" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Ranking
          </Link>

          <Link to="/evolucao" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Evolução
          </Link>
          <Link to="/projecao" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Projeção
          </Link>

          <Link to="/ia" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            IA
          </Link>

          <Link to="/sobre" className="hover:text-cyan-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Sobre
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;

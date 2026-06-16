import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950/80 backdrop-blur border-b border-slate-800 text-white px-6 py-4">

      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-cyan-400">
          Happy Game
        </Link>

        <div className="flex gap-6 text-sm md:text-base">

          <Link to="/" className="hover:text-cyan-400 transition">
            Home
          </Link>

          <Link to="/quiz" className="hover:text-cyan-400 transition">
            Quiz
          </Link>

          <Link to="/ranking" className="hover:text-cyan-400 transition">
            Ranking
          </Link>

          <Link to="/ia" className="hover:text-cyan-400 transition">
            IA
          </Link>

          <Link to="/sobre" className="hover:text-cyan-400 transition">
            Sobre
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
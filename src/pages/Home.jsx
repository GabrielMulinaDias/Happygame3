import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const avatares = [
  { id: 1, nome: "Mestre dos Quizzes", emoji: "🧠" },
  { id: 2, nome: "Craque do Conhecimento", emoji: "⚽" },
  { id: 3, nome: "Guardião da Lógica", emoji: "🛡️" },
  { id: 4, nome: "Explorador Matemático", emoji: "🚀" },
];

function Home() {
  const [nome, setNome] = useState("");
  const [avatarSelecionado, setAvatarSelecionado] = useState(avatares[0]);
  const [perfilSalvo, setPerfilSalvo] = useState(null);

  useEffect(() => {
    const perfil = localStorage.getItem("perfilHappyGame");

    if (perfil) {
      const perfilConvertido = JSON.parse(perfil);

      if (!perfilConvertido.id) {
        perfilConvertido.id = Date.now().toString();
        localStorage.setItem("perfilHappyGame", JSON.stringify(perfilConvertido));
      }

      setPerfilSalvo(perfilConvertido);
      setNome(perfilConvertido.nome);
      setAvatarSelecionado(perfilConvertido.avatar);
    }
  }, []);

  function salvarPerfil() {
    if (nome.trim() === "") {
      alert("Digite seu nome para continuar.");
      return;
    }

    const perfil = {
      id: Date.now().toString(),
      nome: nome,
      avatar: avatarSelecionado,
      titulo: avatarSelecionado.nome,
    };

    localStorage.setItem("perfilHappyGame", JSON.stringify(perfil));
    setPerfilSalvo(perfil);
  }

  function trocarPerfil() {
    localStorage.removeItem("perfilHappyGame");
    setPerfilSalvo(null);
    setNome("");
    setAvatarSelecionado(avatares[0]);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6">
      <div className="max-w-6xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-20 pb-20">
          <div>
            <h2 className="text-6xl font-bold leading-tight">
              Aprenda Jogando
            </h2>

            <p className="text-xl text-slate-300 mt-6">
              Crie seu perfil, escolha um avatar e participe de quizzes
              interativos com ranking e pontuação.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/quiz">
                <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl text-lg font-semibold w-full sm:w-auto">
                  Começar Quiz
                </button>
              </Link>

              <Link to="/ranking">
                <button className="bg-slate-700 hover:bg-slate-600 px-8 py-4 rounded-xl text-lg font-semibold w-full sm:w-auto">
                  Ver Ranking
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">
            {!perfilSalvo ? (
              <>
                <h3 className="text-3xl font-bold text-cyan-400 text-center">
                  Criar Perfil
                </h3>

                <p className="text-slate-300 text-center mt-3">
                  Escolha como você quer aparecer no ranking.
                </p>

                <div className="mt-6">
                  <label className="block mb-2 font-semibold">
                    Nome do jogador
                  </label>

                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
                    aria-label="Nome do jogador"
                  />
                </div>

                <div className="mt-6">
                  <label className="block mb-3 font-semibold">
                    Escolha seu avatar
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {avatares.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setAvatarSelecionado(avatar)}
                        className={`p-4 rounded-2xl border transition ${
                          avatarSelecionado.id === avatar.id
                            ? "border-cyan-400 bg-cyan-500/20"
                            : "border-slate-600 bg-slate-700 hover:bg-slate-600"
                        }`}
                        aria-label={`Selecionar avatar ${avatar.nome}`}
                      >
                        <div className="text-4xl">
                          {avatar.emoji}
                        </div>

                        <p className="mt-2 text-sm">
                          {avatar.nome}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={salvarPerfil}
                  className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold"
                >
                  Salvar Perfil
                </button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-cyan-400 text-center">
                  Perfil Criado
                </h3>

                <div className="text-center mt-8">
                  <div className="text-7xl">
                    {perfilSalvo.avatar.emoji}
                  </div>

                  <h4 className="text-2xl font-bold mt-4">
                    {perfilSalvo.nome}
                  </h4>

                  <p className="text-cyan-400 mt-2">
                    {perfilSalvo.titulo}
                  </p>
                </div>

                <Link to="/quiz">
                  <button className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold">
                    Jogar Agora
                  </button>
                </Link>

                <button
                  onClick={trocarPerfil}
                  className="w-full mt-4 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold"
                >
                  Trocar Perfil
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
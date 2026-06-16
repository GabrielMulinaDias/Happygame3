import { Link } from "react-router-dom";

function Ranking() {
  const perfilSalvo = localStorage.getItem("perfilHappyGame");

  const perfil = perfilSalvo
    ? JSON.parse(perfilSalvo)
    : {
        id: "visitante",
        nome: "Jogador",
        avatar: {
          emoji: "🎮",
          nome: "Visitante",
        },
        titulo: "Visitante",
      };

  const usuarioId = perfil.id || "visitante";

  function criarChaveStorage(nomeChave) {
    return `${nomeChave}_${usuarioId}`;
  }

  const pontuacaoTotal =
    Number(localStorage.getItem(criarChaveStorage("pontuacaoTotalHappyGame"))) || 0;

  const melhorPontuacaoQuiz =
    Number(localStorage.getItem(criarChaveStorage("melhorPontuacao"))) || 0;

  const ultimoQuizSalvo =
    localStorage.getItem(criarChaveStorage("ultimoQuizHappyGame"));

  const ultimoQuiz = ultimoQuizSalvo
    ? JSON.parse(ultimoQuizSalvo)
    : null;

  const pontosBoss = Math.max(2500, pontuacaoTotal + 500);

  const boss = {
    nome: "Chefe dos Quizzes",
    avatar: "/personagenss/boss-happy-game.png",
    titulo: "Mestre Supremo do Happy Game",
    pontos: pontosBoss,
    tipo: "boss",
  };

  const rankingBase = [
    {
      nome: "Lua",
      avatar: "🧠",
      titulo: "Mestre dos Quizzes",
      pontos: 850,
      tipo: "jogador",
    },
    {
      nome: "Rafa",
      avatar: "🚀",
      titulo: "Explorador Matemático",
      pontos: 500,
      tipo: "jogador",
    },
    {
      nome: "Bia",
      avatar: "⚽",
      titulo: "Craque do Conhecimento",
      pontos: 250,
      tipo: "jogador",
    },
  ];

  const jogadorAtual = {
    nome: perfil.nome,
    avatar: perfil.avatar?.emoji || "🎮",
    titulo: perfil.titulo || "Jogador",
    pontos: pontuacaoTotal,
    tipo: "usuario",
  };

  const rankingSemBoss = [...rankingBase, jogadorAtual].sort(
    (a, b) => b.pontos - a.pontos
  );

  const rankingFinal = [boss, ...rankingSemBoss];

  const posicaoJogador =
    rankingFinal.findIndex((jogador) => jogador.tipo === "usuario") + 1;

  function mostrarAvatar(jogador) {
    if (jogador.tipo === "boss") {
      return (
        <img
          src={jogador.avatar}
          alt="Chefe dos Quizzes"
          className="w-24 h-24 object-contain"
        />
      );
    }

    return (
      <span className="text-5xl">
        {jogador.avatar}
      </span>
    );
  }

  function formatarTema(tema) {
    const nomes = {
      programacao: "Tecnologia",
      futebol: "Futebol",
      matematica: "Matemática",
      historia: "História",
      games: "Games",
    };

    return nomes[tema] || tema;
  }

  function formatarDificuldade(dificuldade) {
    const nomes = {
      facil: "Fácil",
      medio: "Médio",
      dificil: "Difícil",
    };

    return nomes[dificuldade] || dificuldade;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-cyan-400">
            Classificação Happy Game
          </h1>

          <p className="text-slate-300 mt-4">
            Some pontos em diferentes quizzes e tente chegar à segunda colocação.
          </p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 shadow-xl mb-10 text-center">
          <div className="text-7xl">
            {perfil.avatar?.emoji || "🎮"}
          </div>

          <h2 className="text-3xl font-bold mt-4">
            {perfil.nome}
          </h2>

          <p className="text-cyan-400 mt-2">
            {perfil.titulo || "Jogador"}
          </p>

          <p className="text-slate-300 mt-4">
            Pontuação total acumulada: {pontuacaoTotal}
          </p>

          <p className="text-slate-300 mt-2">
            Melhor pontuação em um quiz: {melhorPontuacaoQuiz}
          </p>

          <p className="text-xl font-bold mt-3">
            Sua posição atual: #{posicaoJogador}
          </p>

          {ultimoQuiz && (
            <p className="text-sm text-slate-400 mt-4">
              Último quiz: {formatarTema(ultimoQuiz.tema)} | Dificuldade:{" "}
              {formatarDificuldade(ultimoQuiz.dificuldade)} | Acertos:{" "}
              {ultimoQuiz.acertos}/{ultimoQuiz.totalPerguntas}
            </p>
          )}
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">
            Classificação Geral
          </h2>

          <div className="space-y-4">
            {rankingFinal.map((jogador, index) => (
              <div
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
                  jogador.tipo === "boss"
                    ? "bg-purple-900/40 border-yellow-400 shadow-lg shadow-yellow-500/20"
                    : jogador.tipo === "usuario"
                    ? "bg-cyan-500/20 border-cyan-400"
                    : "bg-slate-700 border-slate-600"
                }`}
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`text-2xl font-bold ${
                      jogador.tipo === "boss"
                        ? "text-yellow-400"
                        : "text-white"
                    }`}
                  >
                    #{index + 1}
                  </span>

                  <div className="w-24 h-24 flex items-center justify-center">
                    {mostrarAvatar(jogador)}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-xl ${
                        jogador.tipo === "boss"
                          ? "text-yellow-400"
                          : "text-white"
                      }`}
                    >
                      {jogador.nome}
                    </h3>

                    <p className="text-sm text-slate-300">
                      {jogador.titulo}
                    </p>

                    {jogador.tipo === "boss" && (
                      <p className="text-xs text-yellow-300 mt-1">
                        Boss exclusivo do sistema
                      </p>
                    )}

                    {jogador.tipo === "usuario" && (
                      <p className="text-xs text-cyan-300 mt-1">
                        Seu perfil
                      </p>
                    )}
                  </div>
                </div>

                <p
                  className={`text-xl font-bold ${
                    jogador.tipo === "boss"
                      ? "text-yellow-400"
                      : "text-cyan-400"
                  }`}
                >
                  {jogador.pontos} pontos
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/quiz">
            <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-bold">
              Jogar Quiz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
import { useEffect, useState, useCallback } from "react";

const dificuldades = {
  facil: {
    nome: "Fácil",
    pontos: 10,
  },
  medio: {
    nome: "Médio",
    pontos: 20,
  },
  dificil: {
    nome: "Difícil",
    pontos: 35,
  },
};

const quantidadePerguntasPorRodada = 3;

function Quiz() {
  const [tema, setTema] = useState("programacao");
  const [dificuldade, setDificuldade] = useState("facil");
  const [perguntas, setPerguntas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [quizJaConcluido, setQuizJaConcluido] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const perfilSalvo = localStorage.getItem("perfilHappyGame");

  const perfil = perfilSalvo
    ? JSON.parse(perfilSalvo)
    : {
        id: "visitante",
        nome: "Jogador",
      };

  const usuarioId = perfil.id || "visitante";

  function criarChaveStorage(nomeChave) {
    return `${nomeChave}_${usuarioId}`;
  }

  function chaveQuizAtual() {
    return `${tema}-${dificuldade}`;
  }

  function obterQuizzesConcluidos() {
    const dadosSalvos = localStorage.getItem(
      criarChaveStorage("quizzesConcluidosHappyGame")
    );

    if (!dadosSalvos) {
      return [];
    }

    return JSON.parse(dadosSalvos);
  }

  function marcarQuizComoConcluido() {
    const concluidos = obterQuizzesConcluidos();
    const chaveAtual = chaveQuizAtual();

    if (!concluidos.includes(chaveAtual)) {
      const novaLista = [...concluidos, chaveAtual];

      localStorage.setItem(
        criarChaveStorage("quizzesConcluidosHappyGame"),
        JSON.stringify(novaLista)
      );
    }

    setQuizJaConcluido(true);
  }

  function embaralharPerguntas(lista) {
    return [...lista].sort(() => Math.random() - 0.5);
  }

  const carregarPerguntas = useCallback(async () => {
    setCarregando(true);

    try {
      const resposta = await fetch(`/data/${tema}.json`);
      const dados = await resposta.json();

      const perguntasFiltradas = dados.filter(
        (pergunta) => pergunta.dificuldade === dificuldade
      );

      const perguntasAleatorias = embaralharPerguntas(perguntasFiltradas).slice(
        0,
        quantidadePerguntasPorRodada
      );

      // inline checks to avoid external function dependencies in useCallback
      const dadosSalvos = localStorage.getItem(`quizzesConcluidosHappyGame_${usuarioId}`);
      const concluidos = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      const jaFoiConcluido = concluidos.includes(`${tema}-${dificuldade}`);

      setPerguntas(perguntasAleatorias);
      setPerguntaAtual(0);
      setPontuacao(0);
      setAcertos(0);
      setQuizIniciado(false);
      setFinalizado(false);
      setRespostaSelecionada(null);
      setQuizJaConcluido(jaFoiConcluido);
    } catch (erro) {
      console.error("Erro ao carregar perguntas:", erro);
    } finally {
      setCarregando(false);
    }
  }, [tema, dificuldade, usuarioId]);
  useEffect(() => {
    // avoid synchronous setState inside effect by deferring the call
    const id = setTimeout(() => {
      carregarPerguntas();
    }, 0);

    return () => clearTimeout(id);
  }, [carregarPerguntas]);

  function iniciarQuiz() {
    if (quizJaConcluido) {
      alert("Você já concluiu esse tema nessa dificuldade.");
      return;
    }

    setPerguntaAtual(0);
    setPontuacao(0);
    setAcertos(0);
    setQuizIniciado(true);
    setFinalizado(false);
    setRespostaSelecionada(null);
  }

  function verificarResposta(indice) {
    if (respostaSelecionada !== null) {
      return;
    }

    setRespostaSelecionada(indice);

    const pergunta = perguntas[perguntaAtual];
    const acertou = indice === pergunta.correta;
    const pontosDaQuestao = dificuldades[dificuldade].pontos;

    const novaPontuacao = pontuacao + (acertou ? pontosDaQuestao : 0);
    const novosAcertos = acertos + (acertou ? 1 : 0);

    if (acertou) {
      setPontuacao(novaPontuacao);
      setAcertos(novosAcertos);
    }

    // announce result politely
    if (acertou) {
      setLiveMessage(`✓ Resposta correta. Pontuação: ${novaPontuacao} pontos.`);
    } else {
      setLiveMessage(`✕ Resposta incorreta. Pontuação: ${novaPontuacao} pontos.`);
    }

    setTimeout(() => {
      if (perguntaAtual + 1 < perguntas.length) {
        setPerguntaAtual(perguntaAtual + 1);
        setRespostaSelecionada(null);
        // clear live message for next question
        setLiveMessage("");
      } else {
        finalizarQuiz(novaPontuacao, novosAcertos);
      }
    }, 1000);
  }

  function finalizarQuiz(pontosFinais, acertosFinais) {
    const concluidos = obterQuizzesConcluidos();
    const chaveAtual = chaveQuizAtual();

    if (!concluidos.includes(chaveAtual)) {
      const pontuacaoTotalAtual =
        Number(
          localStorage.getItem(
            criarChaveStorage("pontuacaoTotalHappyGame")
          )
        ) || 0;

      const novaPontuacaoTotal = pontuacaoTotalAtual + pontosFinais;

      localStorage.setItem(
        criarChaveStorage("pontuacaoTotalHappyGame"),
        novaPontuacaoTotal
      );

      const melhorPontuacaoQuiz =
        Number(
          localStorage.getItem(
            criarChaveStorage("melhorPontuacao")
          )
        ) || 0;

      if (pontosFinais > melhorPontuacaoQuiz) {
        localStorage.setItem(
          criarChaveStorage("melhorPontuacao"),
          pontosFinais
        );
      }

      marcarQuizComoConcluido();
    }

    const resumo = {
      tema,
      dificuldade,
      pontos: pontosFinais,
      acertos: acertosFinais,
      totalPerguntas: perguntas.length,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    localStorage.setItem(
      criarChaveStorage("ultimoQuizHappyGame"),
      JSON.stringify(resumo)
    );

    setPontuacao(pontosFinais);
    setAcertos(acertosFinais);
    setFinalizado(true);

    setLiveMessage(`Quiz finalizado. Pontuação final: ${pontosFinais} pontos.`);
  }

  function mensagemFinal() {
    const percentual = (acertos / perguntas.length) * 100;

    if (percentual >= 80) {
      return "Excelente desempenho! Você dominou esse desafio.";
    }

    if (percentual >= 50) {
      return "Bom resultado! Continue praticando para subir no ranking.";
    }

    return "Continue tentando. Cada quiz ajuda na sua evolução.";
  }

  function nomeTemaAtual() {
    const nomes = {
      programacao: "Tecnologia",
      futebol: "Futebol",
      matematica: "Matemática",
      historia: "História",
      games: "Games",
    };

    return nomes[tema];
  }

  const progresso =
    quizIniciado && !finalizado && perguntas.length > 0
      ? ((perguntaAtual + 1) / perguntas.length) * 100
      : 0;

  const pergunta = perguntas[perguntaAtual];

  const pontuacaoTotal =
    Number(
      localStorage.getItem(
        criarChaveStorage("pontuacaoTotalHappyGame")
      )
    ) || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-cyan-400 text-center">
          Quiz Happy Game
        </h1>

        <p className="text-center text-slate-300 mt-4">
          Escolha um tema, selecione a dificuldade e acumule pontos no ranking.
        </p>

        {!quizIniciado && (
          <div className="bg-slate-800 rounded-2xl p-8 mt-10 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 font-semibold">
                  Escolha o tipo de quiz:
                </label>

                <select
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Escolha o tema do quiz"
                >
                  <option value="programacao">Tecnologia</option>
                  <option value="futebol">Futebol</option>
                  <option value="matematica">Matemática</option>
                  <option value="historia">História</option>
                  <option value="games">Games</option>
                </select>
              </div>

              <div>
                <label className="block mb-3 font-semibold">
                  Escolha a dificuldade:
                </label>

                <select
                  value={dificuldade}
                  onChange={(e) => setDificuldade(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Escolha a dificuldade do quiz"
                >
                  <option value="facil">Fácil - 10 pontos por acerto</option>
                  <option value="medio">Médio - 20 pontos por acerto</option>
                  <option value="dificil">Difícil - 35 pontos por acerto</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-700 rounded-xl p-4 mt-6 text-center">
              <p className="text-slate-300">
                Pontuação total acumulada de {perfil.nome}:
              </p>

              <p className="text-3xl font-bold text-cyan-400 mt-2">
                {pontuacaoTotal} pts
              </p>
            </div>

            <div
              className={`rounded-xl p-4 mt-6 text-center border ${
                quizJaConcluido
                  ? "bg-yellow-500/10 border-yellow-400 text-yellow-300"
                  : "bg-cyan-500/10 border-cyan-400 text-cyan-300"
              }`}
            >
              {quizJaConcluido ? (
                <p>
                  {perfil.nome}, você já concluiu {nomeTemaAtual()} no nível{" "}
                  {dificuldades[dificuldade].nome}. Escolha outro tema ou outra
                  dificuldade.
                </p>
              ) : (
                <p>
                  Este desafio ainda está disponível para {perfil.nome}.
                </p>
              )}
            </div>

            {carregando ? (
              <p className="text-center mt-6 text-slate-300">
                Carregando perguntas...
              </p>
            ) : (
              <button
                onClick={iniciarQuiz}
                disabled={perguntas.length === 0 || quizJaConcluido}
                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed py-3 rounded-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {quizJaConcluido ? "Quiz já concluído" : "Começar Quiz"}
              </button>
            )}
          </div>
        )}

        {/* aria-live region for polite announcements (visually hidden) */}
        <div aria-live="polite" className="sr-only" id="quiz-live">
          {liveMessage}
        </div>

        {quizIniciado && !finalizado && pergunta && (
          <div className="bg-slate-800 rounded-2xl p-8 mt-10 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400">
                <p>
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </p>

                <p>
                  Dificuldade: {dificuldades[dificuldade].nome}
                </p>
              </div>

              <div className="w-full bg-slate-700 h-4 rounded-full mt-3">
                <div
                  className="bg-cyan-400 h-4 rounded-full transition-all"
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {pergunta.pergunta}
            </h2>

            <div className="space-y-4">
              {pergunta.respostas.map((resposta, indice) => {
                let estilo;

                if (respostaSelecionada !== null) {
                  if (indice === pergunta.correta) {
                    estilo = "w-full text-left p-4 rounded-xl bg-green-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
                  } else if (indice === respostaSelecionada) {
                    estilo = "w-full text-left p-4 rounded-xl bg-red-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
                  } else {
                    estilo = "w-full text-left p-4 rounded-xl bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
                  }
                } else {
                  estilo = "w-full text-left p-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
                }

                return (
                  <button
                    key={indice}
                    onClick={() => verificarResposta(indice)}
                    className={estilo}
                    aria-label={`Resposta: ${resposta}`}
                  >
                    <span>{resposta}</span>
                    {respostaSelecionada !== null && indice === pergunta.correta && (
                      <span className="ml-3 font-semibold">✓ Resposta correta</span>
                    )}
                    {respostaSelecionada !== null && indice === respostaSelecionada && indice !== pergunta.correta && (
                      <span className="ml-3 font-semibold">✕ Resposta incorreta</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-6 text-lg font-semibold">
              <p>
                Pontuação do quiz: {pontuacao}
              </p>

              <p>
                Acertos: {acertos}
              </p>
            </div>
          </div>
        )}

        {finalizado && (
          <div className="bg-slate-800 rounded-2xl p-8 mt-10 text-center shadow-lg">
            <h2 className="text-4xl font-bold text-cyan-400">
              Quiz Finalizado!
            </h2>

            <p className="text-2xl mt-4">
              Pontuação conquistada: {pontuacao}
            </p>

            <p className="text-slate-300 mt-4">
              {mensagemFinal()}
            </p>

            <p className="text-cyan-400 font-bold mt-4">
              Os pontos foram somados somente para o perfil de {perfil.nome}.
            </p>

            <button
              onClick={() => {
                setQuizIniciado(false);
                setFinalizado(false);
                setRespostaSelecionada(null);
              }}
              className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-bold"
            >
              Escolher outro quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
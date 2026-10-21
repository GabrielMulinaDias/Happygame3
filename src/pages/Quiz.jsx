import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { selecionarDesafio } from "../lib/recomendacao";
import { TEMAS, NIVEIS, dificuldades, nomeTema } from "../lib/catalogo";
import { lerPerfil, lerProgresso, registrarResultado, VISITANTE } from "../lib/progresso";

const quantidadePerguntasPorRodada = 3;

function Quiz() {
  const [searchParams] = useSearchParams();
  const perfil = lerPerfil() || VISITANTE;
  if ((searchParams.has("tema") || searchParams.has("dificuldade")) &&
      lerProgresso(perfil.id).concluidos.length === TEMAS.length * NIVEIS.length) {
    return <main className="min-h-screen bg-slate-900 text-white px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-cyan-400">Todos os desafios concluídos</h1>
      <p className="mt-4">Você concluiu todos os desafios disponíveis. Parabéns!</p>
      <Link className="inline-block mt-6 text-cyan-400 underline rounded focus-visible:ring-2 focus-visible:ring-cyan-400" to="/evolucao">Ver evolução</Link>
    </main>;
  }
  return <RodadaQuiz key={`${perfil.id}:${searchParams.toString()}`} perfil={perfil} searchParams={searchParams} />;
}

function RodadaQuiz({ perfil, searchParams }) {
  const usuarioId = perfil.id;
  const [selecaoInicial] = useState(() => {
    const { concluidos, ultimoQuiz } = lerProgresso(usuarioId);
    if (!searchParams.has("tema") && !searchParams.has("dificuldade")) {
      return { tema: "programacao", dificuldade: "facil" };
    }
    return selecionarDesafio(searchParams.get("tema"), searchParams.get("dificuldade"), concluidos, ultimoQuiz)
      || { tema: "programacao", dificuldade: "facil" };
  });
  const [tema, setTema] = useState(selecaoInicial.tema);
  const [dificuldade, setDificuldade] = useState(selecaoInicial.dificuldade);
  const [perguntas, setPerguntas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const temporizador = useRef(null);
  const respostaEmCurso = useRef(false);
  const progressoSalvo = lerProgresso(usuarioId);
  const quizJaConcluido = progressoSalvo.concluidos.includes(`${tema}-${dificuldade}`);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function carregar() {
      try {
        const resposta = await fetch(`/data/${tema}.json`, { signal: controller.signal });
        if (!resposta.ok) throw new Error("Falha ao buscar perguntas");
        const dados = await resposta.json();
        const filtradas = dados.filter((item) => item.dificuldade === dificuldade);
        if (filtradas.length < quantidadePerguntasPorRodada) throw new Error("Perguntas insuficientes");
        if (controller.signal.aborted) return;
        setPerguntas([...filtradas].sort(() => Math.random() - 0.5).slice(0, quantidadePerguntasPorRodada));
      } catch {
        if (controller.signal.aborted) return;
        setPerguntas([]);
        setErroCarga("Não foi possível carregar as perguntas. Selecione outro desafio ou atualize a página.");
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controller.abort();
  }, [tema, dificuldade]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function mudarSelecao(valor, definir) {
    setPerguntas([]);
    setCarregando(true);
    setErroCarga("");
    definir(valor);
  }

  function iniciarQuiz() {
    if (lerProgresso(usuarioId).concluidos.includes(`${tema}-${dificuldade}`)) {
      alert("Você já concluiu esse tema nessa dificuldade.");
      return;
    }

    if (carregando || perguntas.length === 0) return;
    respostaEmCurso.current = false;
    setErroSalvar("");
    setPerguntaAtual(0);
    setPontuacao(0);
    setAcertos(0);
    setQuizIniciado(true);
    setFinalizado(false);
    setRespostaSelecionada(null);
  }

  function verificarResposta(indice) {
    if (respostaEmCurso.current || respostaSelecionada !== null) {
      return;
    }

    respostaEmCurso.current = true;
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

    temporizador.current = setTimeout(() => {
      if (perguntaAtual + 1 < perguntas.length) {
        respostaEmCurso.current = false;
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
    try {
      registrarResultado(usuarioId, {
        tema, dificuldade, acertos: acertosFinais, totalPerguntas: perguntas.length,
      });
      setErroSalvar("");
    } catch {
      setErroSalvar("Não foi possível salvar o resultado. Libere espaço ou permita o armazenamento e tente novamente.");
    }

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

  const progresso =
    quizIniciado && !finalizado && perguntas.length > 0
      ? ((perguntaAtual + 1) / perguntas.length) * 100
      : 0;

  const pergunta = perguntas[perguntaAtual];

  const pontuacaoTotal = progressoSalvo.pontuacao;

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
                  onChange={(e) => mudarSelecao(e.target.value, setTema)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Escolha o tema do quiz"
                >
                  {TEMAS.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-3 font-semibold">
                  Escolha a dificuldade:
                </label>

                <select
                  value={dificuldade}
                  onChange={(e) => mudarSelecao(e.target.value, setDificuldade)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Escolha a dificuldade do quiz"
                >
                  {NIVEIS.map((item) => <option key={item.id} value={item.id}>{item.nome} - {item.pontos} pontos por acerto</option>)}
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
                  {perfil.nome}, você já concluiu {nomeTema(tema)} no nível{" "}
                  {dificuldades[dificuldade].nome}. Escolha outro tema ou outra
                  dificuldade.
                </p>
              ) : (
                <p>
                  Este desafio ainda está disponível para {perfil.nome}.
                </p>
              )}
            </div>

            {erroCarga && <p role="alert" className="text-yellow-300 mt-4">{erroCarga}</p>}
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

            {erroSalvar ? (
              <div role="alert" className="text-yellow-300 mt-4">
                <p>{erroSalvar}</p>
                <button className="underline mt-3 rounded focus-visible:ring-2 focus-visible:ring-cyan-400" onClick={() => finalizarQuiz(pontuacao, acertos)}>
                  Tentar salvar novamente
                </button>
              </div>
            ) : (
              <p className="text-cyan-400 font-bold mt-4">
                Os pontos foram somados somente para o perfil de {perfil.nome}.
              </p>
            )}

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
            <Link
              to="/evolucao"
              className="block mt-6 text-cyan-400 underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Ver evolução e próximo desafio recomendado
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;

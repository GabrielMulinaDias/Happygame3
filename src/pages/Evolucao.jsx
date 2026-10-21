import { Link } from "react-router-dom";
import {
  analisarProgresso,
  apresentarRecomendacao,
  NIVEIS,
  TEMAS,
  TOTAL_DESAFIOS,
} from "../lib/recomendacao";

import { lerPerfil, lerProgresso } from "../lib/progresso";

export function DesafioRecomendado({ recomendacao, concluidos, concluidosCount }) {
  const desafio = apresentarRecomendacao(recomendacao, concluidos);
  return (
        <section className="bg-slate-800 rounded-2xl p-7 mt-7 border border-cyan-500/50">
          <h2 className="text-2xl font-bold text-cyan-400">Próximo desafio recomendado</h2>
          {desafio ? (
            <>
              <p className="text-xl font-semibold mt-5">
                {desafio.titulo}
              </p>
              <p className="text-slate-300 mt-3">{desafio.motivo}</p>
              <Link
                to={desafio.destino}
                className="inline-block mt-6 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-6 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Abrir desafio recomendado
              </Link>
            </>
          ) : concluidosCount === TOTAL_DESAFIOS ? (
            <p className="text-green-300 mt-5 font-semibold">
              Você concluiu todos os desafios disponíveis. Parabéns!
            </p>
          ) : (
            <p className="text-slate-300 mt-5" role="status">
              Não foi possível obter um desafio recomendado válido. Escolha um
              desafio disponível na página Quiz.
            </p>
          )}
        </section>
  );
}

function Evolucao() {
  const perfil = lerPerfil();
  const { concluidos, ultimoQuiz, pontuacao } = lerProgresso(perfil?.id || "visitante");

  const { concluidosCount, percentual, recomendacao } = analisarProgresso(
    concluidos,
    ultimoQuiz
  );
  const chavesConcluidas = new Set(Array.isArray(concluidos) ? concluidos : []);

  if (!perfil) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-12">
        <section className="max-w-3xl mx-auto bg-slate-800 rounded-3xl p-8 text-center">
          <h1 className="text-4xl font-bold text-cyan-400">Sua evolução</h1>
          <p className="mt-4 text-slate-300">
            Crie seu perfil na página inicial para acompanhar o progresso e
            receber sugestões de desafios.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Criar perfil
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center">
          <p className="text-cyan-400 font-semibold">Happy Game • Fase 6</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">Sua evolução</h1>
          <p className="text-slate-300 mt-4 max-w-3xl mx-auto">
            Acompanhe os desafios concluídos e descubra qual quiz combina com
            seu progresso. A recomendação é feita automaticamente a partir dos
            resultados salvos no navegador.
          </p>
        </header>

        <section aria-label="Resumo do jogador" className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <article className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400">Jogador</p>
            <p className="text-2xl font-bold mt-2 break-words">{perfil.nome || "Jogador"}</p>
            <p className="text-cyan-400 mt-2">{perfil.titulo || ""}</p>
          </article>
          <article className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400">Pontos acumulados</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {pontuacao.toLocaleString("pt-BR")}
            </p>
          </article>
          <article className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400">Desafios concluídos</p>
            <p className="text-3xl font-bold mt-2">
              {concluidosCount} de {TOTAL_DESAFIOS}
            </p>
          </article>
        </section>

        <section className="bg-slate-800 rounded-2xl p-7 mt-7">
          <div className="flex justify-between gap-4 items-center">
            <h2 className="text-xl font-bold">Progresso geral</h2>
            <span className="font-bold text-cyan-400">{percentual}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso dos desafios concluídos"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentual}
            className="bg-slate-700 rounded-full h-4 mt-4 overflow-hidden"
          >
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${percentual}%` }} />
          </div>
        </section>

        <DesafioRecomendado
          recomendacao={recomendacao}
          concluidos={concluidos}
          concluidosCount={concluidosCount}
        />

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Mapa de desafios</h2>
          <p className="text-slate-400 mt-2">Veja o que já foi concluído em cada tema e dificuldade.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {TEMAS.flatMap((tema) =>
              NIVEIS.map((nivel) => {
                const concluido = chavesConcluidas.has(`${tema.id}-${nivel.id}`);
                return (
                  <article
                    key={`${tema.id}-${nivel.id}`}
                    className={`rounded-xl border p-5 ${
                      concluido
                        ? "bg-green-500/10 border-green-500/50"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    <h3 className="font-bold">{tema.nome}</h3>
                    <p className="text-slate-300 mt-1">{nivel.nome}</p>
                    <p className={concluido ? "text-green-300 mt-3" : "text-slate-400 mt-3"}>
                      {concluido ? "✓ Concluído" : "Disponível"}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <p className="text-sm text-slate-400 mt-10">
          As recomendações usam regras de desempenho e dados locais. Não há uso
          de inteligência artificial generativa nem envio do histórico a servidores.
        </p>
      </div>
    </main>
  );
}

export default Evolucao;

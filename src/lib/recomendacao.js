import { TEMAS, NIVEIS, TOTAL_DESAFIOS, normalizarResumo } from "./catalogo.js";
export { TEMAS, NIVEIS, TOTAL_DESAFIOS } from "./catalogo.js";

// O texto e o link devem sempre representar a mesma combinação válida.
export function apresentarRecomendacao(recomendacao, concluidos = []) {
  const tema = TEMAS.find((item) => item.id === recomendacao?.tema);
  const nivel = NIVEIS.find((item) => item.id === recomendacao?.dificuldade);
  if (
    !tema || !nivel ||
    (Array.isArray(concluidos) && concluidos.includes(`${tema.id}-${nivel.id}`))
  ) {
    return null;
  }

  return {
    titulo: `${tema.nome} • ${nivel.nome}`,
    destino: `/quiz?tema=${encodeURIComponent(tema.id)}&dificuldade=${encodeURIComponent(nivel.id)}`,
    motivo: typeof recomendacao.motivo === "string" ? recomendacao.motivo : "",
  };
}

export function analisarProgresso(concluidos = [], ultimoQuiz = null) {
  ultimoQuiz = normalizarResumo(ultimoQuiz);
  const chavesValidas = new Set(
    TEMAS.flatMap((tema) =>
      NIVEIS.map((nivel) => `${tema.id}-${nivel.id}`)
    )
  );
  const chavesConcluidas = new Set(
    (Array.isArray(concluidos) ? concluidos : []).filter((chave) =>
      chavesValidas.has(chave)
    )
  );

  const concluidosCount = chavesConcluidas.size;
  const percentual = Math.round((concluidosCount / TOTAL_DESAFIOS) * 100);
  const disponivel = (tema, dificuldade) =>
    !chavesConcluidas.has(`${tema}-${dificuldade}`);

  const recomendar = (tema, dificuldade, motivo) => ({
    tema,
    dificuldade,
    motivo,
  });

  if (concluidosCount === TOTAL_DESAFIOS) {
    return { concluidosCount, percentual, recomendacao: null };
  }

  if (
    ultimoQuiz &&
    TEMAS.some((tema) => tema.id === ultimoQuiz.tema) &&
    NIVEIS.some((nivel) => nivel.id === ultimoQuiz.dificuldade) &&
    Number(ultimoQuiz.totalPerguntas) > 0
  ) {
    const taxaAcerto = Number(ultimoQuiz.acertos) / Number(ultimoQuiz.totalPerguntas);
    const indiceNivel = NIVEIS.findIndex(
      (nivel) => nivel.id === ultimoQuiz.dificuldade
    );

    if (taxaAcerto >= 2 / 3 && indiceNivel < NIVEIS.length - 1) {
      const proximoNivel = NIVEIS[indiceNivel + 1].id;
      if (disponivel(ultimoQuiz.tema, proximoNivel)) {
        return {
          concluidosCount,
          percentual,
          recomendacao: recomendar(
            ultimoQuiz.tema,
            proximoNivel,
            "Você acertou pelo menos dois terços das perguntas. Que tal avançar um nível no mesmo tema?"
          ),
        };
      }
    }

    const proximoTema = TEMAS.find((tema) =>
      disponivel(tema.id, ultimoQuiz.dificuldade)
    );
    if (proximoTema) {
      return {
        concluidosCount,
        percentual,
        recomendacao: recomendar(
          proximoTema.id,
          ultimoQuiz.dificuldade,
          "Há um desafio disponível nesta dificuldade para você continuar praticando."
        ),
      };
    }
  }

  for (const nivel of NIVEIS) {
    for (const tema of TEMAS) {
      if (disponivel(tema.id, nivel.id)) {
        return {
          concluidosCount,
          percentual,
          recomendacao: recomendar(
            tema.id,
            nivel.id,
            ultimoQuiz
              ? "Este é o próximo desafio disponível no seu progresso."
              : "Comece com um desafio fácil para registrar seu primeiro resultado."
          ),
        };
      }
    }
  }

  return { concluidosCount, percentual, recomendacao: null };
}

// Links antigos ou já concluídos abrem uma alternativa disponível, nunca IDs arbitrários.
export function selecionarDesafio(tema, dificuldade, concluidos = [], ultimoQuiz = null) {
  const solicitado = apresentarRecomendacao({ tema, dificuldade }, concluidos);
  if (solicitado) return { tema, dificuldade };
  return analisarProgresso(concluidos, ultimoQuiz).recomendacao;
}

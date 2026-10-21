import { dificuldades, normalizarConcluidos, normalizarResumo } from "./catalogo.js";

export const VISITANTE = Object.freeze({
  id: "visitante", nome: "Jogador", titulo: "Visitante",
  avatar: { id: 0, nome: "Visitante", emoji: "🎮" },
});

function armazenamento() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

export function lerJSON(chave, padrao, storage = armazenamento()) {
  try {
    const texto = storage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch {
    return padrao;
  }
}

export function lerPerfil(storage = armazenamento()) {
  const perfil = lerJSON("perfilHappyGame", null, storage);
  if (!perfil || typeof perfil.nome !== "string" || !perfil.nome.trim()) return null;
  // Perfis antigos sem ID já usavam o namespace visitante; não troque sua identidade na leitura.
  const id = (typeof perfil.id === "string" && perfil.id.trim()) ||
    (Number.isSafeInteger(perfil.id) ? String(perfil.id) : "visitante");
  return {
    id, nome: perfil.nome,
    titulo: typeof perfil.titulo === "string" ? perfil.titulo : "Jogador",
    avatar: perfil.avatar && typeof perfil.avatar.emoji === "string" && typeof perfil.avatar.nome === "string"
      ? perfil.avatar : VISITANTE.avatar,
  };
}

export function lerProgresso(usuarioId, storage = armazenamento()) {
  const chave = (nome) => `${nome}_${usuarioId}`;
  const pontos = (nome) => {
    try {
      const valor = Number(storage.getItem(chave(nome)));
      return Number.isSafeInteger(valor) && valor >= 0 ? valor : 0;
    } catch { return 0; }
  };
  const concluidos = normalizarConcluidos(lerJSON(chave("quizzesConcluidosHappyGame"), [], storage));
  const ultimoQuiz = normalizarResumo(lerJSON(chave("ultimoQuizHappyGame"), null, storage));
  // Um resumo válido também comprova uma conclusão quando a lista antiga está incompleta.
  if (ultimoQuiz && !concluidos.includes(`${ultimoQuiz.tema}-${ultimoQuiz.dificuldade}`)) {
    concluidos.push(`${ultimoQuiz.tema}-${ultimoQuiz.dificuldade}`);
  }
  return { concluidos, ultimoQuiz, pontuacao: pontos("pontuacaoTotalHappyGame"), melhorPontuacao: pontos("melhorPontuacao") };
}

export function registrarResultado(usuarioId, resultado, storage = armazenamento()) {
  const resumo = normalizarResumo(resultado);
  if (!resumo) throw new Error("Resultado do quiz inválido.");
  const atual = lerProgresso(usuarioId, storage);
  const desafio = `${resumo.tema}-${resumo.dificuldade}`;
  if (atual.concluidos.includes(desafio)) return atual;
  const pontos = resumo.acertos * dificuldades[resumo.dificuldade].pontos;
  const pontuacao = atual.pontuacao + pontos;
  if (!Number.isSafeInteger(pontuacao)) throw new Error("Pontuação inválida.");
  const registros = {
    pontuacaoTotalHappyGame: String(pontuacao),
    melhorPontuacao: String(Math.max(atual.melhorPontuacao, pontos)),
    quizzesConcluidosHappyGame: JSON.stringify([...atual.concluidos, desafio]),
    ultimoQuizHappyGame: JSON.stringify({ ...resumo, pontos, data: new Date().toLocaleDateString("pt-BR") }),
  };
  const anteriores = Object.keys(registros).map((nome) => [`${nome}_${usuarioId}`, storage.getItem(`${nome}_${usuarioId}`)]);
  try {
    for (const [nome, valor] of Object.entries(registros)) storage.setItem(`${nome}_${usuarioId}`, valor);
  } catch (erro) {
    // Evita pontuação parcial se, por exemplo, a cota do navegador for excedida.
    for (const [chave, valor] of anteriores) {
      try {
        if (valor === null) storage.removeItem(chave);
        else storage.setItem(chave, valor);
      } catch { /* O aviso na interface informa a impossibilidade de salvar. */ }
    }
    throw erro;
  }
  return lerProgresso(usuarioId, storage);
}

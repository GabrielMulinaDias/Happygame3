export const TEMAS = Object.freeze([
  { id: "programacao", nome: "Tecnologia" },
  { id: "futebol", nome: "Futebol" },
  { id: "matematica", nome: "Matemática" },
  { id: "historia", nome: "História" },
  { id: "games", nome: "Games" },
].map(Object.freeze));

export const NIVEIS = Object.freeze([
  { id: "facil", nome: "Fácil", pontos: 10 },
  { id: "medio", nome: "Médio", pontos: 20 },
  { id: "dificil", nome: "Difícil", pontos: 35 },
].map(Object.freeze));

export const TOTAL_DESAFIOS = TEMAS.length * NIVEIS.length;
export const dificuldades = Object.fromEntries(NIVEIS.map((nivel) => [nivel.id, nivel]));
export const nomeTema = (id) => TEMAS.find((tema) => tema.id === id)?.nome || "Tema indisponível";
export const nomeNivel = (id) => NIVEIS.find((nivel) => nivel.id === id)?.nome || "Dificuldade indisponível";
export const desafioValido = (tema, dificuldade) =>
  TEMAS.some((item) => item.id === tema) && NIVEIS.some((item) => item.id === dificuldade);

export function normalizarConcluidos(valor) {
  if (!Array.isArray(valor)) return [];
  const validos = TEMAS.flatMap((tema) => NIVEIS.map((nivel) => `${tema.id}-${nivel.id}`));
  return [...new Set(valor.filter((chave) => validos.includes(chave)))];
}

export function normalizarResumo(valor) {
  if (!valor || !desafioValido(valor.tema, valor.dificuldade)) return null;
  const numero = (v) => typeof v === "number" || (typeof v === "string" && v.trim() !== "");
  if (!numero(valor.acertos) || !numero(valor.totalPerguntas)) return null;
  const acertos = Number(valor.acertos);
  const totalPerguntas = Number(valor.totalPerguntas);
  if (!Number.isSafeInteger(acertos) || !Number.isSafeInteger(totalPerguntas) ||
      totalPerguntas <= 0 || acertos < 0 || acertos > totalPerguntas) return null;
  return { tema: valor.tema, dificuldade: valor.dificuldade, acertos, totalPerguntas };
}

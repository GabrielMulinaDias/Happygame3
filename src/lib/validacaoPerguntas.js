// Valida o catálogo recebido antes de apresentar perguntas ao jogador.
// Não substitui validação em servidor para competições reais.
const NIVEIS = new Set(["facil", "medio", "dificil"]);

export function validarPerguntas(dados, dificuldade) {
  if (!Array.isArray(dados) || !NIVEIS.has(dificuldade) || dados.length > 1000) {
    throw new Error("Catálogo de perguntas inválido.");
  }
  const vistas = new Set();
  const validas = [];
  for (const item of dados) {
    if (!item || typeof item !== "object" || !NIVEIS.has(item.dificuldade) ||
        typeof item.pergunta !== "string" || !item.pergunta.trim() || item.pergunta.length > 500 ||
        !Array.isArray(item.respostas) || item.respostas.length !== 4 ||
        !item.respostas.every((r) => typeof r === "string" && r.trim().length > 0 && r.length <= 300) ||
        !Number.isInteger(item.correta) || item.correta < 0 || item.correta >= item.respostas.length) {
      throw new Error("Catálogo contém uma questão malformada.");
    }
    const chave = `${item.dificuldade}:${item.pergunta.trim().toLocaleLowerCase("pt-BR")}`;
    if (vistas.has(chave)) throw new Error("Catálogo contém questões duplicadas.");
    vistas.add(chave);
    if (item.dificuldade === dificuldade) validas.push(item);
  }
  if (validas.length < 3) throw new Error("Perguntas insuficientes para a dificuldade.");
  return validas;
}

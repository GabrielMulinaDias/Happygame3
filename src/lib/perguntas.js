import { validarPerguntas } from './validacaoPerguntas.js';

export function selecionarPerguntas(dados, dificuldade, quantidade = 3) {
  if (!Number.isSafeInteger(quantidade) || quantidade < 1) throw new Error('Quantidade invalida');
  const perguntas = validarPerguntas(dados, dificuldade);
  if (perguntas.length < quantidade) throw new Error('Perguntas insuficientes');
  // Fisher–Yates evita o viés de ordenar com um comparador aleatório.
  for (let i = perguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
  }
  return perguntas.slice(0, quantidade);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TEMAS, NIVEIS, nomeTema, nomeNivel, normalizarResumo } from '../src/lib/catalogo.js';
import { lerPerfil, lerProgresso, registrarResultado } from '../src/lib/progresso.js';
import { analisarProgresso, selecionarDesafio } from '../src/lib/recomendacao.js';

function memoria(entradas = []) {
  const dados = new Map(entradas);
  return { getItem: (k) => dados.get(k) ?? null, setItem: (k, v) => dados.set(k, String(v)), removeItem: (k) => dados.delete(k), dados };
}
const resumo = (tema = 'programacao', dificuldade = 'facil', acertos = 2) => ({ tema, dificuldade, acertos, totalPerguntas: 3 });

test('catálogo contém exatamente os nomes aprovados, inclusive Médio', () => {
  assert.deepEqual(TEMAS.map(({ id, nome }) => [id, nome]), [
    ['programacao', 'Tecnologia'], ['futebol', 'Futebol'], ['matematica', 'Matemática'], ['historia', 'História'], ['games', 'Games'],
  ]);
  assert.deepEqual(NIVEIS.map(({ id, nome, pontos }) => [id, nome, pontos]), [
    ['facil', 'Fácil', 10], ['medio', 'Médio', 20], ['dificil', 'Difícil', 35],
  ]);
  assert.equal(nomeTema('programacao'), 'Tecnologia');
  assert.equal(nomeNivel('medio'), 'Médio');
  assert.ok(!nomeNivel('menina').includes('menina'));
  assert.ok(!nomeTema('inexistente').includes('inexistente'));
});

test('todas as 15 combinações possuem três perguntas válidas e dificuldade canônica', async () => {
  for (const tema of TEMAS) {
    const perguntas = JSON.parse(await readFile(new URL(`../public/data/${tema.id}.json`, import.meta.url), 'utf8'));
    for (const nivel of NIVEIS) assert.ok(perguntas.filter((p) => p.dificuldade === nivel.id).length >= 3);
    for (const p of perguntas) {
      assert.ok(NIVEIS.some((n) => n.id === p.dificuldade));
      assert.equal(typeof p.pergunta, 'string');
      assert.ok(Array.isArray(p.respostas));
      assert.ok(Number.isInteger(p.correta) && p.correta >= 0 && p.correta < p.respostas.length);
    }
  }
});

test('pontuação, melhor resultado, progresso e recomendação atualizam ao concluir e reler', () => {
  const storage = memoria();
  const vazio = lerProgresso('a', storage);
  assert.equal(analisarProgresso(vazio.concluidos, vazio.ultimoQuiz).percentual, 0);
  registrarResultado('a', resumo(), storage);
  // Uma nova leitura usa apenas o armazenamento persistido, como após atualizar a página.
  const depois = lerProgresso('a', memoria([...storage.dados]));
  assert.equal(depois.pontuacao, 20);
  assert.equal(depois.melhorPontuacao, 20);
  assert.deepEqual(depois.concluidos, ['programacao-facil']);
  assert.equal(analisarProgresso(depois.concluidos, depois.ultimoQuiz).recomendacao.dificuldade, 'medio');
  registrarResultado('a', resumo('programacao', 'medio', 3), storage);
  assert.equal(lerProgresso('a', storage).pontuacao, 80);
  assert.equal(lerProgresso('a', storage).melhorPontuacao, 60);
  registrarResultado('a', resumo('programacao', 'medio', 3), storage);
  assert.equal(lerProgresso('a', storage).pontuacao, 80);
});

test('créditos de todas as dificuldades e conclusão total preservam o bloqueio', () => {
  const storage = memoria();
  for (const tema of TEMAS) for (const nivel of NIVEIS) registrarResultado('a', resumo(tema.id, nivel.id, 3), storage);
  const estado = lerProgresso('a', storage);
  assert.equal(estado.pontuacao, 975);
  assert.equal(estado.melhorPontuacao, 105);
  assert.equal(estado.concluidos.length, 15);
  assert.equal(analisarProgresso(estado.concluidos, estado.ultimoQuiz).percentual, 100);
  assert.equal(selecionarDesafio('programacao', 'facil', estado.concluidos, estado.ultimoQuiz), null);
});

test('baixo desempenho e uma dificuldade esgotada usam apenas desafios disponíveis', () => {
  const concluidos = TEMAS.map((tema) => `${tema.id}-facil`);
  const r = analisarProgresso(concluidos, resumo('games', 'facil', 0));
  assert.equal(r.recomendacao.dificuldade, 'medio');
  assert.ok(!concluidos.includes(`${r.recomendacao.tema}-${r.recomendacao.dificuldade}`));
});

test('troca de perfil não compartilha pontuação, histórico nem conclusões', () => {
  const storage = memoria();
  storage.setItem('perfilHappyGame', JSON.stringify({ id: 'a', nome: 'Ana' }));
  registrarResultado(lerPerfil(storage).id, resumo(), storage);
  storage.setItem('perfilHappyGame', JSON.stringify({ id: 'b', nome: 'Bia' }));
  assert.equal(lerProgresso(lerPerfil(storage).id, storage).pontuacao, 0);
  assert.deepEqual(lerProgresso('b', storage).concluidos, []);
  registrarResultado('b', resumo('games', 'dificil', 3), storage);
  assert.equal(lerProgresso('b', storage).pontuacao, 105);
  assert.equal(lerProgresso('a', storage).pontuacao, 20);
  assert.deepEqual(lerProgresso('a', storage).concluidos, ['programacao-facil']);
});

test('perfil antigo sem ID mantém namespace existente e recebe avatar seguro', () => {
  const storage = memoria();
  storage.setItem('perfilHappyGame', JSON.stringify({ nome: 'Antigo' }));
  registrarResultado('visitante', resumo(), storage);
  assert.equal(lerPerfil(storage).id, 'visitante');
  assert.equal(typeof lerPerfil(storage).avatar.emoji, 'string');
  assert.equal(lerProgresso(lerPerfil(storage).id, storage).pontuacao, 20);
  assert.equal(storage.getItem('perfilHappyGame'), '{"nome":"Antigo"}');
});

test('JSON inválido, tipos inesperados e pontuações não finitas não causam travamentos', () => {
  for (const valor of ['{', 'null', 'true', '42', '"texto"', '{}', '[]']) {
    const storage = memoria();
    for (const chave of ['perfilHappyGame', 'quizzesConcluidosHappyGame_a', 'ultimoQuizHappyGame_a']) storage.setItem(chave, valor);
    assert.equal(lerPerfil(storage), null);
    assert.deepEqual(lerProgresso('a', storage).concluidos, []);
    assert.equal(lerProgresso('a', storage).ultimoQuiz, null);
  }
  for (const valor of ['Infinity', '-1', 'NaN', 'abc', '1.5']) {
    const storage = memoria([['pontuacaoTotalHappyGame_a', valor]]);
    assert.equal(lerProgresso('a', storage).pontuacao, 0);
  }
});

test('resumo válido recupera conclusão ausente sem conceder pontos novamente', () => {
  const storage = memoria([
    ['ultimoQuizHappyGame_a', JSON.stringify(resumo())],
    ['pontuacaoTotalHappyGame_a', '20'],
    ['quizzesConcluidosHappyGame_a', '{'],
  ]);
  assert.deepEqual(lerProgresso('a', storage).concluidos, ['programacao-facil']);
  registrarResultado('a', resumo(), storage);
  assert.equal(lerProgresso('a', storage).pontuacao, 20);
});

test('resumo numérico antigo é aceito; acertos impossíveis ou tipos errados são rejeitados', () => {
  assert.equal(normalizarResumo({ ...resumo(), acertos: '2', totalPerguntas: '3' }).acertos, 2);
  for (const acertos of [-1, 4, Infinity, 1.5, null, true, '', {}, []]) {
    assert.equal(normalizarResumo({ ...resumo(), acertos }), null);
  }
  assert.equal(normalizarResumo({ ...resumo(), dificuldade: 'menina' }), null);
});

test('parâmetros válidos preservam seleção; inválidos e concluídos usam alternativa válida', () => {
  for (const tema of TEMAS) for (const nivel of NIVEIS) {
    assert.deepEqual(selecionarDesafio(tema.id, nivel.id), { tema: tema.id, dificuldade: nivel.id });
  }
  for (const [tema, dificuldade] of [['programacao', 'facil'], ['x', 'menina'], [null, null]]) {
    const r = selecionarDesafio(tema, dificuldade, ['programacao-facil']);
    assert.equal(r.tema, 'futebol');
    assert.equal(r.dificuldade, 'facil');
  }
});

test('falha de gravação não deixa pontuação parcial e permite repetir o salvamento', () => {
  const storage = memoria();
  const setItem = storage.setItem;
  let chamadas = 0;
  storage.setItem = (k, v) => {
    if (++chamadas === 3) throw new Error('QuotaExceededError');
    return setItem(k, v);
  };
  assert.throws(() => registrarResultado('a', resumo(), storage));
  assert.equal(lerProgresso('a', storage).pontuacao, 0);
  assert.deepEqual(lerProgresso('a', storage).concluidos, []);
  registrarResultado('a', resumo(), storage);
  assert.equal(lerProgresso('a', storage).pontuacao, 20);
});

test('armazenamento indisponível permite leitura segura e sinaliza falha ao salvar', () => {
  const storage = { getItem() { throw new Error('SecurityError'); } };
  assert.equal(lerPerfil(storage), null);
  assert.equal(lerProgresso('a', storage).pontuacao, 0);
  assert.throws(() => registrarResultado('a', resumo(), storage));
});

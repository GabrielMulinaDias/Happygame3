import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { analisarProgresso } from '../src/lib/recomendacao.js';

// Usa o compilador JSX já instalado no projeto, sem dependências de teste extras.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { DesafioRecomendado, default: Evolucao } = await server.ssrLoadModule('/src/pages/Evolucao.jsx');
const { default: Quiz } = await server.ssrLoadModule('/src/pages/Quiz.jsx');
const { default: Ranking } = await server.ssrLoadModule('/src/pages/Ranking.jsx');
const { default: Home } = await server.ssrLoadModule('/src/pages/Home.jsx');
const { default: Projecao } = await server.ssrLoadModule('/src/pages/Projecao.jsx');
const { registrarResultado } = await import('../src/lib/progresso.js');
const { TEMAS, NIVEIS } = await import('../src/lib/catalogo.js');

function comStorage(executar) {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const dados = new Map();
  const storage = { getItem: (k) => dados.get(k) ?? null, setItem: (k, v) => dados.set(k, String(v)), removeItem: (k) => dados.delete(k) };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try { executar(storage); } finally {
    if (anterior) Object.defineProperty(globalThis, 'localStorage', anterior);
    else delete globalThis.localStorage;
  }
}

function pagina(Componente, url = '/') {
  return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(Componente)));
}

function renderizar(props) {
  return renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(DesafioRecomendado, props)));
}

test('seção renderiza o tema e nível reais com o link correspondente', () => {
  const concluidos = ['programacao-facil'];
  const resultado = analisarProgresso(concluidos, {
    tema: 'programacao', dificuldade: 'facil', acertos: 2, totalPerguntas: 3,
  });
  const html = renderizar({ ...resultado, concluidos });
  assert.ok(html.includes('Tecnologia • Médio'));
  assert.ok(html.includes('href="/quiz?tema=programacao&amp;dificuldade=medio"'));
  assert.ok(html.includes(resultado.recomendacao.motivo));
});

test('recomendação incompleta mostra mensagem e não oferece botão inválido', () => {
  for (const recomendacao of [null, {}, { motivo: 'Continue praticando' },
    { tema: 'programacao', dificuldade: 'desconhecida' }]) {
    const html = renderizar({ recomendacao, concluidos: [], concluidosCount: 0 });
    assert.ok(html.includes('Não foi possível obter um desafio recomendado válido'));
    assert.ok(!html.includes('Abrir desafio recomendado'));
    assert.ok(!html.includes('Parabéns!'));
  }
});

test('seção não oferece desafio concluído e preserva mensagem de 100%', () => {
  const html = renderizar({
    recomendacao: { tema: 'programacao', dificuldade: 'medio' },
    concluidos: ['programacao-medio'], concluidosCount: 1,
  });
  assert.ok(!html.includes('Abrir desafio recomendado'));
  assert.ok(html.includes('Não foi possível obter um desafio recomendado válido'));
  const completo = renderizar({ recomendacao: null, concluidosCount: 15 });
  assert.ok(completo.includes('Você concluiu todos os desafios disponíveis. Parabéns!'));
  assert.ok(!completo.includes('Abrir desafio recomendado'));
});

test('páginas reais resistem a perfil e histórico corrompidos', () => comStorage((storage) => {
  for (const perfil of ['{', 'null', '{}', '{"nome":"Antigo"}']) {
    storage.setItem('perfilHappyGame', perfil);
    storage.setItem('quizzesConcluidosHappyGame_visitante', '{}');
    storage.setItem('ultimoQuizHappyGame_visitante', '{');
    for (const Componente of [Evolucao, Quiz, Ranking, Home]) assert.doesNotThrow(() => pagina(Componente));
  }
}));

test('evolução e ranking refletem persistência, atualização e troca de perfil', () => comStorage((storage) => {
  assert.ok(pagina(Evolucao).includes('Criar perfil'));
  storage.setItem('perfilHappyGame', JSON.stringify({ id: 'a', nome: 'Ana' }));
  registrarResultado('a', { tema: 'programacao', dificuldade: 'facil', acertos: 2, totalPerguntas: 3 }, storage);
  const html = pagina(Evolucao);
  assert.ok(html.includes('Tecnologia • Médio'));
  assert.ok(html.includes('aria-valuenow="7"'));
  assert.ok(html.includes('1 de 15'));
  assert.ok(html.includes('>20</p>'));
  assert.ok(!html.includes('menina'));
  assert.equal(pagina(Evolucao), html);
  assert.ok(pagina(Ranking).includes('Pontuação total acumulada: 20'));
  storage.setItem('perfilHappyGame', JSON.stringify({ id: 'b', nome: 'Bia' }));
  assert.ok(pagina(Evolucao).includes('aria-valuenow="0"'));
  assert.ok(pagina(Evolucao).includes('Tecnologia • Fácil'));
  assert.ok(pagina(Ranking).includes('Pontuação total acumulada: 0'));
}));

test('Quiz real seleciona os parâmetros do link para todos os temas e dificuldades', () => comStorage(() => {
  for (const tema of TEMAS) for (const nivel of NIVEIS) {
    const html = pagina(Quiz, `/quiz?tema=${tema.id}&dificuldade=${nivel.id}`);
    assert.ok(html.includes(`<option value="${tema.id}" selected="">${tema.nome}</option>`));
    assert.ok(html.includes(`<option value="${nivel.id}" selected="">${nivel.nome} - ${nivel.pontos} pontos por acerto</option>`));
  }
}));

test('Quiz bloqueia conclusão no acesso direto e substitui links antigos ou inválidos', () => comStorage((storage) => {
  registrarResultado('visitante', { tema: 'programacao', dificuldade: 'facil', acertos: 1, totalPerguntas: 3 }, storage);
  const direto = pagina(Quiz, '/quiz');
  assert.ok(direto.includes('você já concluiu Tecnologia no nível Fácil'));
  for (const url of ['/quiz?tema=programacao&dificuldade=facil', '/quiz?tema=desconhecido&dificuldade=menina']) {
    const html = pagina(Quiz, url);
    assert.ok(html.includes('<option value="futebol" selected="">Futebol</option>'));
    assert.ok(!html.includes('menina'));
  }
}));

test('todos os desafios mostram 100%, mapa completo e nenhum link para repetir', () => comStorage((storage) => {
  storage.setItem('perfilHappyGame', JSON.stringify({ id: 'a', nome: 'Ana' }));
  for (const tema of TEMAS) for (const nivel of NIVEIS) registrarResultado('a', { tema: tema.id, dificuldade: nivel.id, acertos: 3, totalPerguntas: 3 }, storage);
  const html = pagina(Evolucao);
  assert.ok(html.includes('15 de 15'));
  assert.ok(html.includes('aria-valuenow="100"'));
  assert.equal((html.match(/✓ Concluído/g) || []).length, 15);
  assert.ok(!html.includes('Abrir desafio recomendado'));
  const quiz = pagina(Quiz, '/quiz?tema=programacao&dificuldade=facil');
  assert.ok(quiz.includes('Todos os desafios concluídos'));
  assert.ok(!quiz.includes('<select'));
}));

test('projeção exponencial preserva fórmula, tabela e resultado padrão', () => {
  const html = pagina(Projecao);
  assert.ok(html.includes('U(t) = U0 * (1 + r)^t'));
  assert.ok(html.includes('>535</div>'));
  assert.ok(html.includes('Mês 12'));
});

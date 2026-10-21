import test from 'node:test';
import assert from 'node:assert/strict';
import { analisarProgresso, apresentarRecomendacao, TEMAS, NIVEIS } from '../src/lib/recomendacao.js';

test('perfil sem histórico recebe Tecnologia Fácil', () => {
  const r = analisarProgresso();
  assert.equal(r.recomendacao.tema, 'programacao');
  assert.equal(r.recomendacao.dificuldade, 'facil');
  assert.equal(r.percentual, 0);
});

test('recomendação calculada exibe Tecnologia • Médio e abre os mesmos identificadores', () => {
  const concluidos = ['programacao-facil'];
  const { recomendacao } = analisarProgresso(concluidos, {
    tema: 'programacao', dificuldade: 'facil', acertos: 2, totalPerguntas: 3,
  });
  const exibicao = apresentarRecomendacao(recomendacao, concluidos);
  assert.equal(exibicao.titulo, 'Tecnologia • Médio');
  assert.equal(exibicao.destino, '/quiz?tema=programacao&dificuldade=medio');
  assert.equal(exibicao.motivo, recomendacao.motivo);
});

test('todos os nomes legíveis correspondem aos parâmetros do botão', () => {
  for (const tema of TEMAS) {
    for (const nivel of NIVEIS) {
      const exibicao = apresentarRecomendacao({ tema: tema.id, dificuldade: nivel.id });
      assert.equal(exibicao.titulo, `${tema.nome} • ${nivel.nome}`);
      const url = new URL(exibicao.destino, 'http://localhost');
      assert.equal(url.pathname, '/quiz');
      assert.equal(url.searchParams.get('tema'), tema.id);
      assert.equal(url.searchParams.get('dificuldade'), nivel.id);
    }
  }
});

test('campos ausentes, nomes de propriedades incorretos ou IDs inválidos não geram texto/link', () => {
  for (const recomendacao of [
    null, undefined, {}, { motivo: 'Continue praticando' },
    { temaId: 'programacao', nivel: 'medio' },
    { tema: '', dificuldade: '' },
    { tema: 'programacao' }, { dificuldade: 'medio' },
    { tema: 'inexistente', dificuldade: 'medio' },
    { tema: 'programacao', dificuldade: 'inexistente' },
    { tema: { id: 'programacao' }, dificuldade: 'medio' },
  ]) {
    assert.equal(apresentarRecomendacao(recomendacao), null);
  }
});

test('a apresentação também rejeita uma recomendação de desafio concluído', () => {
  assert.equal(apresentarRecomendacao(
    { tema: 'programacao', dificuldade: 'medio' }, ['programacao-medio'],
  ), null);
});

test('dois acertos em três sugerem avançar de Fácil para Médio', () => {
  const r = analisarProgresso(['programacao-facil'], {
    tema: 'programacao', dificuldade: 'facil', acertos: 2, totalPerguntas: 3,
  });
  assert.equal(r.recomendacao.dificuldade, 'medio');
  assert.equal(r.recomendacao.tema, 'programacao');
});

test('baixo desempenho sugere outro tema na mesma dificuldade', () => {
  const r = analisarProgresso(['programacao-facil'], {
    tema: 'programacao', dificuldade: 'facil', acertos: 1, totalPerguntas: 3,
  });
  assert.equal(r.recomendacao.dificuldade, 'facil');
  assert.equal(r.recomendacao.tema, 'futebol');
});

test('não recomenda quiz já concluído', () => {
  const r = analisarProgresso(['programacao-facil', 'programacao-medio'], {
    tema: 'programacao', dificuldade: 'facil', acertos: 3, totalPerguntas: 3,
  });
  assert.notEqual(`${r.recomendacao.tema}-${r.recomendacao.dificuldade}`, 'programacao-medio');
});

test('todos os desafios concluídos gera 100% e nenhuma recomendação', () => {
  const todos = TEMAS.flatMap((tema) => NIVEIS.map((nivel) => `${tema.id}-${nivel.id}`));
  const r = analisarProgresso(todos);
  assert.equal(r.percentual, 100);
  assert.equal(r.recomendacao, null);
});

test('ignora duplicatas e chaves inválidas', () => {
  const r = analisarProgresso(['programacao-facil', 'programacao-facil', 'inexistente']);
  assert.equal(r.concluidosCount, 1);
  assert.equal(r.percentual, 7);
});

test('sem resumo da última partida não recomenda desafio concluído', () => {
  const r = analisarProgresso(['programacao-facil']);
  assert.equal(r.recomendacao.tema, 'futebol');
  assert.equal(r.recomendacao.dificuldade, 'facil');
});

test('baixo desempenho no Médio mantém a dificuldade quando disponível', () => {
  const r = analisarProgresso(['programacao-medio'], {
    tema: 'programacao', dificuldade: 'medio', acertos: 1, totalPerguntas: 3,
  });
  assert.equal(r.recomendacao.tema, 'futebol');
  assert.equal(r.recomendacao.dificuldade, 'medio');
});

test('histórico inválido não gera tema ou nível inexistente', () => {
  const r = analisarProgresso(null, {
    tema: 'inexistente', dificuldade: 'facil', acertos: 3, totalPerguntas: 3,
  });
  assert.equal(r.recomendacao.tema, 'programacao');
  assert.equal(r.recomendacao.dificuldade, 'facil');
});

test('sempre recomenda uma combinação disponível para qualquer progresso', () => {
  const todos = TEMAS.flatMap((tema) => NIVEIS.map((nivel) => `${tema.id}-${nivel.id}`));
  for (let mascara = 0; mascara < 2 ** todos.length; mascara++) {
    const concluidos = todos.filter((_, indice) => mascara & (1 << indice));
    const { recomendacao, concluidosCount } = analisarProgresso(concluidos);
    assert.equal(concluidosCount, concluidos.length);
    if (concluidos.length === todos.length) {
      assert.equal(recomendacao, null);
    } else {
      const chave = `${recomendacao.tema}-${recomendacao.dificuldade}`;
      assert.ok(todos.includes(chave));
      assert.ok(!concluidos.includes(chave));
    }
  }
});

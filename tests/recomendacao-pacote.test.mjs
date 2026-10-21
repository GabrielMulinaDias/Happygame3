import test from 'node:test';
import assert from 'node:assert/strict';
import { analisarProgresso, TEMAS, NIVEIS } from '../src/lib/recomendacao.js';

test('perfil sem histórico recebe Tecnologia Fácil', () => {
  const r = analisarProgresso();
  assert.equal(r.recomendacao.tema, 'programacao');
  assert.equal(r.recomendacao.dificuldade, 'facil');
  assert.equal(r.percentual, 0);
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

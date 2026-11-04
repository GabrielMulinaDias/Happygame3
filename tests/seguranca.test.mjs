import test from 'node:test';
import assert from 'node:assert/strict';
import { lerPerfil, nomeValido } from '../src/lib/progresso.js';
import { selecionarPerguntas } from '../src/lib/perguntas.js';

test('perfil limita campos adulterados e mantém IDs antigos válidos', () => {
  const ler = perfil => lerPerfil({ getItem: () => JSON.stringify(perfil) });
  assert.equal(nomeValido(' '.repeat(10)), false);
  assert.equal(ler({ nome: 'a'.repeat(41) }), null);
  assert.equal(ler({ nome: 'Ana', id: 123 }).id, '123');
  const perfil = ler({ nome: ' Ana ', id: '../x', titulo: 'x'.repeat(81), avatar: { nome: 'x', emoji: 'x'.repeat(17) } });
  assert.equal(perfil.id, 'visitante');
  assert.equal(perfil.nome, 'Ana');
  assert.equal(perfil.titulo, 'Jogador');
  assert.equal(perfil.avatar.id, 0);
});

test('sorteio não altera catálogo nem repete perguntas', () => {
  const dados = Array.from({ length: 6 }, (_, i) => ({ pergunta: `Pergunta ${i}`, dificuldade: 'facil', respostas: ['A', 'B', 'C', 'D'], correta: 0 }));
  const antes = structuredClone(dados);
  for (let i = 0; i < 20; i++) {
    const rodada = selecionarPerguntas(dados, 'facil');
    assert.equal(new Set(rodada.map(p => p.pergunta)).size, 3);
  }
  assert.deepEqual(dados, antes);
  assert.throws(() => selecionarPerguntas(dados, 'facil', 7));
});

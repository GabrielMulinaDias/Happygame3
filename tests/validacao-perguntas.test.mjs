import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validarPerguntas } from "../src/lib/validacaoPerguntas.js";

const temas = ["programacao", "futebol", "matematica", "historia", "games"];
const niveis = ["facil", "medio", "dificil"];
const base = { pergunta: "Qual a resposta?", respostas: ["A", "B", "C", "D"], correta: 1, dificuldade: "facil" };
const tripla = () => [0, 1, 2].map(i => ({ ...base, pergunta: `Pergunta ${i}?` }));

test("todos os catálogos reais são válidos e possuem três questões por nível", () => {
  for (const tema of temas) {
    const dados = JSON.parse(readFileSync(new URL(`../public/data/${tema}.json`, import.meta.url), "utf8"));
    for (const nivel of niveis) assert.equal(validarPerguntas(dados, nivel).length, 3, `${tema}/${nivel}`);
  }
});
test("recusa catálogo ausente ou dificuldade inválida", () => {
  assert.throws(() => validarPerguntas(null, "facil"));
  assert.throws(() => validarPerguntas(tripla(), "avancado"));
});
test("recusa pergunta vazia", () => assert.throws(() => validarPerguntas([{...base, pergunta: ""}, ...tripla()], "facil")));
test("recusa alternativas incompletas", () => assert.throws(() => validarPerguntas([{...base, respostas: ["A"]}, ...tripla()], "facil")));
test("recusa resposta correta fora do intervalo", () => assert.throws(() => validarPerguntas([{...base, correta: 8}, ...tripla()], "facil")));
test("recusa dificuldade desconhecida no catálogo", () => assert.throws(() => validarPerguntas([{...base, dificuldade: "outro"}, ...tripla()], "facil")));
test("recusa duplicação de enunciados", () => assert.throws(() => validarPerguntas([...tripla(), tripla()[0]], "facil")));
test("recusa menos de três questões válidas", () => assert.throws(() => validarPerguntas(tripla().slice(0,2), "facil")));
test("recusa strings de tamanho excessivo", () => assert.throws(() => validarPerguntas([{...base, pergunta: "x".repeat(501)}, ...tripla()], "facil")));

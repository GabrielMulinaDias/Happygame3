import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const temas = ['programacao', 'futebol', 'matematica', 'historia', 'games'];
const niveis = ['facil', 'medio', 'dificil'];
const catalogos = Object.fromEntries(temas.map(tema => [tema,
  JSON.parse(readFileSync(new URL(`../public/data/${tema}.json`, import.meta.url), 'utf8'))]));

test('perfil, 15 desafios, correção, pontuação, ranking, persistência e evolução', async ({ page }) => {
  const erros = [];
  page.on('pageerror', erro => erros.push(erro.message));
  await page.goto('/');
  await page.getByLabel('Nome do jogador').fill('QA Jogador');
  await page.getByRole('button', { name: 'Selecionar avatar Explorador Matemático' }).click();
  await page.getByRole('button', { name: 'Salvar Perfil', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Perfil Criado' })).toBeVisible();
  let total = 0;
  for (const tema of temas) for (const nivel of niveis) {
    await page.goto('/quiz');
    await page.getByLabel('Escolha o tema do quiz').selectOption(tema);
    await page.getByLabel('Escolha a dificuldade do quiz').selectOption(nivel);
    await page.getByRole('button', { name: 'Começar Quiz', exact: true }).click();
    for (let i = 0; i < 3; i++) {
      await expect(page.getByText(`Pergunta ${i + 1} de 3`, { exact: true })).toBeVisible();
      const texto = await page.locator('h2').innerText();
      const pergunta = catalogos[tema].find(p => p.pergunta === texto);
      // Também verifica resposta incorreta, sem pontos.
      const indice = tema === 'programacao' && nivel === 'facil' && i === 0
        ? (pergunta.correta + 1) % 4 : pergunta.correta;
      await page.getByRole('button', { name: `Resposta: ${pergunta.respostas[indice]}`, exact: true }).click();
      if (indice === pergunta.correta) total += { facil: 10, medio: 20, dificil: 35 }[nivel];
      await expect(page.getByText('✓ Resposta correta', { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Quiz Finalizado!' })).toBeVisible();
    await page.getByRole('link', { name: 'Ver evolução e próximo desafio recomendado' }).click();
    if (tema === 'programacao' && nivel === 'facil') {
      await expect(page.getByText('Tecnologia • Médio', { exact: true })).toBeVisible();
      await page.getByRole('link', { name: 'Abrir desafio recomendado' }).click();
      await expect(page.getByLabel('Escolha a dificuldade do quiz')).toHaveValue('medio');
    }
  }
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await expect(page.getByText('15 de 15', { exact: true })).toBeVisible();
  await page.goto('/ranking');
  await expect(page.getByText(`Pontuação total acumulada: ${total}`, { exact: true })).toBeVisible();
  expect(total).toBe(965);
  expect(erros).toEqual([]);
});

test('falhas HTTP e catálogo malformado impedem início do quiz', async ({ page }) => {
  for (const resposta of [{ status: 500, body: '' }, { status: 200, contentType: 'application/json', body: '[null]' }]) {
    await page.route('**/data/programacao.json', route => route.fulfill(resposta));
    await page.goto('/quiz');
    await expect(page.getByRole('alert')).toContainText('Não foi possível carregar');
    await expect(page.getByRole('button', { name: 'Começar Quiz', exact: true })).toBeDisabled();
    await page.unroute('**/data/programacao.json');
  }
});

test('XSS textual, storage corrompido, rotas, IA e telas de 360 e 1280 pixels', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Nome do jogador').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button', { name: 'Salvar Perfil', exact: true }).click();
  await expect(page.getByRole('heading', { name: '<img src=x onerror=alert(1)>' })).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const rota of ['/', '/quiz', '/ranking', '/evolucao', '/ia', '/sobre', '/projecao']) {
      await page.goto(rota);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.goto('/ia');
  await expect(page.getByText(/Não há IA generativa, chatbot/)).toBeVisible();
  await page.evaluate(() => localStorage.setItem('perfilHappyGame', '{'));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Criar Perfil' })).toBeVisible();
  await page.goto('/rota-inexistente');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
});

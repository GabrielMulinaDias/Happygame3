# Happy Game

Protótipo acadêmico do Enterprise Challenge FIAP, em parceria com a Palo Alto Networks. Quizzes educativos com pontuação e acompanhamento de evolução, preservando a identidade visual e as funcionalidades existentes.

## Funcionalidades

- Perfil local com apelido (até 40 caracteres) e quatro avatares, sem senha.
- Tecnologia, Futebol, Matemática, História e Games.
- Três dificuldades, com 10, 20 e 35 pontos por acerto. São 45 perguntas, três por desafio, e 15 desafios únicos.
- Feedback, conclusão, bloqueio de repetição e persistência no navegador.
- Ranking demonstrativo com personagens fictícios, evolução e recomendação por regras.
- Simulador de crescimento exponencial, página Sobre e página informativa de IA.

## Tecnologias e instalação

React 19, React Router 7, Vite 8, Tailwind CSS 4 e JavaScript ES Modules. Requer Node.js >=22.12 (validado com 24.16.0) e npm.

```sh
npm ci
npm run dev
```

Abra a URL indicada pelo Vite. No PowerShell com scripts bloqueados, use `npm.cmd` em vez de `npm`, sem alterar a política de execução.

```sh
npm run lint
npm run build
node --test
npm audit
npm audit --omit=dev
npm run test:e2e
```

O build vai para `dist/`. Os testes E2E usam o Chrome instalado e iniciam o preview na porta 4173; gere o build antes. Para Chromium: `npx playwright install chromium` e configure `PW_CHANNEL=chromium` no ambiente. A CI usa Chromium. Resultados e limites em [Evidências](docs/EVIDENCIAS_TESTES.md).

## Arquitetura

SPA sem backend: `src/pages` contém as telas, `src/components` a navegação, `src/lib` as regras e persistência e `public/data` os catálogos JSON. `tests` contém testes Node e de renderização; `e2e` contém testes de navegador. Consulte [Arquitetura](docs/ARQUITETURA.md).

## Segurança e limitações

Catálogos e dados locais são validados; o React renderiza nomes como texto. Falhas de armazenamento são tratadas. Use um apelido e evite dados pessoais, especialmente em dispositivos compartilhados. Não há senhas, chaves de IA ou envio do progresso a servidores na aplicação.

O perfil não é uma conta autenticada. Pontuação e respostas podem ser adulteradas pelo usuário e não servem para competições reais. Trocar Perfil cria nova identidade e deixa o progresso anterior no navegador, sem seletor para recuperá-lo; apagar os dados do site remove os registros locais. Não há sincronização entre dispositivos nem garantia transacional entre abas.

As configurações de hospedagem foram preservadas por solicitação do responsável. Cabeçalhos HTTP e acesso direto às rotas precisam ser preparados e verificados antes da publicação. Veja [Segurança](docs/SEGURANCA.md) e [Auditoria de dependências](AUDITORIA_DEPENDENCIAS.md).

## IA e melhorias futuras

As recomendações são determinísticas: desempenho de pelo menos dois terços sugere subir de nível quando disponível; nos demais casos, procura-se um desafio ainda não concluído. Não há IA generativa nem chatbot funcional. Uma integração futura exige backend, credenciais protegidas, limites, validação e revisão pedagógica.

Outras melhorias: autenticação real, persistência remota, pontuação no servidor, exclusão de dados pela interface, revisão com leitores de tela e avaliação de privacidade adequada a menores. Não se declara conformidade legal ou aprovação para produção.

## Integração e publicação

O ZIP confirmado foi comparado com o commit `a69a556` e integrado seletivamente. Não foram copiados Git, dependências, builds ou caches. A configuração Vercel do ZIP ficou pendente. Consulte [Evidências](docs/EVIDENCIAS_TESTES.md). Nenhum merge ou deploy faz parte desta entrega.

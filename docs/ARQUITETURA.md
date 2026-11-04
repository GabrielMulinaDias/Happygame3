# Arquitetura e casos de uso — Happy Game

**Base da integração:** commit `a69a556be1c6d5aa5241b31470f28ee19ec00e8f`, com melhorias da Atividade 5 descritas nas evidências.

## Arquitetura implementada

```mermaid
flowchart TD
  U[Jogador] --> N[Navegador]
  N --> R[React SPA + React Router]
  R --> P[Home / Perfil]
  R --> Q[Quiz]
  R --> K[Ranking]
  R --> E[Evolução]
  R --> I[Página IA: proposta]
  R --> S[Simulador de crescimento]
  Q --> J[JSON estático: 5 temas]
  Q --> L[Catálogo / pontuação]
  E --> M[Recomendação por regras]
  P --> LS[(localStorage)]
  Q --> LS
  K --> LS
  E --> LS
```

O carregamento passa pela validação em `src/lib/validacaoPerguntas.js` e pelo sorteio Fisher–Yates em `src/lib/perguntas.js`, sem modificar o catálogo. Falhas preservam o fluxo de erro da interface. Cabeçalhos de hospedagem permanecem pendentes de autorização; consulte Segurança.

As rotas observadas em `src/App.jsx` são `/`, `/quiz`, `/ranking`, `/ia`, `/sobre`, `/projecao` e `/evolucao`. `public/data` contém 45 perguntas (cinco arquivos, nove perguntas por tema), com três perguntas por dificuldade. Não há requisição de IA externa, autenticação real ou serviço de banco de dados nesta versão.

## Casos de uso

1. Criar perfil local com nome e avatar.
2. Escolher categoria e dificuldade e responder três perguntas.
3. Receber feedback e pontuação (10, 20 ou 35 por acerto conforme dificuldade).
4. Consultar ranking local e progresso.
5. Seguir recomendação calculada por regras de desempenho.
6. Explorar simulação matemática de crescimento, sem dados de usuários reais.

## Dados e confiança

O perfil é armazenado sob `perfilHappyGame`. O progresso usa chaves com identificador de usuário, como `pontuacaoTotalHappyGame_<id>`, `quizzesConcluidosHappyGame_<id>` e `ultimoQuizHappyGame_<id>`. As validações de formato melhoram robustez, mas **o navegador controla os dados e a pontuação**. Não há barreira de confiança de servidor.

## Arquitetura futura (não implementada)

```mermaid
flowchart TD
  B[Navegador React] --> A[API backend com autenticação e rate limit]
  A --> D[(Banco de dados)]
  A --> V[Validação de respostas e pontuação]
  A --> G[Serviço IA via segredo no servidor]
  G --> F[Filtro e validação das perguntas]
```

A arquitetura futura depende de escolha de provedor, credenciais, orçamento e avaliação de segurança. Nenhuma dessas integrações foi ativada nesta proposta.

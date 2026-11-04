# Integração e evidências — Atividade 5

Data: 03/11/2026 (America/Sao_Paulo). Windows, Node 24.16.0, npm 11.13.0. Base: `a69a556` do repositório Happygame3; branch de trabalho `atividade5-melhorias`.

## Integração

Arquivo confirmado pelo responsável: `HappyGame_Codigo_Atualizado.zip`.
SHA-256: `DDEB39AA6EC64845427EB3ADD4F04330207C8125D42F5150C9A676F3C490C40C`.

Extraído para diretório local ignorado, com validação de caminhos e exclusão de Git, node_modules, dist e caches. Cada arquivo foi comparado com a base Git. Integrados: metadados HTML, validação de perguntas e nove testes, acessibilidade de Home/Quiz e workflow de validação. Arquitetura e segurança foram incorporadas e revisadas; README reescrito para o estado real.

O pacote não modifica catálogos, imagens, regras de pontuação ou recomendação existentes. Preservados histórico Git, configurações válidas e todas as telas. Não foram copiados documentos redundantes de diagnóstico, roteiro de publicação ou estimativas de custos. O vercel.json da raiz proposto pelo ZIP foi deixado pendente porque alterações de hospedagem exigem autorização explícita.

Correções adicionais: limites em campos do perfil lido do storage, embaralhamento Fisher–Yates, rota desconhecida com retorno, foco visível, bloqueio de botões durante correção, informação sobre ranking fictício e distinção entre recomendações por regras e IA generativa. O teste real reproduziu carregamento infinito ao selecionar novamente o mesmo valor; a seleção agora ignora essa alteração sem efeito.

## Resultados locais

| Comando | Resultado |
| --- | --- |
| npm ci | Aprovado, instalação limpa de 162 pacotes |
| npm run lint | Aprovado |
| npm run build | Aprovado, Vite 8.3.4, 37 módulos |
| node --test | 53 aprovados, zero falhas e zero ignorados |
| npm run test:e2e | 3 cenários aprovados em Chrome headless |
| npm audit | Código 1: seis entradas moderadas na cadeia minimatch/ESLint |
| npm audit --omit=dev | Código 0: zero vulnerabilidades |
| git diff --check | Sem erros de whitespace |

O PowerShell bloqueou npm.ps1: os comandos foram executados com npm.cmd. Auditorias iniciais tiveram bloqueio de rede e foram repetidas com acesso autorizado. Uma reinstalação encontrou arquivo nativo em uso pelo preview; o processo de teste foi encerrado e npm ci passou na repetição. O primeiro E2E encontrou o travamento de seleção e falhou; após correção, os três cenários passaram. Não foram tratados como aprovação os resultados dessas tentativas falhas.

## Cobertura funcional

- Chrome: criação de perfil e escolha de avatar; todos os cinco temas e três níveis por interação com os controles; 45 respostas, incluindo uma errada; resultado de 965 pontos, ranking e 15/15 desafios, com 100% de evolução após reload.
- Chrome: recomendação Tecnologia/Médio após 2/3 acertos; abertura do link e seleção correspondente.
- Chrome: respostas HTTP 500 e JSON malformado impedem início e mostram erro; perfil com HTML é exibido como texto; JSON de perfil corrompido retorna à criação; página inexistente e aviso real da IA.
- Chrome: ausência de overflow horizontal nas sete páginas em larguras de 360 e 1280 pixels. Não equivale a auditoria completa de acessibilidade ou de todos os dispositivos.
- Node: isolamento de perfis, falha de quota com rollback e repetição, storage indisponível, entradas inválidas, conclusão completa, pontuação sem duplicação, catálogos, sorteio sem alterar entrada e renderização das telas.

## Pendências e publicação

- Seis alertas moderados de desenvolvimento, sem correção compatível automática. O alerta alto do Zod foi corrigido. Detalhes em AUDITORIA_DEPENDENCIAS.md.
- Cabeçalhos HTTP e configuração SPA da hospedagem precisam de preparação, autorização e teste no provedor. Nenhum deploy ou merge foi executado.
- CI remota só pode ser confirmada após execução no GitHub; testes locais não comprovam status remoto.
- Não houve teste Safari/Firefox, leitor de tela, pentest, avaliação jurídica ou validação de cabeçalhos em produção.
- Ranking e progresso locais são adulteráveis; IA generativa, backend e autenticação real permanecem planejados.

Para concluir a publicação: revisar o PR e a pendência de dependências, aprovar a configuração de hospedagem, validar rotas/cabeçalhos no ambiente de destino e autorizar separadamente merge e deploy.

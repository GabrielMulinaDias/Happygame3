# Segurança e proteção de dados

## Controles implementados

- Catálogo limitado, dificuldade conhecida, enunciados únicos, quatro alternativas textuais e índice válido. Erros interrompem a rodada com aviso.
- Apelido de 1 a 40 caracteres, campos de apresentação limitados e formato de ID validado. Compatibilidade com IDs numéricos e perfis antigos sem ID.
- JSON inválido e armazenamento indisponível têm fallback. Pontos inteiros não negativos e rejeição de resultados inválidos. Salvamento tenta desfazer gravações parciais e permite repetir pela interface.
- Renderização textual pelo React, sem HTML dinâmico ou execução de conteúdo do perfil.
- Desafios e URLs restritos ao catálogo. Rotas desconhecidas apresentam retorno ao início. Todas as rotas são públicas.
- Aviso para uso de apelido, sem coleta de senha, email, idade ou localização e sem API de IA.
- Arquivos .env e artefatos locais ignorados pelo Git; nenhuma credencial adicionada.

## Limites e menores de idade

localStorage é acessível a quem controla o dispositivo/origem. Pontos são adulteráveis e respostas estão em JSON público. Não usar o ranking para premiações ou competição real. Concorrência entre abas pode perder atualizações; rollback local não equivale a transação de servidor.

Trocar perfil não remove o histórico anterior. A exclusão completa usa os controles de dados do site do navegador, ainda sem botão próprio. Para público menor de idade, usar apelidos e revisar minimização, conteúdo, transparência, retenção e controles adequados antes da operação pública. Esta revisão não certifica conformidade legal. Autenticação e políticas operacionais exigem projeto específico; não foram simuladas.

## Dependências

A atualização compatível corrigiu o alerta alto do Zod. Permanecem seis entradas moderadas da cadeia ESLint/minimatch no audit completo; produção retorna zero. Veja [auditoria](../AUDITORIA_DEPENDENCIAS.md). Não foi usado --force nem override major.

## Cabeçalhos e hospedagem: pendentes

O ZIP propõe vercel.json na raiz com rewrite SPA e cabeçalhos. Não foi integrado porque alterações de hospedagem dependem de autorização. O public/vercel.json existente foi preservado; estar no diretório público não comprova aplicação pela hospedagem.

Antes de publicar, preparar e aprovar configuração para X-Content-Type-Options: nosniff, X-Frame-Options: DENY ou frame-ancestors 'none', Referrer-Policy e Permissions-Policy. Uma CSP precisa restringir scripts/conexões à origem, impedir objetos/base externa e ser testada com os estilos inline atuais. Verificar HTTPS, cabeçalhos reais e reload das rotas na hospedagem. Nenhum cabeçalho de produção foi declarado aprovado nesta execução.

## IA futura

Credenciais apenas no backend, limites de uso, autorização, validação e revisão pedagógica. A implementação atual usa somente regras e catálogos locais.

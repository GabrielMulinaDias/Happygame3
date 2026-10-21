# Auditoria de segurança das dependências — Fase 6

Projeto: `Happygame3-fase6`. Esta auditoria substitui a pendência de 9 vulnerabilidades relatada na preparação do clone.

## Resultado

| Escopo | Inicial | Final |
| --- | --- | --- |
| Completo | 9: 2 moderadas e 7 altas | 0 |
| `--omit=dev` | 6: 1 moderada e 5 altas | 0 |
| Exclusivas de desenvolvimento | 3: 1 moderada e 2 altas | 0 |

As contagens são entradas de pacotes afetados do npm, não a quantidade de advisories distintos. React Router DOM é incluído pela dependência afetada.

## Pacotes corrigidos

| Pacote | Severidade inicial | Antes → depois | Presente com `--omit=dev` | Cadeia responsável |
| --- | --- | --- | --- | --- |
| `baseline-browser-mapping` | Moderada | 2.10.37 → 2.11.30 | Não | eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets → browserslist |
| `brace-expansion` | Alta | 5.0.6 → 5.0.12 | Não | eslint → minimatch |
| `browserslist` | Alta | 4.28.2 → 4.29.4 | Não | eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets |
| `nanoid` | Alta | 3.3.12 → 3.3.20 | Sim | @tailwindcss/vite → vite → postcss |
| `postcss` | Alta | 8.5.15 → 8.5.31 | Sim | @tailwindcss/vite → vite (também declarado em devDependencies) |
| `react-router` | Alta | 7.17.0 → 7.18.4 | Sim | react-router-dom |
| `react-router-dom` | Moderada | 7.17.0 → 7.18.4 | Sim | Dependência direta da aplicação; afetada por react-router |
| `source-map-js` | Alta | 1.2.1 → 1.2.2 | Sim | @tailwindcss/vite → @tailwindcss/node; também vite → postcss |
| `vite` | Alta | 8.0.16 → 8.3.4 | Sim | Dependência direta de desenvolvimento e peer de @tailwindcss/vite / @vitejs/plugin-react |

## Exposição e avaliação de compatibilidade

As três entradas exclusivas de desenvolvimento eram baseline-browser-mapping, brace-expansion e browserslist, ligadas ao lint/Babel.

Vite, PostCSS, nanoid e source-map-js também aparecem em `--omit=dev` porque @tailwindcss/vite está em dependencies. Sua função neste projeto é desenvolvimento/compilação de CSS e JavaScript. A classificação npm não comprova execução desses pacotes no navegador. Não foram movidos de seção apenas para remover alertas.

O projeto usa BrowserRouter e build estático. Os advisories de React Router sobre SSR/RSC dependem desses modos, que não estão configurados como servidor da aplicação. Isso reduz a exposição específica, mas não elimina os demais problemas de roteamento; por isso a dependência foi atualizada. Não foi realizado teste de exploração.

Foi executado `npm.cmd audit fix --dry-run --json` antes da aplicação. A proposta respeitou as faixas já declaradas. Os metadados npm confirmaram Vite 8.3.4 compatível com Node ^20.19.0 ou >=22.12.0; React Router DOM 7.18.4 exige Node >=20 e React/React DOM >=18. O ambiente usa Node 24.16.0 e React 19.2.7. Os plugins Tailwind e React aceitam Vite 8.

Aplicado `npm.cmd audit fix`, sem --force: 17 pacotes atualizados e 2 adicionados. Os adicionados são lightningcss e seu binding Windows x64, transitivos do Vite atualizado. Não houve atualização major nem alteração de funcionalidades; package.json permaneceu byte a byte igual. O lockfile registra também atualizações transitivas necessárias, incluindo Rolldown e dados de navegadores.

Notas oficiais consultadas: [Vite 8.3.4](https://github.com/vitejs/vite/releases/tag/v8.3.4) e [React Router 7.18.4](https://github.com/remix-run/react-router/releases/tag/react-router%407.18.4).

## Verificações após a correção

- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado com Vite 8.3.4.
- `node --test tests/*.test.mjs`: 42 aprovados, 0 reprovados, 0 ignorados.
- `npm.cmd audit`: 0 vulnerabilidades.
- `npm.cmd audit --omit=dev`: 0 vulnerabilidades.
- Comparação SHA-256: código, recursos, testes e index.html preservados; package.json inalterado.
- Sem commit ou push; alterações locais anteriores preservadas.

## Arquivos e limitações

Alterações desta etapa: `package-lock.json` e este relatório. `node_modules/` foi atualizado e `dist/` regenerado, ambos ignorados pelo Git. Backups das dependências e respostas JSON da auditoria estão em `.git/dependency-audit/`, fora dos arquivos publicáveis.

Nenhuma vulnerabilidade conhecida restou nos escopos auditados nesta execução. Isso não equivale a uma garantia de ausência de falhas desconhecidas ou de problemas fora das dependências. A validação foi automatizada; a conferência visual/interativa no navegador continua recomendada antes da publicação. A pasta original Happygame3-main não foi modificada nesta etapa.

## Avisos de segurança identificados inicialmente

### baseline-browser-mapping

- [baseline-browser-mapping process termination on invalid input causes denial of service](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) — versões afetadas: `>=2.0.0 <2.11.0`.

### brace-expansion

- [brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) — versões afetadas: `>=3.0.0 <5.0.7`.
- [brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash](https://github.com/advisories/GHSA-mh99-v99m-4gvg) — versões afetadas: `>=4.0.0 <5.0.8`.
- [brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation](https://github.com/advisories/GHSA-rgw5-rvv9-x895) — versões afetadas: `>=4.0.0 <5.0.9`.
- [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) — versões afetadas: `>=4.0.0 <5.0.12`.
- [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7) — versões afetadas: `>=4.0.0 <5.0.11`.
- [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) — versões afetadas: `>=4.0.0 <5.0.10`.

### browserslist

- [Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) — versões afetadas: `<=4.28.6`.
- [Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats)](https://github.com/advisories/GHSA-73wf-gq98-2v4g) — versões afetadas: `<=4.28.6`.

### nanoid

- [nanoid: non-secure generators can loop indefinitely with negative size](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) — versões afetadas: `<3.3.16`.
- [nanoid: custom generators can loop indefinitely when size is zero](https://github.com/advisories/GHSA-2v37-7h3g-55p8) — versões afetadas: `<3.3.18`.

### postcss

- [PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) — versões afetadas: `<=8.5.22`.
- [PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure](https://github.com/advisories/GHSA-r28c-9q8g-f849) — versões afetadas: `<=8.5.17`.

### react-router

- [React Router: Open redirect via backslash in <Link> and useNavigate (CVE-2025-68470 bypass)](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) — versões afetadas: `>=6.0.0 <7.18.0`.
- [React Router: RSCErrorHandler Missing Protocol Validation (XSS)](https://github.com/advisories/GHSA-h8fp-f39c-q6mh) — versões afetadas: `>=7.11.0 <7.18.0`.
- [React Router: Arbitrary Constructor Injection via deserializeErrors() in React Router SSR Hydration](https://github.com/advisories/GHSA-337j-9hxr-rhxg) — versões afetadas: `>=6.4.0 <7.18.0`.
- [React Router: Unauthenticated Denial of Service via Inefficient Route Matching](https://github.com/advisories/GHSA-chx6-hx7r-mcp5) — versões afetadas: `>=7.0.0 <7.18.0`.
- [React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) — versões afetadas: `>=7.12.0 <7.18.2`.

### react-router-dom

- Afetado pela dependência `react-router`.

### source-map-js

- [source-map-js allows event-loop denial of service through indexed source-map section offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) — versões afetadas: `>=1.0.0 <1.2.2`.

### vite

- [launch-editor: escapeCmdArgs() omits % escaping on Windows](https://github.com/advisories/GHSA-698v-4r3x-3vcv) — versões afetadas: `>=8.0.0 <=8.1.5`.
- [launch-editor: Editor CLI flag misinterpretation causing arbitrary command execution for some editors](https://github.com/advisories/GHSA-r825-w8mm-5pxw) — versões afetadas: `>=8.0.0 <=8.1.5`.
- [launch-editor: `fs.existsSync()` existence check can be bypassed on Windows](https://github.com/advisories/GHSA-587h-7wmj-h5pm) — versões afetadas: `>=8.0.0 <=8.1.5`.

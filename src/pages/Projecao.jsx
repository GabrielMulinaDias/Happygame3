import { useState } from "react";

function Projecao() {
  const [usuariosIniciais, setUsuariosIniciais] = useState(100);
  const [taxaPercent, setTaxaPercent] = useState(15);
  const [meses, setMeses] = useState(12);

  const USERS_STEP = 10;
  const USERS_MIN = 1;

  const TAXA_STEP = 1;
  const TAXA_MIN = 0;
  const TAXA_MAX = 30;

  const MESES_STEP = 1;
  const MESES_MIN = 1;
  const MESES_MAX = 60;

  const r = Number(taxaPercent) / 100;

  function projetadoPara(m) {
    const val = Number(usuariosIniciais) * Math.pow(1 + r, m);
    return Math.round(val);
  }

  const totalProjeto = projetadoPara(Number(meses));

  // ensure meses is integer within bounds for table generation
  const mesesInt = Math.max(MESES_MIN, Math.min(MESES_MAX, Math.round(Number(meses) || 0)));

  const tabela = Array.from({ length: mesesInt + 1 }, (_, i) => ({
    mes: i,
    usuarios: projetadoPara(i),
  }));

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-12">
      <style>{`\n        /* remove native spinner arrows */\n        input[type=number]::-webkit-outer-spin-button,\n        input[type=number]::-webkit-inner-spin-button {\n          -webkit-appearance: none;\n          margin: 0;\n        }\n        input[type=number] {\n          -moz-appearance: textfield;\n        }\n      `}</style>

      <div className="max-w-6xl mx-auto">

        <section className="text-center mb-8">
          <h1 className="text-5xl font-bold text-cyan-400">Projeção de Crescimento</h1>
          <p className="text-slate-300 mt-4 max-w-3xl mx-auto">
            Esta ferramenta usa uma função exponencial para estimar o crescimento
            de usuários do Happy Game ao longo do tempo.
          </p>
        </section>

        <section className="bg-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Parâmetros</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Usuários iniciais control */}
            <div>
              <label htmlFor="usuarios" className="block text-slate-300 mb-2">Usuários iniciais</label>
              <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">
                <button
                  aria-label="Diminuir usuários iniciais"
                  onClick={() => setUsuariosIniciais((v) => clamp(Number(v) - USERS_STEP, USERS_MIN, Infinity))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  −
                </button>

                <input
                  id="usuarios"
                  type="number"
                  min={USERS_MIN}
                  aria-label="Usuários iniciais"
                  className="w-full text-center px-4 py-3 bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  value={usuariosIniciais}
                  onChange={(e) => setUsuariosIniciais(clamp(Number(e.target.value || 0), USERS_MIN, Infinity))}
                  onBlur={() => setUsuariosIniciais((v) => clamp(Math.round(Number(v)), USERS_MIN, Infinity))}
                />

                <button
                  aria-label="Aumentar usuários iniciais"
                  onClick={() => setUsuariosIniciais((v) => clamp(Number(v) + USERS_STEP, USERS_MIN, Infinity))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Taxa control */}
            <div>
              <label htmlFor="taxa" className="block text-slate-300 mb-2">Taxa de crescimento mensal (%)</label>
              <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">
                <button
                  aria-label="Diminuir taxa de crescimento"
                  onClick={() => setTaxaPercent((v) => clamp(Number(v) - TAXA_STEP, TAXA_MIN, TAXA_MAX))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  −
                </button>

                <input
                  id="taxa"
                  type="number"
                  min={TAXA_MIN}
                  max={TAXA_MAX}
                  step="0.1"
                  aria-label="Taxa de crescimento mensal"
                  className="w-full text-center px-4 py-3 bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  value={taxaPercent}
                  onChange={(e) => setTaxaPercent(clamp(Number(e.target.value || 0), TAXA_MIN, TAXA_MAX))}
                  onBlur={() => setTaxaPercent((v) => clamp(Number(v), TAXA_MIN, TAXA_MAX))}
                />

                <button
                  aria-label="Aumentar taxa de crescimento"
                  onClick={() => setTaxaPercent((v) => clamp(Number(v) + TAXA_STEP, TAXA_MIN, TAXA_MAX))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Meses control */}
            <div>
              <label htmlFor="meses" className="block text-slate-300 mb-2">Quantidade de meses</label>
              <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">
                <button
                  aria-label="Diminuir quantidade de meses"
                  onClick={() => setMeses((v) => clamp(Number(v) - MESES_STEP, MESES_MIN, MESES_MAX))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  −
                </button>

                <input
                  id="meses"
                  type="number"
                  min={MESES_MIN}
                  max={MESES_MAX}
                  aria-label="Quantidade de meses"
                  className="w-full text-center px-4 py-3 bg-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  value={meses}
                  onChange={(e) => setMeses(clamp(Number(e.target.value || 0), MESES_MIN, MESES_MAX))}
                  onBlur={() => setMeses((v) => clamp(Math.round(Number(v)), MESES_MIN, MESES_MAX))}
                />

                <button
                  aria-label="Aumentar quantidade de meses"
                  onClick={() => setMeses((v) => clamp(Number(v) + MESES_STEP, MESES_MIN, MESES_MAX))}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 transition text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8">
            <p className="text-slate-300">
              Fórmula utilizada: <span className="text-cyan-300 font-mono">U(t) = U0 * (1 + r)^t</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-white">
              <div className="bg-slate-800 rounded-lg p-5">
                <div className="text-slate-300 text-sm">Usuários iniciais</div>
                <div className="text-2xl font-bold">{Math.round(Number(usuariosIniciais)).toLocaleString("pt-BR")}</div>
              </div>

              <div className="bg-slate-800 rounded-lg p-5">
                <div className="text-slate-300 text-sm">Taxa mensal</div>
                <div className="text-2xl font-bold">{Number(taxaPercent)}%</div>
              </div>

              <div className="bg-slate-800 rounded-lg p-5">
                <div className="text-slate-300 text-sm">Período</div>
                <div className="text-2xl font-bold">{mesesInt} meses</div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500 rounded-lg p-5">
                <div className="text-slate-300 text-sm">Usuários projetados</div>
                <div className="text-3xl font-bold text-cyan-300">{Number(totalProjeto).toLocaleString("pt-BR")}</div>
              </div>
            </div>

            {Number(totalProjeto) > 1000000 && (
              <div className="mt-3 text-sm text-yellow-200 bg-slate-800/50 p-3 rounded">
                Projeção elevada: taxas de crescimento compostas por longos períodos podem gerar valores muito altos.
              </div>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">Projeção mensal de usuários do Happy Game</caption>
              <thead>
                <tr className="text-slate-300 bg-slate-700">
                  <th scope="col" className="pb-3 pt-3 pl-4">Mês</th>
                  <th scope="col" className="pb-3 pt-3 pl-4">Usuários projetados</th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((row) => (
                  <tr key={row.mes} className="border-t border-slate-700 hover:bg-slate-700 transition">
                      <td className="py-3 pl-4 text-slate-200">Mês {row.mes}</td>
                      <td className="py-3 pl-4 text-slate-200">{Number(row.usuarios).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

      </div>
    </main>
  );
}

export default Projecao;

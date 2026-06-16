function Sobre() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">

        <section className="text-center">

          <h1 className="text-5xl font-bold text-cyan-400">
            Sobre o Happy Game
          </h1>

          <p className="text-slate-300 text-xl mt-5 max-w-3xl mx-auto">
            O Happy Game é uma plataforma educacional gamificada criada para
            tornar o aprendizado mais interativo, leve e acessível por meio de
            quizzes, pontuação, ranking e personalização do usuário.
          </p>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              Problema
            </h2>

            <p className="text-slate-300 mt-4">
              Muitos estudantes têm dificuldade em manter o interesse durante
              o processo de aprendizagem, principalmente quando o conteúdo é
              apresentado de forma muito tradicional, repetitiva ou pouco
              interativa.
            </p>

            <p className="text-slate-300 mt-4">
              O Happy Game busca resolver esse problema trazendo elementos de
              gamificação para aumentar o engajamento e transformar o estudo em
              uma experiência mais dinâmica.
            </p>

          </div>

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              Solução
            </h2>

            <p className="text-slate-300 mt-4">
              A solução proposta é uma aplicação web com quizzes temáticos,
              criação de perfil, escolha de avatar, pontuação, progresso e
              ranking.
            </p>

            <p className="text-slate-300 mt-4">
              Dessa forma, o usuário aprende respondendo perguntas, acompanha
              sua evolução e se sente mais motivado a continuar praticando.
            </p>

          </div>

        </section>

        <section className="bg-slate-800 rounded-3xl p-8 shadow-xl mt-12">

          <h2 className="text-3xl font-bold text-cyan-400">
            Evolução do Projeto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-slate-700 rounded-2xl p-6">

              <h3 className="text-xl font-bold">
                Fase 1
              </h3>

              <p className="text-slate-300 mt-3">
                Criação da ideia inicial, estrutura básica do site e primeiras
                telas com HTML e CSS.
              </p>

            </div>

            <div className="bg-slate-700 rounded-2xl p-6">

              <h3 className="text-xl font-bold">
                Fase 2 e 3
              </h3>

              <p className="text-slate-300 mt-3">
                Implementação de JavaScript, Bootstrap, quizzes, feedback visual,
                pontuação, LocalStorage e melhorias de UX/UI.
              </p>

            </div>

            <div className="bg-slate-700 rounded-2xl p-6">

              <h3 className="text-xl font-bold">
                Fase 4
              </h3>

              <p className="text-slate-300 mt-3">
                Reconstrução do projeto em React com Tailwind CSS, rotas,
                componentes, consumo de dados em JSON e estrutura mais profissional.
              </p>

            </div>

          </div>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              Tecnologias Utilizadas
            </h2>

            <ul className="text-slate-300 mt-6 space-y-3 list-disc list-inside">
              <li>React para construção da interface.</li>
              <li>React Router para navegação entre páginas.</li>
              <li>Tailwind CSS para estilização responsiva.</li>
              <li>JavaScript para lógica do quiz.</li>
              <li>JSON local para carregamento dinâmico de perguntas.</li>
              <li>Fetch, async/await e useEffect para consumo de dados.</li>
              <li>LocalStorage para salvar perfil e melhor pontuação.</li>
            </ul>

          </div>

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              Diferenciais
            </h2>

            <ul className="text-slate-300 mt-6 space-y-3 list-disc list-inside">
              <li>Experiência gamificada.</li>
              <li>Perfil com avatar personalizado.</li>
              <li>Ranking com posição do jogador.</li>
              <li>Feedback visual imediato nas respostas.</li>
              <li>Interface responsiva para celular e computador.</li>
              <li>Proposta futura de uso de IA generativa.</li>
            </ul>

          </div>

        </section>

        <section className="bg-slate-800 rounded-3xl p-8 shadow-xl mt-12">

          <h2 className="text-3xl font-bold text-cyan-400">
            Visão de Futuro
          </h2>

          <p className="text-slate-300 mt-4">
            Como próximos passos, o Happy Game poderá evoluir com login real,
            mais categorias de quizzes, sistema de conquistas, ranking global,
            acessibilidade aprimorada e integração com IA generativa para criar
            perguntas automaticamente a partir de temas escolhidos pelo usuário.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Sobre;
function IA() {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">

        <section className="text-center">

          <h1 className="text-5xl font-bold text-cyan-400">
            Inteligência Artificial no Happy Game
          </h1>

          <p className="text-slate-300 text-xl mt-5 max-w-3xl mx-auto">
            A IA é considerada como uma evolução futura do Happy Game,
            com o objetivo de tornar os quizzes mais personalizados,
            dinâmicos e adaptados ao desempenho dos usuários.
          </p>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              Como a IA poderia apoiar o projeto?
            </h2>

            <p className="text-slate-300 mt-4">
              A Inteligência Artificial poderia ser utilizada para gerar
              perguntas automaticamente, recomendar temas de estudo e adaptar
              a dificuldade dos quizzes conforme o desempenho do jogador.
            </p>

            <ul className="text-slate-300 mt-6 space-y-3 list-disc list-inside">
              <li>Criação automática de perguntas por tema.</li>
              <li>Recomendação de quizzes personalizados.</li>
              <li>Adaptação de dificuldade conforme os acertos e erros.</li>
              <li>Análise do progresso do usuário ao longo do tempo.</li>
            </ul>

          </div>

          <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-cyan-400">
              IA generativa ou chatbot?
            </h2>

            <p className="text-slate-300 mt-4">
              Para o Happy Game, a IA generativa faria mais sentido do que
              um chatbot tradicional. Em vez de apenas responder mensagens,
              ela poderia criar novos quizzes com base no tema escolhido pelo
              usuário.
            </p>

            <p className="text-slate-300 mt-4">
              Um chatbot também poderia ser usado futuramente como assistente
              de estudos, mas a prioridade seria a geração inteligente de
              perguntas e recomendações educacionais.
            </p>

          </div>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

          <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">

            <h3 className="text-2xl font-bold text-cyan-400">
              Benefícios
            </h3>

            <p className="text-slate-300 mt-4">
              A IA poderia aumentar o engajamento, personalizar o aprendizado
              e permitir que cada usuário receba conteúdos mais adequados ao
              seu nível de conhecimento.
            </p>

          </div>

          <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">

            <h3 className="text-2xl font-bold text-cyan-400">
              Riscos
            </h3>

            <p className="text-slate-300 mt-4">
              É necessário cuidado com perguntas incorretas, respostas mal
              formuladas e excesso de dependência da IA no processo de
              aprendizagem.
            </p>

          </div>

          <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">

            <h3 className="text-2xl font-bold text-cyan-400">
              Cuidados Éticos
            </h3>

            <p className="text-slate-300 mt-4">
              O projeto deve proteger dados dos usuários, evitar coleta
              desnecessária de informações e deixar claro quando recursos de IA
              forem utilizados.
            </p>

          </div>

        </section>

        <section className="bg-slate-800 rounded-3xl p-8 shadow-xl mt-12">

          <h2 className="text-3xl font-bold text-cyan-400">
            Visão futura
          </h2>

          <p className="text-slate-300 mt-4">
            Como evolução futura, o Happy Game poderá integrar uma IA generativa
            real para criar quizzes personalizados a partir de temas digitados
            pelo usuário, como futebol, matemática, tecnologia, história ou
            outros assuntos educacionais.
          </p>

          <p className="text-slate-300 mt-4">
            Nesta fase, a IA é apresentada como proposta estratégica de evolução,
            mantendo a aplicação atual simples, funcional e clara para os usuários.
          </p>

        </section>

      </div>

    </div>
  );
}

export default IA;
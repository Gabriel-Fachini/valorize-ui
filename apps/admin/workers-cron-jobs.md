Guia de Arquitetura: Workers e Cron Jobs (Monorepo)

Este guia resume a arquitetura recomendada para adicionar serviços de background (workers) e tarefas agendadas (cron jobs) ao seu projeto, mantendo a simplicidade e o reuso de código da sua arquitetura "Feature-First" [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/memory-bank/systemPatterns.md].

1. O Conceito Central: Monorepo com Múltiplos Processos

A melhor abordagem é manter tudo no mesmo repositório do GitHub. A separação deve ser feita em nível de processos em produção, não em repositórios de código.

Isso significa que você terá uma única base de código (e um único schema.prisma [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/prisma/schema.prisma]) que gera múltiplos serviços:

Processo da API: Sua aplicação Fastify (app.ts [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/src/app.ts]), responsável por receber requisições HTTP.

Processo do Worker: Um novo script (ex: src/worker.ts) que escuta uma fila de jobs.

Processo do Cron: Um novo script (ex: src/cron.ts ou src/scripts/run-task.ts) que é executado em agendamentos.

Vantagem Principal: Todos os processos podem importar e reutilizar seus serviços (como wallet.service.ts [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/src/features/wallets/wallet.service.ts]) e o cliente Prisma (lib/database.ts [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/src/lib/database.ts]) diretamente, sem nenhuma complexidade de pacotes ou sub-módulos.

2. Implementando Workers (Jobs em Fila)

Para tarefas que a API dispara, mas não devem bloquear a resposta (ex: processar um CSV de usuários [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/src/features/admin/users/csv-import.service.ts], enviar e-mails em massa).

Ferramenta Recomendada: BullMQ. Requer um banco de dados Redis.

Fluxo de Trabalho:

API (Fastify): Adiciona um job à fila do BullMQ.

Ex: filaDeCSV.add('processar-csv', { companyId: '...', file: '...' });

Worker (Novo Processo): Você criará um novo ponto de entrada, src/worker.ts, que instancia um Worker do BullMQ.

Este script vai escutar a fila (filaDeCSV.on('completed', ...)) e executar a lógica (ex: chamar csvImportService.processarJob(...)).

3. Implementando Serviços Agendados (Cron Jobs)

Para tarefas recorrentes (ex: resetWeeklyBalances [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/src/features/wallets/wallet.service.ts]).

Ferramenta Recomendada: Serviço de Cron Nativo do Railway.

Fluxo de Trabalho:

Crie um script simples que executa a tarefa desejada.

Ex: src/scripts/run-weekly-reset.ts

Este script importaria o walletService e chamaria walletService.resetWeeklyBalances().

No Railway, você configura um serviço do tipo "Cron" para executar este script em uma agenda (ex: 0 0 * * 1 - toda segunda-feira).

4. Guia Prático: Deploy no Railway

O Railway é ideal para essa arquitetura, pois permite múltiplos "Serviços" a partir de um único repositório.

Seu projeto no Railway teria esta aparência:

1. Banco de Dados (Plugins)

Plugin 1: PostgreSQL: Você já utiliza.

Plugin 2: Redis: Necessário para o BullMQ (fila de workers).

2. Serviços da Aplicação (do mesmo repositório)

Serviço A: api (Web Service)

Função: Sua API Fastify principal.

Repositório: seu-repositorio-github

Build: Detectará seu Dockerfile [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/Dockerfile] e construirá a imagem.

Comando de Início: (Padrão do Dockerfile) sh ./scripts/docker-entrypoint.sh [cite: gabriel-fachini/valorize-api/Gabriel-Fachini-valorize-api-8d3a9ca52eada5893812faf1e5cc07fbe2fb819e/scripts/docker-entrypoint.sh]

Variáveis de Ambiente: DATABASE_URL, REDIS_URL (fornecido pelo Railway), AUTH0_DOMAIN, etc.

Disponível Publicamente: Sim (terá um URL *.up.railway.app).

Serviço B: worker (Background Service)

Função: Processar jobs em fila do BullMQ.

Repositório: seu-repositorio-github (o mesmo repositório).

Build: Usará a mesma imagem Docker construída pelo Serviço A.

Comando de Início (Sobrescrito): node dist/worker.js

Nota: Você precisará criar o arquivo src/worker.ts e compilá-lo para dist/worker.js no seu processo de build.

Variáveis de Ambiente: DATABASE_URL, REDIS_URL, etc. (iguais à API).

Disponível Publicamente: Não.

Serviço C: cron-weekly (Cron Service)

Função: Rodar tarefas agendadas, como o reset semanal.

Repositório: seu-repositorio-github (o mesmo repositório).

Build: Usará a mesma imagem Docker.

Agenda (Schedule): 0 0 * * 1 (Exemplo: toda segunda-feira às 00:00 UTC).

Comando de Início (Sobrescrito): node dist/scripts/run-weekly-reset.js

Nota: Você precisará criar o script src/scripts/run-weekly-reset.ts.

Disponível Publicamente: Não.

Conclusão

Manter um monorepo e usar os múltiplos serviços do Railway é a estratégia mais simples, escalável e de fácil manutenção para o seu projeto. Você compartilha toda a lógica de negócios e o schema do Prisma entre a API, os Workers e os Crons sem esforço.
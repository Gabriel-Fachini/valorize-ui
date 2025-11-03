- Adicionar 'X' no campo de busca para limpar o campo. 
- Detalhar mais funcionalidade de import csv com cargos
- Atualizar alguém sem cargo ou departamento está dando erro, o campo de departmentId e jobTitleId vão nulos e retorna um erro de invalid department. Deve ser possível editar usuários mesmo que não tenham departamento ou cargo.
- Adicionar skeleton loading na tabela.
- Na hora de criar um novo usuário, ao selecionar o departamento, o dropdown de cargo deve mostrar apenas os cargos daquele departamento. (API)
- Decidir se usuários devem preencher cargo e departamento.
- Ao editar um usuário e dar algum erro, nenhum feedback é mostrado para o usuário. Adicione um feedback de erro.

FASE 1: Preparação (1-2h)
✅ Criar pasta src/config/tables/
✅ Criar src/config/tables/types.ts com todos os tipos
✅ Criar pasta src/components/ui/data-table/
✅ Atualizar PageHeader com suporte a icon
FASE 2: Componentes Base DataTable (4-6h)
✅ DataTableColumnRenderers.tsx - Renderizadores de cada tipo de coluna
✅ DataTablePagination.tsx - Footer de paginação
✅ DataTableBulkActions.tsx - Barra de ações em lote
✅ DataTableToolbar.tsx - Filtros e ações superiores
✅ DataTable.tsx - Componente principal
FASE 3: Configuração de Tabelas (2-3h)
✅ src/config/tables/users.table.config.ts
✅ src/config/tables/index.ts (exports)
FASE 4: Migração UsersPage (2-3h)
✅ Substituir header manual por <PageHeader />
✅ Substituir <UsersTable /> por <DataTable config={usersTableConfig} />
✅ Ajustar handlers e lógica
✅ Testar funcionalidades
FASE 5: Refinamento (2-3h)
✅ Loading states e skeletons
✅ Animações com react-spring
✅ Testes de responsividade
✅ Documentação
### Página de detalhes do cargo
- Os loadings skeletons estão sem o theme dark
- Botões de editar e deletar devem estar à direita do layout principal
- Adicionar cor primary bg-primary-50 ou bg-primary-100 nas permissions selecionadas
- Sonner's com cor preta (todos). Quero eles com background preto mas com ícone de check verde ou X vermelho.
- Adicionar (x) onde x é o número de permissões do cargo. Adicionar isso como um estado para mudar o número caso adicione ou remova. Igual está em usuário.
- Falta campo de busca no modal de adicionar permissões, adicione filtro por categoria também.
- No modal de usuário ele abre normalmente mas nenhum dropdown aparece e nenhuma requisição à api é feita. Para essa funcionalidade use o endpoint `/admin/roles/users/list`. Receberá um array de usuários com id, name, email e avatar direto em data.
- No modal de novo usuário adicione um disclaimer: não encontrou o usuário, é necessário que ele seja admin primeiro.
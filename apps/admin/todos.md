### Página de detalhes do cargo
- Remover completamente a seção de "Gerenciador de Permissões"
- Na parte de Permissões de Cargo adicione uma barra de pesquisa simples com string match
- Ao remover um usuário na última seção de conseguir sucesso na operação, a UI não é atualizada. Parece que o usuário ainda está lá e a UI não respondeu com sucesso ou falha.
- Implementar modal e funcionalidade de adicionar cargo à um usuário. Nesse modal deve existir um input com dropdown de busca de usuários disponíveis.
- Mostrar categorias das permissões, veja exemplo de retorno da api:
```json
{
    "roleId": "cmhjgx2ln0014tp7eqfb7wub4",
    "categories": [
        {
            "category": "Administração",
            "permissions": [
                {
                    "id": "cmhjgx2km000itp7eq9sd6c2c",
                    "name": "admin:access_panel",
                    "description": "Acessar painel de administração",
                    "category": "Administração"
                },
                {
                    "id": "cmhjgx2km000jtp7elddh5e4q",
                    "name": "admin:view_analytics",
                    "description": "Visualizar análises e relatórios do sistema",
                    "category": "Administração"
                }
            ]
        },
        {
            "category": "Gerenciamento de Funções",
            "permissions": [
                {
                    "id": "cmhjgx2km000htp7eqtdkslj9",
                    "name": "permissions:read_all",
                    "description": "Visualizar todas as permissões disponíveis para dicas de ferramentas e documentação",
                    "category": "Gerenciamento de Funções"
                },
                {
                    "id": "cmhjgx2ki0004tp7etpp97x4b",
                    "name": "roles:read",
                    "description": "Visualizar funções e permissões",
                    "category": "Gerenciamento de Funções"
                }
            ]
        },
        {
            "category": "Gerenciamento de Usuários",
            "permissions": [
                {
                    "id": "cmhjgx2kk0009tp7eyvg1ogmq",
                    "name": "users:manage_roles",
                    "description": "Atribuir e remover funções de usuários",
                    "category": "Gerenciamento de Usuários"
                },
                {
                    "id": "cmhjgx2kj0007tp7erfcd39rn",
                    "name": "users:update",
                    "description": "Atualizar informações de usuários",
                    "category": "Gerenciamento de Usuários"
                }
            ]
        },
        {
            "category": "Sistema de Biblioteca",
            "permissions": [
                {
                    "id": "cmhjgx2kq000wtp7eglum6c5z",
                    "name": "library:view_books",
                    "description": "Visualizar biblioteca de livros",
                    "category": "Sistema de Biblioteca"
                }
            ]
        },
        {
            "category": "Sistema de Elogios",
            "permissions": [
                {
                    "id": "cmhjgx2ko000ptp7esx7phg5n",
                    "name": "praise:moderate",
                    "description": "Moderar e gerenciar elogios",
                    "category": "Sistema de Elogios"
                },
                {
                    "id": "cmhjgx2kn000otp7e7pjgkkx4",
                    "name": "praise:view_all",
                    "description": "Visualizar todos os elogios da empresa",
                    "category": "Sistema de Elogios"
                }
            ]
        },
        {
            "category": "Sistema de Loja",
            "permissions": [
                {
                    "id": "cmhjgx2kp000ttp7enxaiuunk",
                    "name": "store:view_catalog",
                    "description": "Visualizar catálogo de prêmios",
                    "category": "Sistema de Loja"
                }
            ]
        },
        {
            "category": "Sistema de Moedas",
            "permissions": [
                {
                    "id": "cmhjgx2ko000qtp7ebqqblnbh",
                    "name": "coins:view_balance",
                    "description": "Visualizar saldo de moedas",
                    "category": "Sistema de Moedas"
                }
            ]
        },
        {
            "category": "User Management",
            "permissions": [
                {
                    "id": "cmhjgx2kj0005tp7ekkoqjjoh",
                    "name": "users:read",
                    "description": "View user information",
                    "category": "User Management"
                }
            ]
        }
    ]
}
```
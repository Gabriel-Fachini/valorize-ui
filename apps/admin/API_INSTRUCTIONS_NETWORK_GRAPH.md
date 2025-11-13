# Instruções da API - Gráfico de Rede de Elogios

## Visão Geral
Este documento especifica o formato de dados que a API deve retornar para alimentar o gráfico de visualização de rede de elogios da plataforma.

## Endpoint Sugerido
```
GET /api/analytics/compliments/network
```

## Formato da Resposta

A API deve retornar um objeto JSON contendo duas propriedades principais: `nodes` (nós/pessoas) e `links` (conexões/elogios entre pessoas).

```typescript
{
  nodes: NodeType[]
  links: LinkType[]
}
```

## Estrutura dos Dados

### 1. Nodes (Nós) - Representam Pessoas

Cada nó representa uma pessoa na rede e deve conter as seguintes propriedades:

```typescript
type NodeType = {
  id: number                    // ID único da pessoa
  name: string                  // Nome completo da pessoa
  role: string                  // Cargo/função da pessoa
  department: string            // Departamento ao qual pertence
  complimentsGiven: number      // Total de elogios dados pela pessoa
  complimentsReceived: number   // Total de elogios recebidos pela pessoa
}
```

#### Exemplo de Node:
```json
{
  "id": 1,
  "name": "Ana Silva",
  "role": "Desenvolvedora Senior",
  "department": "Engenharia",
  "complimentsGiven": 15,
  "complimentsReceived": 12
}
```

### 2. Links (Conexões) - Representam Elogios entre Pessoas

Cada link representa uma conexão de elogios entre duas pessoas. Os links são **direcionais** (de quem deu para quem recebeu).

```typescript
type LinkType = {
  source: number       // ID da pessoa que deu o elogio
  target: number       // ID da pessoa que recebeu o elogio
  value: number        // Quantidade de elogios entre essas duas pessoas
  compliments: string[] // Array com o texto dos elogios dados
}
```

#### Exemplo de Link:
```json
{
  "source": 1,
  "target": 5,
  "value": 9,
  "compliments": [
    "Mentoria excelente",
    "Conhecimento técnico",
    "Paciência",
    "Disponibilidade",
    "Inspiração"
  ]
}
```

## Exemplo Completo de Resposta da API

```json
{
  "nodes": [
    {
      "id": 1,
      "name": "Ana Silva",
      "role": "Desenvolvedora Senior",
      "department": "Engenharia",
      "complimentsGiven": 15,
      "complimentsReceived": 12
    },
    {
      "id": 2,
      "name": "Carlos Mendes",
      "role": "Product Manager",
      "department": "Produto",
      "complimentsGiven": 20,
      "complimentsReceived": 18
    },
    {
      "id": 3,
      "name": "Maria Santos",
      "role": "UX Designer",
      "department": "Design",
      "complimentsGiven": 8,
      "complimentsReceived": 15
    }
  ],
  "links": [
    {
      "source": 1,
      "target": 2,
      "value": 3,
      "compliments": [
        "Ótima liderança",
        "Visão estratégica",
        "Comunicação clara"
      ]
    },
    {
      "source": 2,
      "target": 3,
      "value": 4,
      "compliments": [
        "Designs incríveis",
        "Criatividade",
        "Atenção aos detalhes",
        "Colaboração"
      ]
    },
    {
      "source": 3,
      "target": 2,
      "value": 3,
      "compliments": [
        "Visão de produto",
        "Priorização clara",
        "Empatia com usuário"
      ]
    }
  ]
}
```

## Regras de Negócio e Observações Importantes

### 1. Links Direcionais
- Os links devem ser **direcionais** (de quem dá para quem recebe)
- Se Ana elogiou Carlos 3 vezes e Carlos elogiou Ana 2 vezes, devem existir **dois links separados**:
  - Um link com `source: Ana.id, target: Carlos.id, value: 3`
  - Outro link com `source: Carlos.id, target: Ana.id, value: 2`

### 2. Agregação de Elogios
- `value`: Representa a **quantidade total** de elogios dados de uma pessoa para outra
- `compliments`: Array contendo o **texto/conteúdo** de cada elogio individual
- O tamanho do array `compliments` deve ser **igual** ao valor de `value`

### 3. Contadores nos Nodes
- `complimentsGiven`: Soma de todos os elogios que a pessoa **deu** (soma dos `value` onde a pessoa é `source`)
- `complimentsReceived`: Soma de todos os elogios que a pessoa **recebeu** (soma dos `value` onde a pessoa é `target`)

### 4. Departamentos
Os departamentos são usados para colorir os nós no gráfico. Atualmente suportados:
- "Engenharia" → Azul
- "Produto" → Verde
- "Design" → Âmbar
- "Data" → Roxo

Novos departamentos podem ser adicionados, mas precisarão de cores definidas no frontend.

### 5. IDs dos Links
- Os campos `source` e `target` devem referenciar o `id` dos nós
- Garanta que todos os IDs referenciados nos links existam nos nodes

### 6. Performance e Visualização
- O gráfico funciona melhor com **10-50 nós**
- Muitos nós (>100) podem tornar a visualização confusa
- Links com `value` muito alto indicam conexões fortes e aparecerão mais grossos no gráfico

## Parâmetros de Query Opcionais (Sugestões)

A API pode aceitar parâmetros para filtrar os dados:

```
GET /api/analytics/compliments/network?department=Engenharia
GET /api/analytics/compliments/network?startDate=2024-01-01&endDate=2024-12-31
GET /api/analytics/compliments/network?minConnections=2
```

### Parâmetros sugeridos:
- `department` (string): Filtrar por departamento específico
- `startDate` (ISO date): Data inicial do período
- `endDate` (ISO date): Data final do período
- `minConnections` (number): Mínimo de conexões para incluir uma pessoa
- `limit` (number): Limitar número máximo de nós retornados

## Considerações de Implementação Backend

### Cálculo dos Dados
1. **Nodes**: Buscar todas as pessoas envolvidas em elogios no período
2. **Links**: Agregar elogios entre pares de pessoas:
   ```sql
   SELECT
     sender_id as source,
     receiver_id as target,
     COUNT(*) as value,
     ARRAY_AGG(compliment_text) as compliments
   FROM compliments
   WHERE created_at BETWEEN ? AND ?
   GROUP BY sender_id, receiver_id
   ```
3. **Contadores**: Calcular `complimentsGiven` e `complimentsReceived` para cada pessoa

### Performance
- Considere adicionar cache para este endpoint (dados podem ser cacheados por 1 hora)
- Para grandes volumes, limite os dados retornados (top N pessoas mais ativas)
- Use índices nas colunas `sender_id`, `receiver_id` e `created_at`

### Privacidade
- Considere anonimizar dados sensíveis se necessário
- Garanta que apenas usuários autorizados possam acessar este endpoint

## Exemplo de Uso no Frontend

```typescript
// Fetch dos dados
const response = await fetch('/api/analytics/compliments/network')
const networkData = await response.json()

// networkData já está no formato esperado:
// { nodes: [...], links: [...] }
```

## Versionamento
- Versão atual: 1.0
- Data: 2024
- Última atualização: 2024-11-13

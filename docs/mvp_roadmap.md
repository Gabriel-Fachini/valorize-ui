# Valorize - Roadmap do MVP

## 🎯 Objetivo do MVP

**Produto mínimo para apresentar ao primeiro cliente piloto e coletar feedback real de usuários.**

---

## ✅ O Que JÁ Está Pronto

### Experiência do Colaborador (Completa)
- Sistema de elogios (enviar/receber com valores)
- Sistema de moedas duplas (elogios + resgate)
- Feed público de elogios
- Catálogo de prêmios com filtros
- Fluxo completo de resgate
- Rastreamento de entrega
- Cancelamento de resgate (24h)
- Histórico de transações
- Gerenciamento de endereços
- Configurações de acessibilidade

**Status**: ✅ Experiência do usuário final está funcional e completa.

---

## 🚨 O Que Está Faltando

Organizado por ordem de urgência (do mais crítico ao menos crítico).

---

## 🔴 CRÍTICO - SEM ISSO NÃO APRESENTE AO PILOTO

### 1. Dashboard Admin - Visão Executiva
**O que é**: Painel para RH/Gestores verem métricas em tempo real

**Funcionalidades**:
- Cards com números principais:
  - Total de elogios enviados (últimos 30 dias)
  - Moedas movimentadas
  - Usuários ativos
  - Prêmios resgatados
  - % de engajamento da plataforma
- Gráfico: Elogios por semana (últimas 8 semanas)
- Ranking: Top 5 valores mais praticados
- Seção de alertas (se houver)

**Por que é crítico**:
- RH precisa ver valor imediato através de dados
- Tomador de decisão não compra sem analytics
- É o principal diferencial competitivo

**Estimativa**: 3-4 dias

---

### 2. Configuração de Valores da Empresa
**O que é**: Tela para admin cadastrar os valores da empresa

**Funcionalidades**:
- Adicionar novo valor (nome, descrição, exemplo)
- Editar valor existente
- Excluir valor
- Reordenar valores
- Ícone/emoji opcional

**Por que é crítico**:
- Cada empresa tem valores diferentes
- Bloqueio técnico: colaboradores não podem enviar elogios sem valores cadastrados
- Demonstra customização da plataforma

**Estimativa**: 2-3 dias

---

### 3. Gerenciamento de Usuários
**O que é**: CRUD de usuários + importação em massa

**Funcionalidades**:
- Listar todos os usuários
- Buscar por nome/email
- Filtrar por departamento/status
- Ver detalhes de usuário
- Editar informações (nome, email, departamento, cargo)
- Ativar/desativar usuário
- **Importar CSV** (nome, email, departamento, cargo)

**Por que é crítico**:
- Admin precisa cadastrar colaboradores do piloto
- Importação CSV é mandatória para empresas com 50+ pessoas
- Sem isso, admin não consegue gerenciar a base

**Estimativa**: 2-3 dias

---

### 4. Configuração da Empresa
**O que é**: Tela de configurações globais

**Funcionalidades**:
- Nome da empresa
- Upload de logo
- Gerenciar domínios permitidos (para SSO)
- Configurar quantidade de renovação semanal (moedas de elogios)
- Definir dia da renovação semanal

**Por que é crítico**:
- Domínios necessários para Login Google funcionar
- Logo dá branding profissional
- Admin pode ajustar economia de moedas

**Estimativa**: 2 dias

---

**TOTAL CRÍTICO**: 9-12 dias úteis (2-3 semanas)

---

## 🟡 ALTA PRIORIDADE - FORTEMENTE RECOMENDADO

### 5. Login Google Workspace (SSO)
**O que é**: Autenticação via OAuth Google com verificação de domínio

**Funcionalidades**:
- Botão "Login com Google"
- OAuth redirect para Google
- Validação de domínio do email
- Criação automática de usuário (primeiro login)
- Importação de dados: nome, email, foto
- Tela de erro quando domínio não é cliente

**Por que é importante**:
- Reduz fricção massivamente (sem senha)
- Requisito comum de empresas B2B
- Segurança corporativa
- Diferencial competitivo

**Alternativa temporária**: Login com email/senha

**Estimativa**: 2-3 dias

---

### 6. Onboarding Interativo
**O que é**: Tutorial guiado com recompensas

**Funcionalidades**:
- Modal de boas-vindas no primeiro login
- Passo 1: "Envie seu primeiro elogio" → +50 moedas bônus
- Passo 2: "Explore prêmios" → +25 moedas
- Passo 3: "Complete seu perfil" → +25 moedas
- Checklist visual no dashboard com progresso
- Tooltips contextuais

**Por que é importante**:
- Aumenta adoção inicial significativamente
- Educa usuários sobre funcionalidades
- Reduz abandono nas primeiras 72h

**Alternativa temporária**: Tutorial manual pelo RH

**Estimativa**: 2-3 dias

---

### 7. Notificações In-App
**O que é**: Sistema de notificações dentro da plataforma

**Funcionalidades**:
- Badge com contador no ícone
- Centro de notificações
- Lista de notificações recentes
- Marcar como lida
- Tipos:
  - Você recebeu um elogio (+X moedas)
  - Saldo renovado (+100 moedas)
  - Prêmio enviado/entregue
  - Milestone atingido

**Por que é importante**:
- Re-engajamento dos usuários
- Usuários não esquecem da plataforma
- Celebra reconhecimento recebido

**Alternativa temporária**: Email manual pelo RH

**Estimativa**: 2 dias

---

**TOTAL ALTA PRIORIDADE**: 6-8 dias úteis (1-2 semanas)

---

## 🟢 MÉDIA PRIORIDADE - BOM TER

### 8. Email de Notificações
**O que é**: Emails automáticos para eventos principais

**Funcionalidades**:
- Email de boas-vindas
- Email quando recebe elogio
- Digest semanal (resumo de atividades)

**Por que é bom ter**:
- Re-engajamento via email
- Usuários podem não acessar plataforma diariamente

**Estimativa**: 1-2 dias

---

### 9. Auditoria de Má Fé (Básica)
**O que é**: Detecção automática de comportamentos suspeitos

**Funcionalidades**:
- Cron job semanal
- Detecta trocas recíprocas excessivas (>5 vezes em 30 dias)
- Detecta mensagens muito curtas (<10 caracteres)
- Gera relatório de usuários suspeitos
- Admin recebe email com alertas

**Por que é bom ter**:
- Demonstra que pensamos em integridade
- RH pode monitorar manualmente no início

**Estimativa**: 2 dias

---

### 10. Calendário com Aniversários
**O que é**: Calendário corporativo com datas importantes

**Funcionalidades**:
- Exibe aniversários dos colaboradores
- Exibe tempo de casa (aniversário de entrada)
- Lembretes automáticos (opcional)
- Iniciativa automática: bônus de moedas no aniversário

**Por que é bom ter**:
- Nice to have que impressiona
- Reforça cultura de reconhecimento

**Estimativa**: 2 dias

---

### 11. Reações aos Elogios
**O que é**: Usuários podem reagir aos elogios no feed

**Funcionalidades**:
- Botões de reação (👏 ❤️ 🎉 🔥)
- Contador de reações
- Lista de quem reagiu
- Notificação quando alguém reage ao seu elogio

**Por que é bom ter**:
- Aumenta engajamento social
- Amplifica reconhecimento

**Estimativa**: 1-2 dias

---

**TOTAL MÉDIA PRIORIDADE**: 6-8 dias úteis

---

## 🔵 BAIXA PRIORIDADE - PODE ESPERAR V2

### Features que podem aguardar feedback do piloto:
- Sugestão inteligente de elogios (baseado em colaborações)
- Milestones/badges automáticos
- Analytics avançado (network graph)
- Análise de sentimento por IA
- Relatórios exportáveis em PDF
- Gamificação avançada (leaderboards)
- Campanhas temáticas
- Integrações Slack/Teams
- Web push notifications
- App mobile

**Justificativa**: Aguardar feedback real de usuários antes de investir nessas features.

---

## 📅 ROADMAP RECOMENDADO

### Cenário: MVP Completo (3-4 semanas)

#### Semana 1 - Admin Essencial
- **Dias 1-4**: Dashboard Admin (visão executiva)
- **Dia 5**: Configuração de Valores

#### Semana 2 - Admin Operacional
- **Dias 1-2**: Configuração da Empresa
- **Dias 3-5**: Gerenciamento de Usuários + CSV Import

#### Semana 3 - Experiência Premium
- **Dias 1-3**: Login Google Workspace (SSO)
- **Dias 4-5**: Onboarding Interativo

#### Semana 4 - Polish & Testes
- **Dias 1-2**: Notificações In-App
- **Dias 3-5**: Testes integrados, correção de bugs, documentação

**Resultado**: MVP completo e polido, pronto para impressionar piloto.

---

## 🎯 CENÁRIOS ALTERNATIVOS

### Cenário 1: MVP Mínimo (2-3 semanas)
**Escopo**: Apenas CRÍTICO (itens 1-4)  
**Tempo**: 9-12 dias úteis  
**Quando usar**: Prazo apertado, piloto super urgente  
**Trade-off**: Funcional mas sem wow factor

### Cenário 2: MVP Recomendado (3-4 semanas) ⭐
**Escopo**: CRÍTICO + ALTA PRIORIDADE (itens 1-7)  
**Tempo**: 15-20 dias úteis  
**Quando usar**: Tempo razoável, quer impressionar piloto  
**Trade-off**: Balanceado - funcional e com diferenciação

### Cenário 3: MVP Completo (4-5 semanas)
**Escopo**: CRÍTICO + ALTA + MÉDIA (itens 1-11)  
**Tempo**: 21-28 dias úteis  
**Quando usar**: Sem urgência, quer produto polido  
**Trade-off**: Produto maduro mas demora mais

---

## ✅ CHECKLIST DE ENTREGA

Antes de apresentar ao piloto, verificar:

### Funcionalidade
- [ ] Admin consegue cadastrar valores da empresa
- [ ] Admin consegue importar lista de usuários (CSV)
- [ ] Admin consegue ver dashboard com métricas
- [ ] Admin consegue configurar domínios e logo
- [ ] Colaborador consegue enviar elogio
- [ ] Colaborador consegue resgatar prêmio
- [ ] SSO com Google funciona (se implementado)
- [ ] Notificações aparecem (se implementado)

### Performance
- [ ] Dashboard carrega em <2 segundos
- [ ] Envio de elogio é instantâneo
- [ ] Sem erros no console do browser
- [ ] Funciona em mobile (responsivo)

### Documentação
- [ ] README com instruções de setup
- [ ] Manual do admin (como configurar valores, importar usuários)
- [ ] FAQ básico para colaboradores
- [ ] Troubleshooting comum

### Dados de Exemplo
- [ ] Empresa demo configurada
- [ ] 5-10 usuários demo
- [ ] 3-5 valores da empresa cadastrados
- [ ] 10-20 elogios de exemplo no feed
- [ ] 5-10 prêmios no catálogo

---

## 🚀 APÓS O MVP

### Feedback do Piloto
Durante 60-90 dias de piloto, coletar:
- Métricas de uso (elogios/semana, % ativos)
- Feedback qualitativo (entrevistas com RH e usuários)
- Bugs e fricções identificadas
- Features mais solicitadas

### V2 - Pós-Piloto
Baseado no feedback, priorizar:
- Features de média prioridade que usuários pediram
- Integrações que empresa precisa
- Melhorias de UX identificadas
- Analytics mais avançado se RH pedir

---

## 📊 MÉTRICAS DE SUCESSO DO PILOTO

Para validar o MVP, acompanhar:

### Adoção
- ✅ **Target**: 60%+ usuários ativos semanalmente
- ✅ **Target**: 80%+ completam onboarding

### Engajamento
- ✅ **Target**: 5+ elogios por usuário por mês
- ✅ **Target**: 2-3 elogios por usuário por semana

### Satisfação
- ✅ **Target**: NPS > 40
- ✅ **Target**: 0 bugs críticos reportados

### Retenção
- ✅ **Target**: 70%+ voltam após primeira semana
- ✅ **Target**: Empresa renova após piloto

---

**Última Atualização**: Outubro 2025  
**Versão**: 1.0 - Roadmap do MVP  
**Próximo Marco**: Implementar features críticas em 2-3 semanas
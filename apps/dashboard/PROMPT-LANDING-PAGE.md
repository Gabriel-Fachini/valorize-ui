# 🎨 Prompt Detalhado: Landing Page Valorize

**Data:** 21 de novembro de 2025
**Versão:** 1.0
**Objetivo:** Landing page B2B para captação de leads e apresentação institucional
**Público-alvo:** Gestores de RH, CEOs e líderes de empresas

---

## 📊 Resumo Executivo

### O Produto
**Valorize** é uma plataforma de reconhecimento profissional que transforma a cultura organizacional através de gamificação. Colaboradores enviam elogios uns aos outros, acumulam moedas virtuais e trocam por vouchers de gift cards reais (Amazon, iFood, etc.). O sistema inclui badges de conquista, leaderboards semanais e métricas de engajamento cultural - tudo isso com gestão financeira simplificada via PIX.

### Diferenciais Competitivos
1. **Gamificação inovadora** - Primeiro sistema que gamifica cultura empresarial de forma mensurável
2. **Simplicidade radical** - Setup em minutos, gestão via PIX, sem complexidade
3. **Vouchers sem custo adicional** - Acesso direto a gift cards sem taxas escondidas
4. **Resultados tangíveis** - Dashboard com analytics de engajamento e saúde cultural
5. **ROI comprovado** - Aumento de engajamento e retenção de talentos

### Objetivos da Landing Page
- **Primary:** Gerar leads qualificados (agendamento de demonstração)
- **Secondary:** Educar o mercado sobre gamificação de cultura
- **Tertiary:** Posicionar Valorize como categoria leader

---

## 🎨 Identidade Visual

### Paleta de Cores

#### Cores Primárias
```css
/* Verde Valorize - Cor Principal */
Primary Green: #00D959
  - 50:  #E5FFF0  (backgrounds suaves)
  - 100: #CCFFE1  (hover states)
  - 500: #00D959  (CTAs, ícones principais)
  - 600: #00AD47  (hover CTAs)
  - 700: #008235  (textos enfáticos)

/* Rosa/Vermelho - Cor Secundária (usar com parcimônia) */
Secondary Pink: #D9004F
  - 50:  #FFE5EF  (destaques suaves)
  - 500: #D9004F  (badges, elementos de destaque)
  - 600: #AD003F  (hover)
```

#### Cores de Suporte (Gamificação)
```css
/* Purple-Indigo - Sistema de Badges */
Purple Gradient: from-purple-600 to-indigo-600
  - Usar em cards de badges
  - Efeitos de glassmorphism
  - Moedas de elogio

/* Emerald-Teal - Recompensas */
Emerald Gradient: from-emerald-600 to-teal-600
  - Usar em seção de vouchers
  - Valores monetários resgatáveis
  - Gráficos de ROI

/* Neutral Gray - Backgrounds e Textos */
Gray Scale:
  - 50:  #FAFAFA (backgrounds light)
  - 100: #F5F5F5 (cards)
  - 500: #737373 (textos secundários)
  - 800: #262626 (textos principais)
  - 950: #0A0A0A (dark mode)
```

### Tipografia
```css
Font Family: 'Inter', system-ui, -apple-system, sans-serif

/* Hierarquia */
H1 (Hero):
  - Desktop: 64px / Bold / -2% letter-spacing
  - Mobile: 40px / Bold / -1% letter-spacing

H2 (Section Titles):
  - Desktop: 48px / Semibold / -1% letter-spacing
  - Mobile: 32px / Semibold

H3 (Subsections):
  - Desktop: 32px / Semibold
  - Mobile: 24px / Semibold

Body Large: 20px / Regular / 150% line-height
Body Regular: 16px / Regular / 160% line-height
Body Small: 14px / Regular / 150% line-height

CTA Buttons: 16px / Semibold / uppercase tracking-wide
```

### Efeitos Visuais (Design Tokens Existentes)

```css
/* Glassmorphism */
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

/* Gradientes de Fundo */
.gradient-primary {
  background: linear-gradient(135deg, #00D959 0%, #00AD47 100%);
}

.gradient-gamification {
  background: linear-gradient(135deg, #9333EA 0%, #4F46E5 100%);
}

/* Sombras Elevadas */
.shadow-elevated {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1),
              0 8px 24px rgba(0, 0, 0, 0.05);
}

/* Animações */
.animate-gentle {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## ✍️ Tom de Voz & Copywriting

### Princípios de Escrita

1. **Moderno mas profissional** - Evitar jargões corporativos pesados, preferir linguagem clara e direta
2. **Orientado a resultados** - Sempre conectar features com benefícios business
3. **Humano e empático** - Reconhecer dores reais de RH (engajamento, turnover, cultura)
4. **Data-driven** - Usar números, estatísticas e métricas quando possível
5. **Acionável** - CTAs claros e sem friction

### Exemplos de Copy (Inspiração)

#### ❌ Evitar (muito corporativo)
"Maximize a sinergia organizacional através de nossa solução enterprise de people analytics"

#### ✅ Preferir (moderno + profissional)
"Transforme reconhecimento em resultados. Cultura forte, time engajado, negócio crescendo."

### Keywords SEO (Inserir naturalmente)
- Reconhecimento profissional
- Gamificação empresarial
- Cultura organizacional
- Engajamento de colaboradores
- RH digital
- People analytics
- Retenção de talentos
- Motivação de equipe

---

## 🏗️ Estrutura da Landing Page

---

## SEÇÃO 1: 🎯 HERO (Above the Fold)

### Objetivo
Causar impacto imediato, comunicar proposta de valor em 3 segundos, capturar atenção com elemento interativo.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Logo Valorize]                    [Produto] [Preços]  │
│                                     [Contato] [Agendar] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [60% Texto]              [40% Elemento 3D/Interativo] │
│                                                         │
│  Headline (H1)                     ╔════════════════╗  │
│  Subheadline                       ║   ELEMENTO     ║  │
│  CTAs                              ║   INTERATIVO   ║  │
│  Social Proof                      ║   3D/VISUAL    ║  │
│                                    ╚════════════════╝  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Conteúdo

#### Headline (H1)
**Opção 1 (Direto):**
"Transforme elogios em cultura. Cultura em resultados."

**Opção 2 (Provocativo):**
"E se reconhecer seu time fosse tão fácil quanto enviar um emoji?"

**Opção 3 (Benefício claro):**
"Aumente o engajamento em 40%. Com gamificação que funciona."

#### Subheadline (Body Large - 20px)
"Valorize é a plataforma de reconhecimento que transforma sua cultura organizacional. Colaboradores trocam elogios por recompensas reais. Você acompanha tudo com métricas que importam."

#### CTAs (Dois botões lado a lado)
```html
[Agendar Demonstração] ← Primary (Verde #00D959)
[Ver como funciona]    ← Secondary (Outline)
```

#### Social Proof (Abaixo dos CTAs)
```
⭐⭐⭐⭐⭐ 4.9/5  •  +15 empresas  •  +2.000 colaboradores engajados
```

---

### 🎨 ELEMENTO INTERATIVO HERO (Escolha uma opção)

#### OPÇÃO A: **3D Coin Animation** (Preferível - Impacto Visual Alto)

**Conceito:**
Uma moeda 3D girando suavemente, com partículas flutuantes ao redor. Quando o usuário passa o mouse, a moeda acelera e emite um "brilho" de conquista. No mobile, animação automática.

**Stack Técnico:**
- Three.js + React Three Fiber
- Partículas: drei/ParticleSystem
- Iluminação: ambiente suave + spotlight verde (#00D959)

**Detalhes Visuais:**
```
Moeda 3D:
  - Material: Metallic gold com reflexo verde
  - Rotação: Y-axis, 360° em 8s (loop)
  - Borda: Gravação "VALORIZE" em relevo
  - Frente: Ícone de estrela ⭐
  - Verso: Símbolo de cifra R$

Partículas:
  - 50-80 partículas pequenas
  - Cores: #00D959, #00AD47, #FFD700 (dourado)
  - Movimento: Orbital suave, velocidade aleatória
  - Opacidade: 0.4-0.8 (variável)

Interação:
  - Hover: Moeda para rotação, emite "pulse" verde
  - Click: Moeda dá um "flip" completo 360° no eixo X
  - Mobile: Auto-rotação contínua
```

**Fallback:**
Se Three.js não carregar, exibir SVG animado (Lottie) da moeda girando.

---

#### OPÇÃO B: **Interactive Badge Showcase** (Foco em Gamificação)

**Conceito:**
Grid 3x3 de badges (conquistas) com efeito de glassmorphism. Badges "desbloqueiam" em sequência quando página carrega (animação de entrada). Ao passar mouse, badge cresce e mostra tooltip com descrição.

**Layout:**
```
┌─────┬─────┬─────┐
│ 🎯  │ 🌟  │ 🏆  │  ← Tier 1 (Milestones)
├─────┼─────┼─────┤
│ 💬  │ 🤝  │ 🔥  │  ← Tier 2 (Social)
├─────┼─────┼─────┤
│ 📈  │ ⏰  │ 👑  │  ← Tier 3 (Consistência)
└─────┴─────┴─────┘
```

**Animação de Entrada:**
```javascript
Badges aparecem em sequência:
  - Delay incremental: 0.1s entre cada
  - Efeito: scale(0) → scale(1) + fade-in
  - Com "shine" effect (gradiente diagonal passando)
  - Som opcional: "unlock" sutil (pode ser mutado)
```

**Hover State:**
```css
Badge hover:
  - Scale: 1.0 → 1.15
  - Sombra: elevada com glow colorido
  - Tooltip aparece acima
  - Rotação sutil: -2deg no eixo Z
```

**Tooltip Content Exemplo:**
```
🏆 Primeiro Resgate
"Realize sua primeira troca de moedas por gift card"
Recompensa: +30 moedas
```

---

#### OPÇÃO C: **Animated Dashboard Preview** (Data-Driven)

**Conceito:**
Mockup de um dashboard em perspectiva 3D (isométrica), mostrando gráficos animados de engajamento cultural subindo em tempo real. Números incrementam, barras crescem, partículas de "elogio" flutuam entre avatares de usuários.

**Elementos Visuais:**
```
Dashboard Isométrico:
  ┌─────────────────────────────┐
  │  📊 Engajamento: 89% ↑     │
  │  ▓▓▓▓▓▓▓▓▓░ (barra verde)  │
  │                             │
  │  💬 Elogios hoje: 127      │
  │  (número incrementa loop)   │
  │                             │
  │  🏆 Top 5 Elogiadores       │
  │  1. João (12)   👑          │
  │  2. Maria (10)  💎          │
  │  3. Pedro (9)   ✨          │
  └─────────────────────────────┘

Animações:
  - Números contam de 0 → valor final
  - Barras crescem suavemente
  - Avatares "pulsam" ao enviar elogio
  - Partículas estrela flutuam para cima
```

**Tecnologia:**
- CSS 3D Transforms para perspectiva
- GSAP para animações de números
- SVG animado para gráficos

---

### RECOMENDAÇÃO FINAL HERO:
**Opção A (3D Coin)** - Impacto visual imediato, conecta com proposta de valor (moedas/recompensas), tecnicamente viável, performance otimizada. É memorável e diferenciado.

---

## SEÇÃO 2: 📊 SOCIAL PROOF / LOGO STRIP

### Objetivo
Criar confiança imediata mostrando empresas que confiam no Valorize.

### Layout
```
Background: Sutil gradiente gray-50
┌────────────────────────────────────────────┐
│  "Empresas que transformam cultura com     │
│   Valorize"                                │
│                                            │
│  [Logo 1]  [Logo 2]  [Logo 3]  [Logo 4]   │
│  (grayscale com hover colorido)           │
└────────────────────────────────────────────┘
```

### Design
- Logos em grayscale (opacity: 0.6)
- Hover: opacity 1.0 + colorido
- Se não há logos: usar estatísticas
  - "+15 empresas" / "+2k usuários" / "89% satisfação"

---

## SEÇÃO 3: 💡 PROBLEMA → SOLUÇÃO

### Objetivo
Criar empatia mostrando dores reais de RH e posicionar Valorize como solução.

### Layout (3 Colunas)
```
┌──────────────┬──────────────┬──────────────┐
│   ❌ DOR 1   │   ❌ DOR 2   │   ❌ DOR 3   │
│              │              │              │
│ Colaboradores│ Cultura      │ ROI de RH    │
│ desengajados │ invisível    │ difícil de   │
│              │              │ medir        │
└──────────────┴──────────────┴──────────────┘
        ↓ Transição visual ↓
┌──────────────┬──────────────┬──────────────┐
│   ✅ FIX 1   │   ✅ FIX 2   │   ✅ FIX 3   │
│              │              │              │
│ Gamificação  │ Dashboard de │ Métricas em  │
│ que engaja   │ cultura      │ tempo real   │
└──────────────┴──────────────┴──────────────┘
```

### Copy Sugerido

**DOR 1:**
"60% dos colaboradores se sentem invisíveis no trabalho. Reconhecimento é raro, genérico ou tardio."

**SOLUÇÃO 1:**
"Com Valorize, qualquer pessoa pode reconhecer qualquer pessoa. Em segundos. Com valor real."

**DOR 2:**
"Cultura organizacional é abstrata. Líderes não conseguem medir ou gerenciar algo invisível."

**SOLUÇÃO 2:**
"Transforme cultura em dados. Veja quem reconhece quem, quais valores são mais celebrados, onde há gaps."

**DOR 3:**
"Programas de RH custam caro mas não provam ROI. Orçamento sempre em risco."

**SOLUÇÃO 3:**
"Valorize mostra números que importam: engajamento +40%, turnover -25%, NPS interno +30 pontos."

---

## SEÇÃO 4: 🎮 COMO FUNCIONA (Passo a Passo)

### Objetivo
Simplificar o conceito, mostrar que é fácil de usar e implementar.

### Layout (4 Steps Horizontal com Animação)
```
Background: Gradiente suave purple-to-indigo (10% opacity)

Step 1          Step 2          Step 3          Step 4
───●────────────●────────────────●────────────────●────
   │            │                │                │
   ▼            ▼                ▼                ▼
[Ícone]     [Ícone]         [Ícone]         [Ícone]
Elogie      Ganhe Moedas     Troque         Acompanhe
Colegas     Virtuais      Recompensas      Resultados
```

### Conteúdo Detalhado

**STEP 1: Elogie Colegas**
```
Ícone: 💬 (em círculo verde)
Título: "Envie reconhecimento autêntico"
Descrição: "Qualquer colaborador pode elogiar outro em segundos.
           Escolha um valor da empresa (Comunicação, Inovação, etc)
           e envie moedas junto com uma mensagem pessoal."
Visual: Screenshot do card de enviar elogio
```

**STEP 2: Ganhe Moedas**
```
Ícone: 🪙 (moeda brilhante)
Título: "Acumule moedas de duas formas"
Descrição: "Receba moedas ao ser elogiado por colegas.
           Ganhe bônus ao desbloquear badges (conquistas).
           Quanto mais você participa, mais você acumula."
Visual: Animated counter de moedas aumentando
```

**STEP 3: Troque por Recompensas**
```
Ícone: 🎁 (caixa de presente)
Título: "Resgate gift cards reais"
Descrição: "Amazon, iFood, Uber, Magazine Luiza e muito mais.
           Sem taxas escondidas. Sem burocracia.
           Em até 2h após aprovação."
Visual: Grid de logos de vouchers disponíveis
```

**STEP 4: Acompanhe Resultados**
```
Ícone: 📈 (gráfico crescente)
Título: "Gestores veem o que importa"
Descrição: "Dashboard completo com analytics de cultura:
           Quem está engajado, quais valores são celebrados,
           tendências ao longo do tempo."
Visual: Mini dashboard mockup animado
```

### Animação de Scroll
- Steps aparecem conforme usuário scrolla
- Linha conectora "desenha" progressivamente
- Icons fazem "bounce" ao aparecer

---

## SEÇÃO 5: 🏆 GAMIFICAÇÃO (Diferencial Único)

### Objetivo
Mostrar que gamificação não é "feature", é o core do produto. Destacar badges, leaderboards e mecânicas viciantes.

### Layout
```
┌────────────────────────────────────────────────┐
│  Título (H2): "Gamificação que Funciona"       │
│  Subtitle: "Não é só diversão. É estratégia."  │
├────────────────────────────────────────────────┤
│  [50% Card Interativo]  [50% Lista Features]  │
└────────────────────────────────────────────────┘
```

### Card Interativo: Badge Showcase

**Design:**
```
┌─────────────────────────────────┐
│  CONQUISTAS DESBLOQUEÁVEIS      │
│                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │ 🎯  │  │ 🌟  │  │ 🏆  │    │ ← 3 badges em destaque
│  │ 50₼ │  │100₼ │  │200₼ │    │   (mostrar recompensa)
│  └─────┘  └─────┘  └─────┘    │
│                                 │
│  Progresso: ▓▓▓▓▓░░░ 5/9       │
│                                 │
│  [Ver todos os badges →]       │
└─────────────────────────────────┘
```

**Interação:**
- Hover em badge: mostra tooltip com critério
- Badges já "desbloqueados" tem brilho dourado
- Bloqueados ficam em grayscale

### Lista de Features (Lado Direito)

```
✓ 9 tipos de badges
  "Desde primeiro elogio até milésimo reconhecimento"

✓ Leaderboard semanal
  "Top 5 mais generosos. Reset toda segunda-feira."

✓ Recompensas progressivas
  "Quanto mais engaja, mais moedas bônus recebe"

✓ Visibilidade pública
  "Badges aparecem no perfil. Gere status e reconhecimento social."
```

### CTA Section
```
"Gamificação aumenta engajamento em até 3x.
 Veja como funciona na prática."

[Agendar Demo]
```

---

## SEÇÃO 6: 💳 VOUCHERS (Recompensas Reais)

### Objetivo
Provar que não é "moedinha virtual sem valor". São recompensas tangíveis, desejadas, sem custo adicional.

### Layout
```
Background: Gradiente emerald-to-teal (suave)

┌──────────────────────────────────────────────┐
│  Título: "Gift Cards que as Pessoas Querem"  │
│  Subtitle: "Sem taxas. Sem fricção."         │
├──────────────────────────────────────────────┤
│                                              │
│  [Grid de Logos de Vouchers - 3x3]          │
│  Amazon  |  iFood   | Uber                  │
│  Magazine| Netflix  | Rappi                 │
│  Google  | Spotify  | Americanas            │
│                                              │
├──────────────────────────────────────────────┤
│  "Acesso a +50 opções de gift cards"        │
│  "Valores de R$ 10 a R$ 500"                │
│  "Entrega em até 2 horas"                   │
└──────────────────────────────────────────────┘
```

### Design dos Cards de Voucher
```css
Card:
  - Background: White glass effect
  - Border: 1px solid rgba(255,255,255,0.3)
  - Padding: 24px
  - Border-radius: 16px
  - Shadow: elevated
  - Hover: lift + glow

Logo:
  - Tamanho: 80x80px
  - Filter: drop-shadow para destacar
  - Hover: scale(1.05)
```

### Callout Box (Abaixo do Grid)
```
┌────────────────────────────────────┐
│ 💰 Sem taxas ocultas               │
│ "Empresa paga valor de face.       │
│  Colaborador recebe valor integral"│
│                                    │
│ ⚡ Processamento rápido            │
│ "Em até 2h após aprovação"         │
│                                    │
│ 🔒 100% seguro                     │
│ "Vouchers válidos diretamente      │
│  dos parceiros oficiais"           │
└────────────────────────────────────┘
```

---

## SEÇÃO 7: 📊 MÉTRICAS & ANALYTICS (Para Gestores)

### Objetivo
Falar diretamente com decisores (C-level, RH). Mostrar que há dados acionáveis, não apenas "feel good vibes".

### Layout (Dashboard Mockup + Métricas)

```
┌───────────────────────────────────────────────┐
│  [40% Texto]         [60% Dashboard Preview]  │
│                                               │
│  H2: "Dados que                               │
│      Direcionam Decisões"                     │
│                                               │
│  Body:                      ╔═══════════════╗│
│  "Valorize transforma       ║   DASHBOARD   ║│
│   cultura em números.       ║   ANALYTICS   ║│
│   Acompanhe em tempo        ║   MOCKUP      ║│
│   real o pulso da           ║   (Screenshot)║│
│   sua empresa."             ╚═══════════════╝│
│                                               │
│  [4 Métricas Cards Below]                    │
└───────────────────────────────────────────────┘
```

### 4 Métricas Cards (2x2 Grid)

**Card 1: Engajamento**
```
┌──────────────────┐
│   📈 89%         │
│   Engajamento    │
│   Ativo Semanal  │
│                  │
│   +23% vs mês    │
│   anterior       │
└──────────────────┘
```

**Card 2: Elogios Enviados**
```
┌──────────────────┐
│   💬 1.247       │
│   Elogios        │
│   Este Mês       │
│                  │
│   Média: 41/dia  │
└──────────────────┘
```

**Card 3: Valores Celebrados**
```
┌──────────────────┐
│   ⭐ Top 3       │
│   1. Colaboração │
│   2. Inovação    │
│   3. Excelência  │
└──────────────────┘
```

**Card 4: NPS Interno**
```
┌──────────────────┐
│   ❤️ +42 pts     │
│   NPS Interno    │
│   (Muito Alto)   │
│                  │
│   85% promoters  │
└──────────────────┘
```

### Copy Apoio
"Gestores de RH economizam 5h/semana com automação de reconhecimento.
Líderes tomam decisões baseadas em dados reais de cultura.
CEOs comprovam ROI de investimentos em pessoas."

---

## SEÇÃO 8: 💼 CASOS DE USO (Por Departamento)

### Objetivo
Mostrar versatilidade - Valorize funciona para qualquer área da empresa.

### Layout (Tabs Interativas)

```
┌────────────────────────────────────────────┐
│  [RH]  [Vendas]  [Tech]  [Operações]      │ ← Tabs
├────────────────────────────────────────────┤
│                                            │
│  Conteúdo dinâmico baseado na tab ativa   │
│  (Ícone + Headline + Descrição + Visual)  │
│                                            │
└────────────────────────────────────────────┘
```

### Conteúdo de Cada Tab

**TAB: RH**
```
Ícone: 👥
Headline: "Escale reconhecimento sem contratar mais gente"
Descrição:
  - Automatize programas de R&R (Recognition & Rewards)
  - Reduza turnover com cultura mensurável
  - Dashboard pronto para apresentar ao board

Visual: Screenshot de dashboard de RH
```

**TAB: Vendas**
```
Ícone: 📊
Headline: "Celebre metas batidas em tempo real"
Descrição:
  - Equipe reconhece fechamentos imediatamente
  - Leaderboard semanal cria competição saudável
  - Recompense top performers com gift cards

Visual: Leaderboard de vendas mockup
```

**TAB: Tech/Produto**
```
Ícone: 💻
Headline: "Cultura de feedback contínuo"
Descrição:
  - Code reviews viram reconhecimento público
  - Badges para deploys sem bugs, mentoria, etc
  - Retenção de talentos tech (mercado competitivo)

Visual: Badge "Bug Hunter" ou "Code Mentor"
```

**TAB: Operações**
```
Ícone: ⚙️
Headline: "Valorize quem mantém a operação rodando"
Descrição:
  - Linha de frente raramente recebe reconhecimento
  - Elogios peer-to-peer criam senso de time
  - Métricas de moral operacional em tempo real

Visual: Feed de elogios entre equipe operacional
```

---

## SEÇÃO 9: 💰 PRICING (Transparente e Simples)

### Objetivo
Mostrar clareza de preços, sem esconder nada. Dois planos simples. CTA forte.

### Layout (2 Cards Lado a Lado)

```
Background: Sutil pattern de moedas (opacity 5%)

┌──────────────────────────────────────────────┐
│  H2: "Planos Transparentes"                  │
│  Subtitle: "Sem taxas escondidas. Sem surpresas." │
├──────────────────────────────────────────────┤
│                                              │
│  [Card Padrão]         [Card Profissional]  │
│                                              │
└──────────────────────────────────────────────┘
```

### Card Padrão

```
┌─────────────────────────────┐
│  PADRÃO                     │
│                             │
│  R$ 14                      │
│  /usuário/mês               │
│                             │
│  ✓ Envio ilimitado elogios │
│  ✓ Sistema de badges       │
│  ✓ Leaderboard semanal     │
│  ✓ Vouchers gift card      │
│  ✓ Dashboard básico        │
│  ✓ Suporte por email       │
│                             │
│  [Agendar Demo]            │
│  (botão outline)           │
└─────────────────────────────┘
```

### Card Profissional (Destacado)

```
┌─────────────────────────────┐
│  PROFISSIONAL  👑 POPULAR   │ ← Badge "Popular"
│                             │
│  R$ 18                      │
│  /usuário/mês               │
│                             │
│  ✓ Tudo do Padrão, mais:   │
│  ✓ Analytics avançados     │
│  ✓ Relatórios customizados │
│  ✓ API para integrações    │
│  ✓ Badges customizáveis    │
│  ✓ Onboarding dedicado     │
│  ✓ Suporte prioritário     │
│                             │
│  [Falar com Vendas]        │
│  (botão verde primário)    │
└─────────────────────────────┘
```

### Footer de Pricing

```
Callout:
"💳 Pagamento via PIX ou boleto.
 📊 Mínimo de 20 usuários.
 📈 Desconto progressivo para +100 usuários."

Link: [Ver FAQ sobre Pricing →]
```

---

## SEÇÃO 10: ❓ FAQ (Perguntas Frequentes)

### Objetivo
Antecipar objeções, reduzir fricção no processo de venda, educar sobre detalhes.

### Layout (Accordion Expansível)

```
┌────────────────────────────────────────┐
│  H2: "Perguntas Frequentes"            │
├────────────────────────────────────────┤
│                                        │
│  ▼ Como funciona o sistema de moedas? │
│  ─────────────────────────────────────│
│     [Resposta expandida]              │
│                                        │
│  › Quanto tempo leva para implementar?│
│                                        │
│  › Posso customizar os valores?       │
│                                        │
│  › Como são entregues os vouchers?    │
│                                        │
│  [+6 perguntas...]                    │
│                                        │
└────────────────────────────────────────┘
```

### Perguntas & Respostas Sugeridas

**Q1: Como funciona o sistema de moedas?**
```
A: Cada empresa recebe um saldo de moedas virtuais (proporcional ao número de
   colaboradores). Esse saldo é distribuído semanalmente para os usuários.
   Eles usam moedas para elogiar colegas. Quem recebe elogio acumula moedas
   resgatáveis por gift cards. A empresa controla o budget mensalmente.
```

**Q2: Quanto tempo leva para implementar?**
```
A: Setup técnico: 15 minutos.
   Onboarding de usuários: 1 semana (enviamos materiais prontos).
   Primeiros resultados: 2 semanas.

   Processo:
   1. Cadastro da empresa
   2. Upload de lista de colaboradores (CSV ou integração SSO)
   3. Customização de valores da empresa
   4. Comunicação interna (templates inclusos)
   5. Go-live!
```

**Q3: Posso customizar os valores da empresa?**
```
A: Sim! No plano Profissional você pode:
   - Criar seus próprios valores (ex: "Cliente em 1º lugar", "Ownership")
   - Definir ícones e cores personalizadas
   - Criar badges exclusivos para conquistas específicas da empresa
```

**Q4: Como são entregues os vouchers?**
```
A: Colaborador solicita resgate → Gestor aprova (ou auto-aprovação se
   configurado) → Voucher enviado por email em até 2h. É um código válido
   diretamente do parceiro (Amazon, iFood, etc). Sem intermediários.
```

**Q5: Há custo adicional nos vouchers?**
```
A: Não. Empresa paga valor de face. Ex: gift card de R$ 50 = R$ 50 debitados
   da carteira da empresa. Sem taxas de conveniência. Sem spread. Transparência
   total.
```

**Q6: Preciso integrar com nosso sistema de RH?**
```
A: Não é obrigatório. Valorize funciona standalone.

   Mas se quiser integrar (Plano Profissional):
   - SSO (Google Workspace, Microsoft AD, Okta)
   - Webhooks para eventos (novo elogio, resgate aprovado)
   - API REST para sincronização de usuários
```

**Q7: E se um colaborador sair da empresa?**
```
A: Moedas não resgatadas expiram após 18 meses. Ao desligar um usuário,
   você pode:

   Opção A: Permitir resgate de saldo acumulado (boa prática)
   Opção B: Bloquear conta imediatamente (moedas voltam para empresa)
```

**Q8: Como funciona o pagamento?**
```
A: Modelo subscription mensal:
   - Cobrança: Todo dia 1º do mês
   - Método: PIX ou boleto (cartão em breve)
   - Base: Número de usuários ativos no mês anterior
   - Mínimo: 20 usuários

   Exemplo: Empresa com 50 usuários no Plano Padrão
   → R$ 14 × 50 = R$ 700/mês
```

**Q9: Vocês têm trial gratuito?**
```
A: Não oferecemos trial self-service. Mas você pode:

   - Agendar uma demo ao vivo (30min) - ver tudo funcionando
   - Receber acesso a ambiente sandbox por 7 dias
   - Fazer POC pago (Proof of Concept) com 1 mês + reembolso se não aprovar

   Nosso modelo é sales-assisted para garantir sucesso na implementação.
```

**Q10: Que tipo de suporte vocês oferecem?**
```
A: Plano Padrão:
   - Email: resposta em até 24h úteis
   - Base de conhecimento online
   - Webinars mensais de boas práticas

   Plano Profissional:
   - Tudo acima +
   - Suporte prioritário (resposta em 4h)
   - Chat in-app
   - CSM (Customer Success Manager) dedicado para +200 usuários
```

---

## SEÇÃO 11: 🎬 DEPOIMENTOS / CASOS DE SUCESSO

### Objetivo
Prova social real. Mostrar resultados tangíveis de clientes atuais.

### Layout (Carrossel de 3 Depoimentos)

```
┌──────────────────────────────────────────────┐
│  H2: "Empresas que Transformaram Cultura"    │
├──────────────────────────────────────────────┤
│                                              │
│  ← [Depoimento 1] [Depoimento 2] [3] →      │
│     (carrossel navegável)                    │
│                                              │
│     ● ○ ○  (dots indicadores)               │
└──────────────────────────────────────────────┘
```

### Template de Depoimento

```
┌────────────────────────────────────────┐
│  [Avatar]  Nome da Pessoa              │
│            Cargo - Empresa             │
│            [Logo da Empresa]           │
│                                        │
│  "Quote impactante do cliente          │
│   destacando benefício específico      │
│   com números se possível."            │
│                                        │
│  Resultado chave:                      │
│  📈 Métrica 1: +XX%                   │
│  ⭐ Métrica 2: +YY pontos             │
│  💰 Métrica 3: -ZZ% turnover          │
│                                        │
│  [Ver caso completo →]                │
└────────────────────────────────────────┘
```

### Exemplo de Conteúdo (Fictício, ajustar com dados reais)

**Depoimento 1:**
```
[Avatar: Foto da Líder de RH]
Maria Silva
Head de Pessoas - TechCorp (250 funcionários)

"Antes do Valorize, nossos programas de reconhecimento eram genéricos
e pouco engajantes. Em 3 meses, vimos 87% da empresa ativamente
elogiando colegas. NPS interno subiu 28 pontos."

Resultados:
📈 Engajamento: +65%
⭐ NPS Interno: +28 pts
💰 Turnover: -18%

[Ler caso completo →]
```

**Depoimento 2:**
```
[Avatar: Foto do CEO]
João Martins
CEO - RetailMax (120 funcionários)

"Gamificação não é futilidade. É estratégia. Valorize nos deu dados
que nunca tivemos: quais líderes criam cultura positiva, quais áreas
precisam de atenção. ROI comprovado em 60 dias."

Resultados:
📊 Visibilidade cultural: 100%
⚡ Setup: 1 semana
💡 Insights acionáveis: Semanais

[Ler caso completo →]
```

**Depoimento 3:**
```
[Avatar: Foto do Líder de Vendas]
Pedro Costa
VP de Vendas - SalesHub (80 funcionários)

"Equipe de vendas é competitiva por natureza. Valorize canalizou
isso de forma saudável. Leaderboard semanal virou ritual. Resgates
de gift cards viraram celebração de metas."

Resultados:
🏆 Participação: 92%
💬 Elogios/semana: 150+
📈 Moral da equipe: +40%

[Ler caso completo →]
```

---

## SEÇÃO 12: 🚀 CTA FINAL (Conversão)

### Objetivo
Último empurrão para conversão. Remover fricção máxima. CTA mega claro.

### Layout (Hero-style CTA Section)

```
Background: Gradiente verde primário (from-primary-500 to-primary-600)

┌────────────────────────────────────────────────┐
│                                                │
│  [Centralizado, texto branco]                 │
│                                                │
│  H2: "Pronto para Transformar sua Cultura?"   │
│                                                │
│  Subtitle:                                     │
│  "Agende uma demo de 30 minutos.              │
│   Veja Valorize funcionando ao vivo.          │
│   Sem compromisso. Sem cartão de crédito."    │
│                                                │
│  [Agendar Demonstração Gratuita]              │
│  (botão branco com texto verde)               │
│                                                │
│  Ou                                            │
│                                                │
│  [Falar com Especialista]                     │
│  (link branco underline)                      │
│                                                │
│  ⚡ Resposta em menos de 2h                   │
│                                                │
└────────────────────────────────────────────────┘
```

### Design do Botão Principal

```css
Button CTA:
  - Background: White
  - Text: Primary Green (#00D959)
  - Font: 18px Semibold
  - Padding: 16px 48px
  - Border-radius: 12px
  - Shadow: 0 8px 24px rgba(0,0,0,0.15)
  - Hover:
      - Scale: 1.05
      - Shadow: 0 12px 32px rgba(0,0,0,0.2)
  - Click: Abre modal de agendamento (Calendly embed)
```

---

## SEÇÃO 13: 📍 FOOTER

### Layout (4 Colunas)

```
Background: Dark Gray (gray-900)
Text: Light Gray (gray-300)

┌──────────────────────────────────────────────┐
│  [Logo Valorize]                             │
│  "Transforme reconhecimento em resultados"   │
│                                              │
├───────────┬──────────┬──────────┬───────────┤
│ PRODUTO   │ EMPRESA  │ RECURSOS │ LEGAL     │
│           │          │          │           │
│ Como      │ Sobre    │ Blog     │ Termos    │
│ Funciona  │ Nós      │ Casos    │ Privaci-  │
│           │          │ de Uso   │ dade      │
│ Pricing   │ Carreira │ FAQ      │ Cookies   │
│           │          │          │           │
│ Features  │ Contato  │ Suporte  │           │
└───────────┴──────────┴──────────┴───────────┘

┌──────────────────────────────────────────────┐
│  [Social Icons]  LinkedIn  Twitter  Instagram│
│                                              │
│  © 2025 Valorize. Todos os direitos reserv. │
│  CNPJ: XX.XXX.XXX/0001-XX                   │
└──────────────────────────────────────────────┘
```

### Links Importantes

**PRODUTO**
- Como Funciona
- Pricing
- Gamificação
- Vouchers
- Integrações

**EMPRESA**
- Sobre Nós
- Carreiras (se aplicável)
- Contato
- Imprensa

**RECURSOS**
- Blog
- Casos de Sucesso
- FAQ
- Central de Ajuda
- API Docs (para plano Pro)

**LEGAL**
- Termos de Uso
- Política de Privacidade
- LGPD
- Política de Cookies

---

## 🎨 ELEMENTOS VISUAIS RECORRENTES

### Ícones & Ilustrações

**Estilo:**
- Linha: 2px de espessura
- Cantos: Arredondados
- Cor: Primary green ou gradiente purple-indigo
- Tamanho padrão: 48x48px (seções), 24x24px (inline)

**Bibliotecas Recomendadas:**
- Lucide Icons (react-lucide)
- Heroicons
- Custom SVG quando necessário

### Ilustrações Customizadas (Se Budget Permitir)

**Cenas para ilustrar:**
1. **Colaboradores trocando elogios** (hero ou seção "Como Funciona")
2. **Dashboard 3D Isométrico** (seção Analytics)
3. **Moedas e badges flutuando** (seção Gamificação)
4. **Gift cards saindo de um celular** (seção Vouchers)

**Estilo:**
- Flat design com sombras suaves
- Paleta: Primary green + purple/indigo + neutros
- Personagens: Diversos (etnia, gênero) para inclusividade

### Patterns de Fundo

**Pattern 1: Dot Grid (Subtle)**
```css
background-image: radial-gradient(
  circle,
  rgba(0, 217, 89, 0.1) 1px,
  transparent 1px
);
background-size: 32px 32px;
```

**Pattern 2: Coin Pattern (Para seção Pricing)**
```css
/* SVG de moedinha repetido com opacity 5% */
Usar como background-image
```

**Pattern 3: Gradient Mesh (Hero Background)**
```css
background:
  radial-gradient(at 20% 30%, rgba(147,51,234,0.15) 0px, transparent 50%),
  radial-gradient(at 80% 70%, rgba(0,217,89,0.15) 0px, transparent 50%),
  #FAFAFA;
```

---

## 📱 RESPONSIVIDADE

### Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Large Desktop: > 1440px
```

### Ajustes Mobile

**Hero:**
- Layout: Stack vertical (100% width)
- Headline: 40px (down from 64px)
- Elemento 3D: Reduzido a 280px height
- CTAs: Full width, stacked

**Como Funciona:**
- Steps: Vertical ao invés de horizontal
- Icons: 40px (down from 48px)

**Pricing:**
- Cards: Stacked vertical
- Destacar "Popular" badge mais proeminente

**FAQ:**
- Accordion com padding reduzido
- Font size: 14px (down from 16px)

**Footer:**
- 1 coluna, links em lista vertical
- Social icons centralizados

---

## ⚡ PERFORMANCE & OTIMIZAÇÕES

### Checklist Técnico

- [ ] Lazy load de imagens (usar `loading="lazy"`)
- [ ] Imagens em formato WebP + fallback PNG
- [ ] Elemento 3D carrega apenas quando visível (Intersection Observer)
- [ ] Fonts com `font-display: swap`
- [ ] Minificar CSS/JS
- [ ] Comprimir imagens (TinyPNG ou equivalente)
- [ ] Prefetch de recursos críticos
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)

### Métricas Alvo

```
Largest Contentful Paint: < 2.5s
First Input Delay: < 100ms
Cumulative Layout Shift: < 0.1
Time to Interactive: < 3.5s
```

---

## 🔍 SEO & META TAGS

### Title Tag
```html
<title>Valorize - Plataforma de Reconhecimento e Gamificação Empresarial | Transforme Cultura em Resultados</title>
```

### Meta Description
```html
<meta name="description" content="Valorize é a plataforma de reconhecimento profissional que transforma cultura organizacional. Gamificação, badges, gift cards reais e analytics de engajamento. A partir de R$ 14/usuário/mês.">
```

### Open Graph (Redes Sociais)
```html
<meta property="og:title" content="Valorize - Gamificação que Transforma Cultura Empresarial">
<meta property="og:description" content="Elogios que viram moedas. Moedas que viram recompensas. Cultura que vira dados. Conheça Valorize.">
<meta property="og:image" content="https://valorize.com.br/og-image.png">
<meta property="og:type" content="website">
```

### Schema Markup (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Valorize",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "14.00",
    "priceCurrency": "BRL"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "87"
  }
}
```

---

## 📝 COPYWRITING: BANCO DE HEADLINES

### Headlines Alternativas (A/B Testing)

**Hero - Versão A (Benefício Direto):**
"Aumente o Engajamento em 40%. Com Reconhecimento que Funciona."

**Hero - Versão B (Provocativo):**
"E se Elogiar seu Time Fosse Tão Simples Quanto Enviar um WhatsApp?"

**Hero - Versão C (Resultado):**
"Transforme Cultura em ROI Mensurável. Gamificação para Empresas Sérias."

**Hero - Versão D (Contraste):**
"Chega de Programas de RH que Ninguém Usa. Conheça o Reconhecimento que Engaja."

### CTAs Variações

**Primário:**
- "Agendar Demonstração Gratuita"
- "Ver Valorize em Ação (Demo 30min)"
- "Quero Transformar Minha Cultura"

**Secundário:**
- "Falar com Especialista"
- "Calcular ROI para Minha Empresa"
- "Baixar Caso de Sucesso (PDF)"

---

## 🧪 TESTES & VALIDAÇÃO

### A/B Tests Sugeridos

**Teste 1: Hero CTA**
- Variante A: "Agendar Demonstração"
- Variante B: "Ver Demo Gravada"
- Métrica: Click-through rate

**Teste 2: Elemento 3D**
- Variante A: 3D Coin Animation
- Variante B: Animated Dashboard
- Métrica: Time on page + scroll depth

**Teste 3: Pricing Display**
- Variante A: Preço mensal destacado
- Variante B: Preço anual (com desconto)
- Métrica: Leads qualificados gerados

**Teste 4: Social Proof Position**
- Variante A: Logo strip após hero
- Variante B: Depoimentos após hero
- Métrica: Bounce rate

### Heatmap & Analytics

**Ferramentas:**
- Google Analytics 4 (eventos customizados)
- Hotjar ou Microsoft Clarity (heatmaps)
- Google Tag Manager (tracking de CTAs)

**Eventos para Trackear:**
```javascript
// Clicks em CTAs principais
gtag('event', 'cta_click', {
  'location': 'hero',
  'button_text': 'Agendar Demonstração'
});

// Scroll depth
gtag('event', 'scroll', {
  'percent_scrolled': 75
});

// Tempo em seção
gtag('event', 'section_view', {
  'section_name': 'pricing',
  'time_spent': 45 // segundos
});

// Interações com elemento 3D
gtag('event', 'interaction', {
  'type': '3d_coin_hover'
});
```

---

## 🎬 PRÓXIMOS PASSOS (Implementação)

### Fase 1: Design (Semana 1-2)
- [ ] Wireframes de todas as seções
- [ ] Design system (componentes reutilizáveis)
- [ ] Mockups high-fidelity (Desktop + Mobile)
- [ ] Prototype interativo (Figma/Framer)
- [ ] Aprovação de stakeholders

### Fase 2: Desenvolvimento (Semana 3-5)
- [ ] Setup do projeto (Next.js + Tailwind recomendado)
- [ ] Implementação de seções (top to bottom)
- [ ] Integração de elemento 3D/interativo
- [ ] Responsividade completa
- [ ] Testes cross-browser

### Fase 3: Conteúdo (Semana 4-5)
- [ ] Copy final de todas as seções
- [ ] Produção/compra de imagens e ilustrações
- [ ] Gravação de demo em vídeo (opcional)
- [ ] Coleta de depoimentos reais (se disponível)
- [ ] Casos de sucesso escritos

### Fase 4: Integrações (Semana 6)
- [ ] Formulário de agendamento (Calendly/HubSpot)
- [ ] Chat (Intercom/Drift - opcional)
- [ ] Analytics (GA4 + Hotjar)
- [ ] Email marketing (Resend/SendGrid)
- [ ] CRM integration (Pipedrive/HubSpot)

### Fase 5: Launch (Semana 7)
- [ ] Testes finais (QA completo)
- [ ] SEO audit
- [ ] Performance optimization
- [ ] DNS setup + deploy
- [ ] Monitoring (Sentry, LogRocket)
- [ ] 🚀 GO LIVE

---

## 📚 REFERÊNCIAS & INSPIRAÇÃO

### Landing Pages Inspiração (Análise Competitiva)

**1. Lattice (lattice.com)**
- O que copiar: Clareza de proposta de valor, uso de métricas reais
- Design: Clean, muitos espaços em branco, CTA verde forte

**2. Culture Amp (cultureamp.com)**
- O que copiar: Seção de "ROI Calculator" interativa
- Copy: Foco em resultados mensuráveis para RH

**3. Bonusly (bonus.ly)**
- O que copiar: Explicação visual de "Como Funciona" com steps animados
- Gamificação: Mostram badges e leaderboards de forma apelativa

**4. Linear (linear.app)**
- O que copiar: Hero com elemento 3D sutil e elegante
- Performance: Animações suaves, load time rápido

**5. Stripe (stripe.com/br)**
- O que copiar: Gradientes sutis, elementos interativos no hero
- Confiança: Social proof bem posicionado

### Bibliotecas & Frameworks Recomendados

**Frontend:**
```
Next.js 14+ (App Router)
TailwindCSS 3.x
Framer Motion (animações)
React Three Fiber (elemento 3D)
Radix UI (componentes acessíveis)
```

**Formulários:**
```
React Hook Form
Zod (validação)
```

**Analytics:**
```
Google Analytics 4
Vercel Analytics
Plausible (alternativa privacy-focused)
```

**Performance:**
```
next/image (otimização automática)
next/font (Google Fonts otimizado)
Sharp (compressão de imagens)
```

---

## ⚠️ AVISOS & GAPS A PREENCHER

### Informações que Você Precisa Fornecer

- [ ] **Logo oficial Valorize** (SVG em branco, verde e colorido)
- [ ] **Screenshots reais do produto** (dashboard, feed de elogios, badges)
- [ ] **Depoimentos reais** (ou aprovar uso de fictícios temporários)
- [ ] **Logos de empresas clientes** (se houver e se autorizadas)
- [ ] **CNPJ e dados legais** (para footer e docs)
- [ ] **Domínio final** (ex: valorize.com.br, app.valorize.io)
- [ ] **Emails de contato** (contato@, vendas@, suporte@)
- [ ] **Links de redes sociais** (LinkedIn, Twitter, Instagram)

### Decisões Pendentes

- [ ] **Elemento 3D Hero:** Confirmar qual opção (A, B ou C)?
- [ ] **Vídeo explicativo:** Vai ter na landing ou só nas demos?
- [ ] **Chat ao vivo:** Integrar desde o início ou apenas formulário?
- [ ] **Blog:** Landing terá link para blog? Já existe conteúdo?
- [ ] **Multi-idioma:** Apenas PT-BR ou também EN/ES?

---

## 🎯 RESUMO EXECUTIVO DO PROMPT

### Para o Designer/Desenvolvedor:

**O que criar:**
Landing page B2B para Valorize, plataforma de reconhecimento profissional gamificado.

**Objetivo:**
Gerar leads qualificados (agendar demos) e educar mercado sobre gamificação de cultura.

**Público:**
Gestores de RH, CEOs, líderes de empresas (20-500 funcionários).

**Tom:**
Moderno, profissional mas descontraído. Data-driven. Focado em resultados.

**Cores:**
Primary Green (#00D959), Secondary Pink (#D9004F), Purple-Indigo (gamificação), Emerald-Teal (recompensas).

**Diferencial visual:**
Elemento interativo no hero (3D coin ou badges animados), glassmorphism, gradientes sutis.

**CTAs principais:**
"Agendar Demonstração Gratuita" e "Falar com Vendas".

**Seções obrigatórias:**
Hero → Social Proof → Problema/Solução → Como Funciona → Gamificação → Vouchers → Analytics → Casos de Uso → Pricing → FAQ → Depoimentos → CTA Final → Footer.

**Pricing:**
R$ 14/usuário/mês (Padrão) | R$ 18/usuário/mês (Profissional).

**Tech stack sugerido:**
Next.js + Tailwind + Framer Motion + React Three Fiber.

---

**Status:** ✅ Prompt finalizado e pronto para implementação
**Próxima ação:** Design de wireframes + mockups high-fidelity

---

_Documento criado em 21/11/2025 por Gabriel Fachini_
_Valorize - Transforme reconhecimento em resultados_ 🚀

# PRD — Quiz Web: "Você Entende o Claude Code?"

## 1. Visão Geral do Produto

**Produto:** Aplicação web de quiz interativo sobre Claude Code, com perguntas no formato Verdadeiro ou Falso.

**Objetivo de negócio:** Criar uma ferramenta educacional e de engajamento que ajude desenvolvedores a aprender e validar seu conhecimento sobre o Claude Code — desde conceitos de negócio (iniciante) até uso avançado da ferramenta e SDK.

**Público-alvo primário:** Desenvolvedores que ainda não usam Claude Code mas têm curiosidade, e devs que já usam e querem testar seu nível de conhecimento.

**Idioma:** Português (PT-BR) — interface e conteúdo.

---

## 2. Problema que Resolve

Claude Code é uma ferramenta com ampla cobertura de funcionalidades (CLI, hooks, MCP, SDK, permissões, modelos, etc.) e muitos desenvolvedores não conhecem todo o seu potencial. Um quiz gamificado:
- Reduz a barreira de entrada para aprender sobre a ferramenta
- Torna o aprendizado passivo em engajamento ativo
- Gera competição saudável via ranking público
- Serve como diagnóstico de conhecimento para times de engenharia

---

## 3. Fluxo Principal do Usuário

```
Tela Inicial
  └─> Usuário informa nickname (obrigatório para ranking)
  └─> Escolhe o nível: [Iniciante] [Intermediário] [Avançado]
      └─> Quiz começa (10 perguntas por sessão, sorteadas do banco)
          └─> Para cada pergunta:
              - Exibe a afirmação
              - Usuário clica [Verdadeiro] ou [Falso]
              - Avança para a próxima (sem feedback imediato)
          └─> Tela de Resultado:
              - Score final (ex: 7/10)
              - Badge de classificação por faixa de acerto
              - Para cada pergunta: afirmação + resposta correta + explicação
              - Botão "Ver Ranking" / "Jogar Novamente"
  └─> Tela de Ranking:
      - Top 10 scores globais por nível
      - Posição do usuário atual destacada
```

---

## 4. Requisitos de Negócio

### 4.1 Níveis de Dificuldade

| Nível | Foco | Perfil das Perguntas |
|---|---|---|
| **Iniciante** | Conceitos de negócio, o que é Claude Code, proposta de valor, instalação, casos de uso gerais | "Claude Code é uma ferramenta de linha de comando" — V/F com explicação simples |
| **Intermediário** | Uso prático: comandos CLI, CLAUDE.md, slash commands, hooks, permissões, MCP | "O arquivo CLAUDE.md é ignorado pelo Claude Code por padrão" — V/F com contexto de uso |
| **Avançado** | SDK, API Anthropic, Agent loops, modelos disponíveis, context management, tool use | "O modelo claude-haiku-4-5 suporta extended thinking" — V/F com explicação técnica |

### 4.2 Banco de Perguntas

- **Total:** 30 a 50 perguntas por nível (banco completo: 90–150 perguntas)
- **Formato:** JSON local versionado no repositório (`/src/data/questions.json`)
- **Por sessão:** 10 perguntas sorteadas aleatoriamente do nível escolhido
- **Estrutura de cada pergunta:**
  ```json
  {
    "id": "adv-001",
    "level": "advanced",
    "statement": "O modelo claude-opus-4-7 é atualmente o mais capaz da família Claude 4.",
    "answer": true,
    "explanation": "Claude Opus 4.7 é o modelo mais capaz da família Claude 4, ideal para tarefas complexas de raciocínio e geração de código.",
    "tags": ["modelos", "api"]
  }
  ```

### 4.3 Sistema de Score e Ranking

- Score baseado em: acertos + velocidade (bônus de tempo por pergunta, opcional v2)
- Ranking separado por nível (Iniciante / Intermediário / Avançado)
- Top 10 exibido publicamente
- Identificação do jogador: nickname (sem autenticação formal no MVP)
- Dados persistidos no Supabase (PostgreSQL)

### 4.4 Classificações por Faixa de Acerto (badges)

| Acertos | Badge | Descrição |
|---|---|---|
| 0–3 | Explorador | "Você ainda está descobrindo o Claude Code" |
| 4–6 | Praticante | "Bom começo! Tem bastante chão pela frente." |
| 7–8 | Especialista | "Você domina bem o Claude Code!" |
| 9–10 | Claude Expert | "Impressionante! Você é um mestre do Claude Code." |

---

## 5. Requisitos Técnicos

### 5.1 Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend Framework | React 18+ | Componentização, ecossistema, estado de quiz |
| Estilização | Tailwind CSS v3 | Utilitário, dark mode nativo, velocidade de desenvolvimento |
| Build Tool | Vite | HMR rápido, configuração mínima |
| Linguagem | TypeScript | Tipagem segura para dados do quiz e Supabase |
| Backend / Banco | Supabase (PostgreSQL) | BaaS com SDK JS, free tier, auth opcional futuramente |
| Hospedagem | Vercel ou Netlify | Deploy automático via Git, CDN global |

### 5.2 Estrutura de Diretórios

```
quiz-claude-code/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx          # Tela inicial: nickname + seleção de nível
│   │   ├── QuizScreen.tsx          # Loop de perguntas
│   │   ├── QuestionCard.tsx        # Afirmação + botões V/F
│   │   ├── ProgressBar.tsx         # Barra de progresso (1 de 10)
│   │   ├── ResultScreen.tsx        # Score + explicações + badge
│   │   ├── QuestionReview.tsx      # Item de revisão por pergunta
│   │   ├── RankingScreen.tsx       # Leaderboard por nível
│   │   └── LevelBadge.tsx          # Badge de nível (visual)
│   ├── data/
│   │   └── questions.json          # Banco de perguntas (todas as 90–150)
│   ├── hooks/
│   │   ├── useQuiz.ts              # Lógica de estado do quiz (shuffling, score)
│   │   └── useRanking.ts           # Fetch e submit de scores no Supabase
│   ├── lib/
│   │   └── supabase.ts             # Cliente Supabase configurado
│   ├── types/
│   │   └── index.ts                # Types: Question, QuizState, Score, Level
│   ├── App.tsx
│   └── main.tsx
├── .env.example                    # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 5.3 Schema do Supabase

```sql
-- Tabela de scores
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  score INTEGER NOT NULL,          -- número de acertos (0-10)
  total INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para ranking
CREATE INDEX idx_scores_level_score ON scores(level, score DESC, created_at ASC);

-- RLS: qualquer um pode inserir e ler (sem auth no MVP)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON scores FOR SELECT USING (true);
CREATE POLICY "public insert" ON scores FOR INSERT WITH CHECK (true);
```

### 5.4 Design System

**Paleta de cores (Anthropic Dark):**
```
Background:    #0F0F0F  (quase preto)
Surface:       #1A1A1A  (cards)
Border:        #2A2A2A
Primary:       #E87040  (laranja Anthropic)
Primary Hover: #F08050
Text:          #F5F5F5
Muted:         #888888
Success:       #4CAF50  (resposta correta)
Error:         #EF5350  (resposta errada)
```

**Tipografia:**
- Fonte: Inter (Google Fonts)
- Tamanhos: Tailwind padrão (text-sm, text-base, text-lg, text-2xl, text-4xl)

**Componentes-chave:**
- `QuestionCard`: card centralizado com afirmação em destaque, dois botões grandes (Verdadeiro / Falso) com ícones ✓ e ✗
- `ProgressBar`: barra fina no topo com percentual de conclusão
- `ResultScreen`: lista acordeão com cada pergunta — verde (acertou) / vermelho (errou) + explicação expandível
- `RankingScreen`: tabela com posição, nickname, nível, score, data

### 5.5 Comportamento do Quiz

- Perguntas sorteadas aleatoriamente via `Fisher-Yates shuffle` no hook `useQuiz`
- Estado do quiz gerenciado localmente (sem persistência de sessão em andamento)
- Timer por pergunta: **opcional para v1**, campo `time_ms` reservado no tipo `Score` para implementação futura
- Acessibilidade: botões com `aria-label`, foco via teclado (tecla `V` = Verdadeiro, `F` = Falso)

---

## 6. Temas de Perguntas por Nível (Guia de Conteúdo)

### Nível Iniciante — Conceitos e Negócio
- O que é Claude Code e quem o fabrica
- Formas de acesso (CLI, desktop app, web, extensões IDE)
- Modelos disponíveis e suas famílias (Opus, Sonnet, Haiku)
- O que Claude Code pode e não pode fazer por padrão
- Conceito de permissões e modos de uso
- Casos de uso: geração de código, debugging, explicação de código
- Custo e modelo de pricing (token-based)
- Diferença entre Claude (chat) e Claude Code (agentic CLI)

### Nível Intermediário — Uso Prático
- Arquivo CLAUDE.md: finalidade, onde colocar, o que documentar
- Slash commands: /help, /clear, /compact, /memory, /review, etc.
- Hooks: eventos disponíveis (PreToolUse, PostToolUse, Stop, etc.), formato de configuração
- Modos de permissão: default, auto-approve, manual
- MCP (Model Context Protocol): o que é, como adicionar um servidor
- Ferramentas built-in: Bash, Read, Write, Edit, Glob, Grep, WebSearch
- Uso do `settings.json` e `settings.local.json`
- Teclas de atalho no terminal interativo

### Nível Avançado — Técnico / API / SDK
- IDs de modelos exatos (claude-sonnet-4-6, claude-opus-4-7, claude-haiku-4-5-20251001)
- Extended thinking: quais modelos suportam, como ativar
- Prompt caching: como funciona, TTL, benefícios de custo
- Claude Agent SDK: como construir agentes customizados
- Tool use / function calling via API
- Batch API: quando usar, limites
- Context window management e compaction
- Modo fast (Opus com output mais rápido)
- Autonômous loop: como o Claude Code itera até concluir uma tarefa
- Worktrees: o que são e como o Claude Code usa git worktrees

---

## 7. MVP vs Futuras Versões

### MVP (v1.0)
- [x] 3 níveis com 10 perguntas por sessão
- [x] Banco de perguntas JSON (mínimo 30 perguntas, idealmente 50+)
- [x] Resultado com score + explicações
- [x] Ranking via Supabase (top 10 por nível)
- [x] Dark mode com identidade visual Anthropic
- [x] Responsivo (mobile + desktop)
- [x] Deploy em Vercel/Netlify

### v2.0 (Backlog)
- [ ] Timer por pergunta com bônus de velocidade no score
- [ ] Modo "treino" com feedback imediato por pergunta
- [ ] Compartilhamento de resultado via link/imagem (OG card)
- [ ] Filtro por tag de assunto (ex: "apenas perguntas sobre MCP")
- [ ] Painel admin para gerenciar perguntas (Supabase Table Editor)
- [ ] Autenticação com histórico de tentativas
- [ ] Modo duelo (2 jogadores em tempo real)

---

## 8. Critérios de Aceitação do MVP

| Critério | Verificação |
|---|---|
| Usuário consegue escolher nível e iniciar quiz | Fluxo funcional sem erros |
| 10 perguntas exibidas por sessão, sorteadas aleatoriamente | Nenhuma pergunta repetida na mesma sessão |
| Respostas computadas corretamente | Score bate com respostas do usuário |
| Tela de resultado mostra explicação para cada pergunta | Todas as 10 perguntas revisadas visíveis |
| Score salvo no Supabase com nickname e nível | Registro aparece no banco após conclusão |
| Ranking exibe top 10 por nível | Dados carregados do Supabase em tempo real |
| Interface responsiva em mobile (320px+) e desktop | Sem overflow, botões clicáveis em touch |
| Performance: LCP < 2s em conexão 4G | Medido via Lighthouse |

---

## 9. Variáveis de Ambiente

```env
# .env.local (não commitar)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 10. Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Type check
npm run typecheck
```

---

## 11. Referências

- [Claude Code Docs](https://docs.anthropic.com/claude-code)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Supabase JS SDK](https://supabase.com/docs/reference/javascript)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

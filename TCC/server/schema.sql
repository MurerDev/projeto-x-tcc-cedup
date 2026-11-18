-- Projeto X — TCC CEDUP 2026
-- Schema PostgreSQL (RNF12: queries SQL diretas via pg)

CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  username      TEXT NOT NULL UNIQUE,          -- unique case-insensitive na aplicação (RF02)
  username_lower TEXT NOT NULL UNIQUE,
  senha_hash    TEXT NOT NULL,                 -- bcrypt (RNF01)
  idade         TEXT,
  cidade        TEXT,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  username_trocado_em TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessoes (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expira_em   TIMESTAMPTZ NOT NULL
);

-- Progresso do questionário (retomar de onde parou)
CREATE TABLE IF NOT EXISTS questionario_progresso (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  idx         INTEGER NOT NULL DEFAULT 0,
  etapa       INTEGER NOT NULL DEFAULT 1,
  respostas   JSONB NOT NULL DEFAULT '{}',     -- { perguntaId: valor }
  finalizado  BOOLEAN NOT NULL DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (usuario_id)
);

-- Resultados (últimas 5 tentativas — RF42)
CREATE TABLE IF NOT EXISTS resultados (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  scores      JSONB NOT NULL,
  prefs       JSONB NOT NULL,
  top_area    TEXT NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Simulados (últimas 5 tentativas — RF38)
CREATE TABLE IF NOT EXISTS simulados (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo      TEXT NOT NULL,
  acertos     INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  pct         INTEGER NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LGPD: trilha de acesso/operação (privacidade e auditoria)
CREATE TABLE IF NOT EXISTS auditoria (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  acao        TEXT NOT NULL,
  detalhe     JSONB,
  ip          TEXT,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resultados_usuario ON resultados(usuario_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_simulados_usuario ON simulados(usuario_id, criado_em DESC);

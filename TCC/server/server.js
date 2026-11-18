/* Projeto X — TCC CEDUP 2026
 * Backend Express + PostgreSQL (pg). Sem DATABASE_URL, usa arquivo local data.json
 * para permitir demonstração no localhost sem instalar banco.
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'projeto-x-tcc-dev-secret';
const DATABASE_URL = process.env.DATABASE_URL || '';
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Frontend estático (pasta TCC) na mesma origem da API
app.use(express.static(path.join(__dirname, '..')));

/* ---------------- Camada de dados ---------------- */
let pgPool = null;
if (DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({ connectionString: DATABASE_URL });
    console.log('[db] PostgreSQL conectado');
  } catch (e) { console.warn('[db] pg não disponível, usando arquivo:', e.message); pgPool = null; }
}

function loadFile() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return { usuarios: [], sessoes: [], progresso: {}, resultados: [], simulados: [], auditoria: [], seq: 1 }; }
}
function saveFile(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

const db = {
  async query(sql, params) {
    if (pgPool) return pgPool.query(sql, params);
    throw new Error('Sem PostgreSQL configurado');
  },
  // Abaixo: API única usada pelas rotas, com implementação dupla
  async cadastrar({ nome, username, usernameLower, senhaHash, idade, cidade }) {
    if (pgPool) {
      const r = await pgPool.query(
        `INSERT INTO usuarios (nome, username, username_lower, senha_hash, idade, cidade)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, nome, username, username_lower, idade, cidade, criado_em`,
        [nome, username, usernameLower, senhaHash, idade || null, cidade || null]);
      return r.rows[0];
    }
    const d = loadFile();
    if (d.usuarios.some(u => u.username_lower === usernameLower)) { const e = new Error('username em uso'); e.code = 'DUP'; throw e; }
    const u = { id: d.seq++, nome, username, username_lower: usernameLower, senha_hash: senhaHash, idade: idade || '', cidade: cidade || '', criado_em: new Date().toISOString(), username_trocado_em: null };
    d.usuarios.push(u); saveFile(d); return u;
  },
  async buscarUsername(usernameLower) {
    if (pgPool) { const r = await pgPool.query('SELECT * FROM usuarios WHERE username_lower=$1', [usernameLower]); return r.rows[0] || null; }
    const d = loadFile(); return d.usuarios.find(u => u.username_lower === usernameLower) || null;
  },
  async buscarId(id) {
    if (pgPool) { const r = await pgPool.query('SELECT * FROM usuarios WHERE id=$1', [id]); return r.rows[0] || null; }
    const d = loadFile(); return d.usuarios.find(u => u.id === id) || null;
  },
  async criarSessao(usuarioId) {
    const token = jwt.sign({ sub: usuarioId }, JWT_SECRET, { expiresIn: '7d' });
    const expira = new Date(Date.now() + 7 * 864e5).toISOString();
    if (pgPool) { await pgPool.query('INSERT INTO sessoes (usuario_id, token, expira_em) VALUES ($1,$2,$3)', [usuarioId, token, expira]); return { token, expira_em: expira }; }
    const d = loadFile(); d.sessoes.push({ usuario_id: usuarioId, token, expira_em: expira }); saveFile(d); return { token, expira_em: expira };
  },
  async validarSessao(token) {
    if (!token) return null;
    if (pgPool) { const r = await pgPool.query('SELECT * FROM sessoes WHERE token=$1 AND expira_em > now()', [token]); return r.rows[0] || null; }
    const d = loadFile(); return d.sessoes.find(s => s.token === token && new Date(s.expira_em) > new Date()) || null;
  },
  async apagarSessao(token) {
    if (pgPool) { await pgPool.query('DELETE FROM sessoes WHERE token=$1', [token]); return; }
    const d = loadFile(); d.sessoes = d.sessoes.filter(s => s.token !== token); saveFile(d);
  },
  async salvarProgresso(usuarioId, idx, etapa, respostas, finalizado) {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO questionario_progresso (usuario_id, idx, etapa, respostas, finalizado, atualizado_em)
         VALUES ($1,$2,$3,$4,$5, now())
         ON CONFLICT (usuario_id) DO UPDATE SET idx=$2, etapa=$3, respostas=$4, finalizado=$5, atualizado_em=now()`,
        [usuarioId, idx, etapa, JSON.stringify(respostas), finalizado]);
      return;
    }
    const d = loadFile(); d.progresso[usuarioId] = { idx, etapa, respostas, finalizado, atualizado_em: new Date().toISOString() }; saveFile(d);
  },
  async lerProgresso(usuarioId) {
    if (pgPool) { const r = await pgPool.query('SELECT * FROM questionario_progresso WHERE usuario_id=$1', [usuarioId]); return r.rows[0] || null; }
    const d = loadFile(); return d.progresso[usuarioId] || null;
  },
  async limparProgresso(usuarioId) {
    if (pgPool) { await pgPool.query('DELETE FROM questionario_progresso WHERE usuario_id=$1', [usuarioId]); return; }
    const d = loadFile(); delete d.progresso[usuarioId]; saveFile(d);
  },
  async salvarResultado(usuarioId, scores, prefs, topArea) {
    if (pgPool) {
      await pgPool.query('INSERT INTO resultados (usuario_id, scores, prefs, top_area) VALUES ($1,$2,$3,$4)', [usuarioId, JSON.stringify(scores), JSON.stringify(prefs), topArea]);
      await pgPool.query(`DELETE FROM resultados WHERE id NOT IN (SELECT id FROM resultados WHERE usuario_id=$1 ORDER BY criado_em DESC LIMIT 5)`, [usuarioId]);
      return;
    }
    const d = loadFile(); d.resultados.push({ usuario_id: usuarioId, scores, prefs, top_area: topArea, criado_em: new Date().toISOString() });
    d.resultados = d.resultados.filter(r => r.usuario_id !== usuarioId ? true : true);
    const doUser = d.resultados.filter(r => r.usuario_id === usuarioId).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 5);
    d.resultados = d.resultados.filter(r => r.usuario_id !== usuarioId).concat(doUser); saveFile(d);
  },
  async listarResultados(usuarioId) {
    if (pgPool) { const r = await pgPool.query('SELECT * FROM resultados WHERE usuario_id=$1 ORDER BY criado_em DESC LIMIT 5', [usuarioId]); return r.rows; }
    const d = loadFile(); return d.resultados.filter(r => r.usuario_id === usuarioId).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 5);
  },
  async salvarSimulado(usuarioId, modulo, acertos, total, pct) {
    if (pgPool) {
      await pgPool.query('INSERT INTO simulados (usuario_id, modulo, acertos, total, pct) VALUES ($1,$2,$3,$4,$5)', [usuarioId, modulo, acertos, total, pct]);
      await pgPool.query(`DELETE FROM simulados WHERE id NOT IN (SELECT id FROM simulados WHERE usuario_id=$1 ORDER BY criado_em DESC LIMIT 5)`, [usuarioId]);
      return;
    }
    const d = loadFile(); d.simulados.push({ usuario_id: usuarioId, modulo, acertos, total, pct, criado_em: new Date().toISOString() });
    const doUser = d.simulados.filter(s => s.usuario_id === usuarioId).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 5);
    d.simulados = d.simulados.filter(s => s.usuario_id !== usuarioId).concat(doUser); saveFile(d);
  },
  async listarSimulados(usuarioId) {
    if (pgPool) { const r = await pgPool.query('SELECT * FROM simulados WHERE usuario_id=$1 ORDER BY criado_em DESC LIMIT 5', [usuarioId]); return r.rows; }
    const d = loadFile(); return d.simulados.filter(s => s.usuario_id === usuarioId).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 5);
  },
  async excluirConta(usuarioId) {
    if (pgPool) { await pgPool.query('DELETE FROM usuarios WHERE id=$1', [usuarioId]); return; }
    const d = loadFile(); d.usuarios = d.usuarios.filter(u => u.id !== usuarioId); d.sessoes = d.sessoes.filter(s => s.usuario_id !== usuarioId); delete d.progresso[usuarioId];
    d.resultados = d.resultados.filter(r => r.usuario_id !== usuarioId); d.simulados = d.simulados.filter(s => s.usuario_id !== usuarioId); saveFile(d);
  },
  async auditar(usuarioId, acao, detalhe, ip) {
    if (pgPool) { try { await pgPool.query('INSERT INTO auditoria (usuario_id, acao, detalhe, ip) VALUES ($1,$2,$3,$4)', [usuarioId, acao, JSON.stringify(detalhe || {}), ip || null]); } catch {} return; }
    const d = loadFile(); d.auditoria.push({ usuario_id: usuarioId, acao, detalhe, ip, criado_em: new Date().toISOString() }); saveFile(d);
  }
};

/* ---------------- Auth helpers ---------------- */
function extrairToken(req) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) return h.slice(7);
  return req.headers['x-access-token'] || null;
}
async function Auth(req, res, next) {
  const token = extrairToken(req);
  const s = await db.validarSessao(token);
  if (!s) return res.status(401).json({ erro: 'Sessão inválida' });
  const u = await db.buscarId(s.usuario_id);
  if (!u) return res.status(401).json({ erro: 'Usuário não encontrado' });
  req.usuario = u; req.token = token; next();
}

/* ---------------- Rotas ---------------- */
app.get('/api/health', (req, res) => res.json({ ok: true, db: pgPool ? 'postgres' : 'arquivo' }));

app.post('/api/auth/cadastrar', async (req, res) => {
  try {
    const { nome, username, senha, idade, cidade } = req.body || {};
    if (!nome || nome.trim().length < 2) return res.status(400).json({ erro: 'Nome inválido' });
    if (!/^[a-zA-Z0-9_.]{3,20}$/.test(username || '')) return res.status(400).json({ erro: 'Username inválido (3-20, sem acento)' });
    if (!senha || senha.length < 4) return res.status(400).json({ erro: 'Senha mínima 4' });
    const usernameLower = username.toLowerCase();
    if (await db.buscarUsername(usernameLower)) return res.status(409).json({ erro: 'Username em uso' });
    const senhaHash = await bcrypt.hash(senha, 10);
    const u = await db.cadastrar({ nome: nome.trim(), username, usernameLower, senhaHash, idade: idade || '', cidade: cidade || '' });
    const s = await db.criarSessao(u.id);
    await db.auditar(u.id, 'cadastro', { username }, req.ip);
    res.json({ token: s.token, usuario: { id: u.id, nome: u.nome, username: u.username, idade: u.idade, cidade: u.cidade } });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, senha } = req.body || {};
    const u = await db.buscarUsername((username || '').toLowerCase());
    if (!u || !(await bcrypt.compare(senha || '', u.senha_hash))) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    const s = await db.criarSessao(u.id);
    await db.auditar(u.id, 'login', {}, req.ip);
    res.json({ token: s.token, usuario: { id: u.id, nome: u.nome, username: u.username, idade: u.idade, cidade: u.cidade } });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/auth/logout', Auth, async (req, res) => { await db.apagarSessao(req.token); res.json({ ok: true }); });

app.get('/api/auth/me', Auth, (req, res) => {
  const u = req.usuario;
  res.json({ id: u.id, nome: u.nome, username: u.username, idade: u.idade, cidade: u.cidade });
});

/* Progresso do questionário (retomar) */
app.get('/api/progresso', Auth, async (req, res) => {
  const p = await db.lerProgresso(req.usuario.id);
  res.json(p || { idx: 0, etapa: 1, respostas: {}, finalizado: false });
});

app.put('/api/progresso', Auth, async (req, res) => {
  const { idx = 0, etapa = 1, respostas = {}, finalizado = false } = req.body || {};
  await db.salvarProgresso(req.usuario.id, Number(idx), Number(etapa), respostas, !!finalizado);
  res.json({ ok: true });
});

app.post('/api/progresso/limpar', Auth, async (req, res) => { await db.limparProgresso(req.usuario.id); res.json({ ok: true }); });

/* Resultados */
app.post('/api/resultado', Auth, async (req, res) => {
  const { scores, prefs, topArea } = req.body || {};
  if (!scores || !topArea) return res.status(400).json({ erro: 'Dados incompletos' });
  await db.salvarResultado(req.usuario.id, scores, prefs || [], topArea);
  await db.limparProgresso(req.usuario.id);
  res.json({ ok: true });
});

app.get('/api/resultado', Auth, async (req, res) => { res.json(await db.listarResultados(req.usuario.id)); });

/* Simulados */
app.post('/api/simulado', Auth, async (req, res) => {
  const { modulo, acertos, total } = req.body || {};
  if (!modulo || typeof acertos !== 'number' || !total) return res.status(400).json({ erro: 'Dados incompletos' });
  const pct = Math.round((acertos / total) * 100);
  await db.salvarSimulado(req.usuario.id, modulo, acertos, total, pct);
  res.json({ ok: true, pct });
});

app.get('/api/simulado', Auth, async (req, res) => { res.json(await db.listarSimulados(req.usuario.id)); });

/* Exclusão total (RF11 / LGPD) */
app.delete('/api/conta', Auth, async (req, res) => {
  await db.excluirConta(req.usuario.id);
  await db.apagarSessao(req.token);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`[server] Projeto X rodando em http://localhost:${PORT} (${pgPool ? 'PostgreSQL' : 'arquivo local'})`));

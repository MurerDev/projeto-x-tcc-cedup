# Banco de dados e armazenamento

## 1. Tecnologia
- **PostgreSQL** acessado com queries SQL diretas pela biblioteca **`pg`** (RNF12).
- Backend **Node.js + Express**, autenticação **JWT** e senhas com **bcrypt**.
- O sistema roda em **localhost** para desenvolvimento, testes e apresentação do TCC (RNF11).
- **Fallback:** sem `DATABASE_URL`, o servidor usa um arquivo local (`data.json`) para permitir demonstração sem instalar banco.

## 2. Tabelas

### `usuarios`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| nome | TEXT | pode repetir |
| username | TEXT UNIQUE | |
| username_lower | TEXT UNIQUE | garante unicidade case-insensitive (RF02) |
| senha_hash | TEXT | bcrypt (RNF01) |
| idade, cidade | TEXT | opcionais (RF09) |
| criado_em | TIMESTAMPTZ | |
| username_trocado_em | TIMESTAMPTZ | regra de 30 dias (RF10) |

### `sessoes`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| usuario_id | FK → usuarios (ON DELETE CASCADE) | |
| token | TEXT UNIQUE | JWT |
| criado_em, expira_em | TIMESTAMPTZ | |

### `questionario_progresso`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| usuario_id | FK → usuarios (UNIQUE) | um progresso por estudante |
| idx | INTEGER | pergunta atual |
| etapa | INTEGER | 1–4 |
| respostas | JSONB | `{ perguntaId: valor }` |
| finalizado | BOOLEAN | |
| atualizado_em | TIMESTAMPTZ | |

Permite **retomar o questionário de onde parou** após sair.

### `resultados`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| usuario_id | FK → usuarios | |
| scores | JSONB | compatibilidade por área |
| prefs | JSONB | preferências (desempate) |
| top_area | TEXT | área de maior compatibilidade |
| criado_em | TIMESTAMPTZ | mantém as 5 últimas (RF42) |

### `simulados`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| usuario_id | FK → usuarios | |
| modulo | TEXT | geral / tec / saude |
| acertos, total, pct | INTEGER | |
| criado_em | TIMESTAMPTZ | mantém as 5 últimas (RF38) |

### `auditoria`
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL PK | |
| usuario_id | FK (ON DELETE SET NULL) | |
| acao | TEXT | login, cadastro, etc. |
| detalhe | JSONB | |
| ip | TEXT | |
| criado_em | TIMESTAMPTZ | |

## 3. O que é processado e como
1. O estudante responde as 34 perguntas; as respostas ficam em `questionario_progresso.respostas` (JSONB) enquanto não finaliza.
2. Ao finalizar, o servidor calcula os scores (35/35/20 + desempate) e grava em `resultados`.
3. O progresso é **limpo** após a finalização (a tentativa fica registrada em `resultados`).
4. O simulado grava acertos/total/pct em `simulados`, sem alterar resultados.

## 4. Como rodar
```bash
cd TCC/server
npm install
# com banco:
createdb projeto_x
psql $DATABASE_URL -f schema.sql
DATABASE_URL=postgres://usuario:senha@localhost:5432/projeto_x npm start
# sem banco (demo):
npm start
```
Servidor em `http://localhost:3000`. O frontend consome `/api/*` na mesma origem; se a API não responder, usa armazenamento local apenas para não travar a demonstração.

## 5. Backup e exclusão
- Exclusão de conta remove o usuário e, em cascata, sessões, progresso, resultados e simulados (RF11).
- Recomendado backup periódico do banco em ambiente de apresentação.

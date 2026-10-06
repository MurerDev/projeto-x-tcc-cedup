# Projeto X — TCC CEDUP 2026

Plataforma de orientação e preparação profissional para estudantes do ensino médio.

- Questionário em 3 etapas (interesses, habilidades, competências + preferências)
- 12 áreas profissionais com cálculo 35/35/20 + desempate por preferência
- Trilha exploração/avançado, simulados (geral, tecnologia, saúde), currículo e redação
- Histórico de 5 tentativas, exportação JSON, impressão do boletim

## Rodar local

Abra `index.html` no navegador, ou suba um servidor simples:

```bash
npx serve .
# ou
python -m http.server 5500
```

Dados ficam no `localStorage` (protótipo para banca, sem backend).

## Estrutura

- `index.html` — telas (SPA com renderização condicional)
- `styles.css` — visual azul-marinho + animações
- `dados.js` — 12 áreas, 34 perguntas, simulados, materiais
- `script.js` — auth, cálculo, trilhas, histórico
- `logo.png` — selo do projeto (fundo removido)

# Funcionamento do questionário

## 1. Objetivo
Coletar informações sobre o perfil do estudante do ensino médio para identificar **áreas profissionais compatíveis** — e não determinar uma profissão. O resultado alimenta uma trilha de desenvolvimento proporcional ao momento atual do estudante.

## 2. Estrutura em 4 etapas
O questionário tem **34 perguntas** divididas em 4 etapas sequenciais:

| Etapa | Pilar | Quantidade | Formato |
| --- | --- | --- | --- |
| 1 | Interesses | 12 | Escala 0–4 (com neutro) |
| 2 | Habilidades | 10 | Escala 0–4 de evidência |
| 3 | Competências | 8 | Situações do cotidiano, 1 alternativa |
| 4 | Preferências de ambiente | 4 | 4 alternativas (não somam ponto) |

- **Etapa 1 — Interesses:** o que desperta curiosidade (ex.: mexer com computador, cuidar de pessoas, debater sociedade). Escala de 0 = "Nada a ver comigo" a 4 = "Amo / quero muito", com 2 = neutro.
- **Etapa 2 — Habilidades:** o que o estudante **já fez** (bico, curso, voluntariado, escola). A escala mede evidência prática, não autoavaliação: 0 = "Nunca fiz" a 4 = "Faço sempre / ensino outros". Um curso sozinho não prova habilidade.
- **Etapa 3 — Competências:** 8 situações (grupo que trava, pressão, erro, conflito) com 4 alternativas + "Nenhuma das alternativas". Avalia comunicação, organização, criatividade, liderança, cuidado.
- **Etapa 4 — Preferências:** trabalhar sozinho/equipe, ambiente dinâmico/previsível, contato com pessoas, onde se vê. **Não somam** no cálculo: funcionam como filtro e critério de desempate.

## 3. Como as perguntas foram elaboradas
- Cada pergunta foi redigida em linguagem de adolescente, com situações concretas da escola e do dia a dia.
- As competências usam **situações hipotéticas/comportamentais** ("quando o grupo trava, você…"), que revelam perfil melhor que autoavaliação direta.
- Cada alternativa está associada a **1 a 3 áreas** com pesos de 1 a 3, permitindo que uma mesma resposta contribua para mais de uma área (RF15) — por exemplo, "criar conteúdo" pontua Design (3) e Comunicação (2).

## 4. Como as respostas são analisadas
Cada resposta vale de 0 a 4. Para cada área, acumula-se:

- **Interesses (I):** soma de `valor × peso` nas perguntas da etapa 1 que apontam para a área; divide-se pelo máximo possível → `I normalizado` (0 a 1).
- **Habilidades (H):** idem na etapa 2 → `H normalizado`.
- **Competências (C):** nas situações, a alternativa escolhida vale 4 × peso; o máximo da área naquela questão é o maior peso entre as alternativas → `C normalizado`.

Compatibilidade final:

```
score(área) = (I·0,35 + H·0,35 + C·0,20) / 0,90 × 100
```

Pesos definidos em RF14: **interesses 35%, habilidades 35%, competências 20%**. A relação entre interesse e habilidade é o coração do sistema: quem tem interesse alto e habilidade baixa recebe trilha de **exploração**; quem tem ambos altos recebe trilha de **aperfeiçoamento**.

## 5. Exibição dos resultados
- **≥ 60%** → áreas em destaque (RF25).
- **40% a 59%** → seção "Ver mais" (RF26).
- **< 40%** → não exibidas (RF27).
- **Empate** → preferências do estudante desempatam; persistindo, ordem alfabética (RF28).

## 6. Regras de preenchimento
- Etapa só libera a próxima quando concluída (RF18).
- É possível alterar respostas antes de finalizar; após a confirmação, bloqueiam (RF22).
- Progresso salvo no banco: ao sair e voltar, o estudante continua de onde parou.
- Histórico das **5 últimas tentativas** (RF42), com comparação entre elas.

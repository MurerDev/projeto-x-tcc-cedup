# Documentação do sistema — Projeto X (TCC CEDUP 2026)

---

## 1. Funcionamento do questionário

### 1.1 Objetivo
O questionário tem como objetivo coletar informações sobre o perfil do estudante do ensino médio para **identificar áreas profissionais compatíveis**, e não determinar uma profissão específica. O resultado obtido alimenta uma **trilha de desenvolvimento** proporcional ao momento atual do estudante, considerando o que ele já sabe fazer e o que ainda precisa desenvolver.

### 1.2 Informações que serão solicitadas
O sistema solicita apenas os dados necessários ao funcionamento: **nome**, **nome de usuário**, **senha** e, opcionalmente, **idade** e **cidade/UF**. Não são solicitados e-mail, CPF, endereço, renda ou qualquer dado sensível. As respostas do questionário ficam armazenadas enquanto o estudante não finaliza e são usadas exclusivamente para o cálculo de compatibilidade.

### 1.3 Estrutura do questionário
O questionário é composto por **34 perguntas distribuídas em 4 etapas sequenciais**, correspondentes aos quatro pilares definidos no escopo:

| Etapa | Pilar | Quantidade | Formato |
| --- | --- | --- | --- |
| 1 | Interesses | 12 | Escala de 0 a 4 (com alternativa neutra) |
| 2 | Habilidades | 10 | Escala de 0 a 4 de evidência |
| 3 | Competências | 8 | Situações do cotidiano, com uma alternativa |
| 4 | Preferências de ambiente | 4 | Quatro alternativas (não somam ponto) |

- **Etapa 1 — Interesses:** investiga o que desperta curiosidade e vontade de aprender (por exemplo, mexer com computador, cuidar de pessoas, debater temas sociais). A escala varia de 0 ("Nada a ver comigo") a 4 ("Amo / quero muito"), com 2 representando posição neutra.
- **Etapa 2 — Habilidades:** investiga o que o estudante **já fez** na prática, considerando cursos, bicos, trabalho voluntário, atividades escolares e experiências pessoais. A escala varia de 0 ("Nunca fiz") a 4 ("Faço sempre / ensino outros"). A realização de um curso, por si só, não é considerada prova de habilidade.
- **Etapa 3 — Competências:** apresenta oito situações cotidianas (grupo que trava, pressão por entrega, erro, conflito), cada uma com quatro alternativas, mais a opção "Nenhuma das alternativas". Avalia comunicação, organização, criatividade, liderança e cuidado com os outros.
- **Etapa 4 — Preferências de ambiente:** investiga o tipo de dinâmica de trabalho que mais combina com o estudante (sozinho ou em equipe; ambiente dinâmico ou previsível; contato com pessoas; onde se vê atuando). Essas respostas **não somam pontos**: funcionam como filtro contextual e critério de desempate entre áreas.

### 1.4 Como as perguntas foram elaboradas
- As perguntas foram redigidas em **linguagem acessível a adolescentes**, com situações concretas da escola e do cotidiano, evitando termos técnicos.
- As questões de competência adotam o formato de **situações hipotéticas e comportamentais** ("quando o grupo trava, você…"), pois esse formato revela o perfil de forma mais confiável do que a autoavaliação direta.
- Cada alternativa está associada a **uma, duas ou três áreas profissionais**, com pesos que variam de 1 a 3, permitindo que uma mesma resposta contribua para mais de uma área. Por exemplo, "criar conteúdo" pontua Design (peso 3) e Comunicação (peso 2).

### 1.5 Como as respostas serão analisadas
Cada resposta assume valor de 0 a 4. Para cada uma das 12 áreas, o sistema acumula três medidas normalizadas entre 0 e 1:

- **Interesses (I):** soma de `valor × peso` nas perguntas da Etapa 1 que apontam para a área, dividida pelo máximo possível daquela área;
- **Habilidades (H):** idem para a Etapa 2;
- **Competências (C):** nas situações da Etapa 3, a alternativa escolhida vale `4 × peso`; o máximo da área naquela questão é o maior peso entre as alternativas oferecidas.

A compatibilidade final de cada área é calculada por:

```
score(área) = (I × 0,35 + H × 0,35 + C × 0,20) ÷ 0,90 × 100
```

Os pesos adotados são **interesses 35%**, **habilidades 35%** e **competências 20%**. A relação entre interesse e habilidade é o principal critério de personalização: o estudante com **interesse alto e habilidade baixa** recebe uma trilha de **exploração e desenvolvimento**; o estudante com **interesse e habilidade altos** recebe uma trilha de **aperfeiçoamento**.

### 1.6 Como o sistema identifica as áreas relacionadas ao perfil
O sistema não indica uma profissão. Ele calcula a compatibilidade do estudante com cada uma das 12 áreas e as apresenta da seguinte forma:

- **compatibilidade igual ou superior a 60%** → áreas em destaque;
- **compatibilidade entre 40% e 59%** → seção "Ver mais";
- **compatibilidade inferior a 40%** → não exibida ao estudante;
- **empate entre áreas** → as preferências do estudante são usadas como critério de desempate; persistindo o empate, aplica-se a ordem alfabética.

A identificação é feita por meio de **regras próprias do sistema**, e não por inteligência artificial, o que torna o resultado controlado, explicável e adequado ao contexto do TCC. O estudante ainda recebe a explicação de quais pilares contribuíram para o resultado e pode consultar o histórico das cinco últimas tentativas.

### 1.7 Regras de preenchimento
- Cada etapa só é liberada após a conclusão da anterior.
- É possível alterar as respostas antes da finalização; após a confirmação, elas são bloqueadas.
- O **progresso é salvo no banco de dados**: se o estudante sair, ao retornar continua exatamente de onde parou.
- O sistema mantém as **cinco últimas tentativas** e permite compará-las.

---

## 2. Simulados e preparação profissional

### 2.1 Objetivo
Os simulados reproduzem etapas de um **processo seletivo** para que o estudante possa praticar situações reais antes de enfrentá-las. O objetivo é a **preparação para o mercado de trabalho**. O resultado do simulado é um recurso complementar: **não altera a trilha de desenvolvimento** do estudante.

### 2.2 Simulados disponibilizados
| Módulo | Conteúdo | Etapas apresentadas |
| --- | --- | --- |
| **Simulado Geral** | Processos seletivos, currículo, entrevista, dinâmica de grupo, e-mail profissional, pontualidade e proteção de dados | Triagem de currículo (leitura) → Avaliação inicial (interativa) → Dinâmica de grupo (leitura) → Entrevista (leitura) |
| **Simulado de Tecnologia** | Atuação em suporte técnico e desenvolvimento júnior | Triagem (leitura) → Teste técnico (interativo) → Entrevista técnica (leitura) |
| **Simulado de Saúde** | Atuação em apoio e atendimento em saúde | Triagem (leitura) → Avaliação técnica e ética (interativa) → Entrevista (leitura) |

Cada módulo possui **15 questões de múltipla escolha**, sem cronômetro obrigatório. Em cada módulo, **apenas uma etapa é interativa**; as demais são apresentadas de forma explicativa, por meio de texto. Não há questões de texto livre.

### 2.3 Situações abordadas
Os simulados envolvem diferentes situações relacionadas a processos seletivos:

- **Entrevista de emprego:** perguntas como "fale sobre você" e "qual seu ponto a melhorar", além de postura e clareza na resposta.
- **Elaboração de currículo:** o que incluir, o que evitar, objetividade e adequação ao ensino médio.
- **Conhecimentos gerais:** pontualidade, e-mail profissional, apresentação pessoal e comunicação.
- **Dinâmica de grupo:** escuta, cooperação, respeito à vez e negociação.
- **Tomada de decisão sob pressão:** gestão de tempo e priorização.
- **Ética e proteção de dados:** sigilo, consentimento e cuidados com informações pessoais no atendimento.

### 2.4 Correção e feedback
- Ao final, o sistema apresenta o **gabarito com explicação para cada questão**, tanto nos acertos quanto nos erros.
- É exibido um **resumo de desempenho** com o percentual geral, os pontos observados e orientações de preparação.
- O histórico mantém as **cinco últimas tentativas**; ao iniciar a sexta, a mais antiga é substituída automaticamente.
- Quando o estudante já possui perfil calculado, o simulado passa a utilizar conteúdo da sua área identificada. Na versão atual, Tecnologia e Saúde possuem conteúdo completo, e as demais áreas utilizam o simulado geral.

### 2.5 Materiais de preparação
A seção **Materiais** disponibiliza conteúdo estático de apoio, sem correção automática:
- **Currículo:** cabeçalho, objetivo, resumo, experiências informais, educação, habilidades e o que evitar;
- **Redação:** introdução com tese, dois parágrafos de argumento, conclusão com proposta, conectivos e revisão.

---

## 3. Privacidade e proteção de dados

### 3.1 Princípios
Por ser uma plataforma destinada a **adolescentes**, o Projeto X adota os cuidados previstos na **Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)** e no Estatuto da Criança e do Adolescente. Os princípios adotados são: **minimização** (coletar apenas o necessário), **finalidade** (usar os dados apenas para a orientação), **transparência** (informar claramente o que é coletado) e **eliminação** (permitir que o estudante apague todos os seus dados).

### 3.2 Coleta de dados
| Dado | Finalidade | Obrigatório |
| --- | --- | --- |
| Nome | Identificação no sistema | Sim |
| Nome de usuário | Login único | Sim |
| Senha | Autenticação (armazenada com hash) | Sim |
| Idade | Contexto de orientação | Não |
| Cidade/UF | Contexto de orientação | Não |
| Respostas do questionário | Cálculo de compatibilidade | Sim (para gerar resultado) |
| Resultados e simulados | Histórico e evolução | Sim |

**Não são coletados** e-mail, CPF, endereço, renda, dados de terceiros, localização precisa, biometria ou qualquer outra informação que não seja necessária ao funcionamento da plataforma.

### 3.3 Armazenamento
- As senhas são armazenadas com **hash bcrypt**, nunca em texto puro.
- A sessão é mantida por **token JWT com expiração**, e cada estudante acessa somente os próprios dados.
- Resultados, respostas e desempenho são **privados por padrão**, visíveis apenas ao próprio estudante.
- Não há compartilhamento de dados entre usuários nem publicação de rankings.

### 3.4 Utilização dos dados
Os dados são utilizados exclusivamente para:
- gerar a compatibilidade com áreas e a trilha de desenvolvimento;
- permitir que o estudante **retome o questionário de onde parou**;
- manter o histórico das cinco últimas tentativas para comparação.

Não há publicidade, venda de dados ou envio de informações a terceiros.

### 3.5 Direitos do estudante
- **Acessar e editar** os próprios dados cadastrais (o nome de usuário possui regra de alteração a cada 30 dias);
- **Excluir permanentemente a conta**, o que remove conta, sessões, progresso, resultados e simulados, **sem retenção**;
- **Encerrar a sessão** a qualquer momento.

### 3.6 Cuidados específicos com adolescentes
- O uso da plataforma está vinculado ao contexto escolar, com acompanhamento de professores e orientadores.
- A linguagem é clara e as informações sobre coleta são apresentadas de forma objetiva.
- Nenhum dado além do necessário é solicitado.
- A plataforma **não realiza diagnóstico psicológico** e **não determina profissão**, funcionando como ferramenta de apoio à orientação.

### 3.7 Auditoria
Operações relevantes (cadastro, login e demais ações) são registradas em uma tabela de auditoria com usuário, ação, detalhe e IP, permitindo verificação pela equipe responsável.

---

## 4. Banco de dados e armazenamento

### 4.1 Banco de dados utilizado
O sistema utiliza **PostgreSQL**, acessado por meio de **consultas SQL diretas** com a biblioteca **`pg`**. O backend é desenvolvido em **Node.js com Express**, com autenticação por **JWT** e senhas protegidas por **bcrypt**. O sistema é executado em **ambiente local (localhost)** para desenvolvimento, testes e apresentação do TCC.

**Observação:** caso nenhuma conexão com PostgreSQL esteja configurada, o servidor passa a utilizar um **arquivo local de dados** apenas para fins de demonstração, sem prejuízo à apresentação.

### 4.2 Informações armazenadas

**Tabela `usuarios`**
| Coluna | Tipo | Observação |
| --- | --- | --- |
| id | SERIAL (chave primária) | |
| nome | TEXT | pode se repetir entre contas |
| username | TEXT ÚNICO | |
| username_lower | TEXT ÚNICO | garante unicidade sem diferenciar maiúsculas |
| senha_hash | TEXT | hash bcrypt |
| idade, cidade | TEXT | opcionais |
| criado_em | TIMESTAMPTZ | |
| username_trocado_em | TIMESTAMPTZ | controle da regra de 30 dias |

**Tabela `sessoes`** — id, usuário (chave estrangeira), token JWT, data de criação e de expiração.

**Tabela `questionario_progresso`** — id, usuário (único), índice da pergunta atual, etapa, respostas em formato JSON, indicador de finalização e data de atualização. É essa tabela que permite **retomar o questionário de onde o estudante parou**.

**Tabela `resultados`** — id, usuário, pontuações por área (JSON), preferências (JSON), área de maior compatibilidade e data. Armazena as **cinco últimas tentativas**.

**Tabela `simulados`** — id, usuário, módulo, acertos, total, percentual e data. Armazena as **cinco últimas tentativas**.

**Tabela `auditoria`** — id, usuário, ação, detalhe (JSON), IP e data.

### 4.3 Como as respostas são processadas e os resultados apresentados
1. Enquanto o estudante responde, as respostas são guardadas em `questionario_progresso.respostas`, no formato JSON, permitindo a continuidade posterior.
2. Ao finalizar, o sistema calcula a compatibilidade de cada área (interesses 35%, habilidades 35% e competências 20%, com desempate por preferências) e registra o resultado em `resultados`.
3. Após a finalização, o progresso é **limpo**, pois a tentativa passa a ficar registrada em `resultados`.
4. O simulado registra acertos, total e percentual em `simulados`, sem alterar os resultados do questionário.
5. O estudante visualiza as áreas com compatibilidade igual ou superior a 60%, pode acessar as áreas entre 40% e 59% em "Ver mais" e consulta o histórico para acompanhar a evolução.

### 4.4 Como executar o sistema
```bash
cd TCC/server
npm install

# Com banco de dados PostgreSQL:
createdb projeto_x
psql $DATABASE_URL -f schema.sql
DATABASE_URL=postgres://usuario:senha@localhost:5432/projeto_x npm start

# Sem banco (demonstração):
npm start
```
O servidor é iniciado em `http://localhost:3000`, servindo tanto a interface quanto a API.

### 4.5 Exclusão e backup
A exclusão da conta remove o usuário e, em cascata, sessões, progresso, resultados e simulados. Recomenda-se a realização periódica de backup do banco durante a fase de apresentação.

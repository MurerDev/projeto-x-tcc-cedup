# Privacidade e proteção de dados

## 1. Princípios
A plataforma lida com **adolescentes**, por isso adota o cuidado máximo previsto na **LGPD (Lei 13.709/2018)** e no Estatuto da Criança e do Adolescente. Os princípios são: **minimização** (coleta só o necessário), **finalidade** (uso só para orientação), **transparência** e **eliminação** (o estudante pode apagar tudo).

## 2. Dados coletados
| Dado | Por quê | Obrigatório |
| --- | --- | --- |
| Nome | Identificação no sistema | Sim |
| Username | Login único | Sim |
| Senha | Autenticação (armazenada com **bcrypt**) | Sim |
| Idade | Contexto de orientação | Não |
| Cidade/UF | Contexto de orientação | Não |
| Respostas do questionário | Cálculo de compatibilidade | Sim (para o resultado) |
| Resultados e simulados | Histórico e evolução | Sim |

**Não** coletamos: e-mail, CPF, endereço, renda, dados de terceiros, localização precisa, biometria ou qualquer dado sensível além do necessário.

## 3. Armazenamento e segurança
- Senhas com **hash bcrypt** (nunca em texto puro) — RNF01.
- Sessão por **JWT** com expiração; o estudante só acessa os próprios dados (RNF02, RNF04).
- Resultados, respostas e desempenho são **privados por padrão**, visíveis apenas ao próprio estudante.
- **Sem compartilhamento** entre usuários (RNF05) e sem publicação de rankings.

## 4. Uso dos dados
- Gerar compatibilidade com áreas e trilha de desenvolvimento.
- Permitir **retomar o questionário** de onde parou.
- Manter histórico das 5 últimas tentativas para comparação.
- Nenhuma outra finalidade; não há publicidade, venda ou envio a terceiros.

## 5. Direitos do estudante
- **Acessar** e **editar** os próprios dados cadastrais (menos o username, que tem regra de troca a cada 30 dias — RF10).
- **Excluir permanentemente a conta**: apaga conta, sessões, progresso, resultados e simulados, **sem retenção** (RF11).
- **Sair** da sessão a qualquer momento (RF06).

## 6. Cuidados com adolescentes
- Uso vinculado ao contexto escolar, com acompanhamento de professores/orientadores.
- Linguagem clara e informação objetiva sobre o que é coletado.
- Nenhuma coleta que não seja necessária ao funcionamento (RNF04, RNF06).
- A plataforma **não faz diagnóstico psicológico** e **não determina profissão** — é ferramenta de apoio.

## 7. Auditoria
Cada login, cadastro e operação relevante é registrado em tabela de auditoria (`auditoria`) com usuário, ação, detalhe e IP, para possível verificação pela equipe.

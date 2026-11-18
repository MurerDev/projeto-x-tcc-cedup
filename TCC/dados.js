/* Projeto X — Dados do joguinho (TCC CEDUP-2026) */
/* 12 áreas, pilares 35/35/20, preferência = desempate */
const AREAS = [
{cod:"A01",nome:"Tecnologia da Informação",icone:"💻",tags:["individual","dinamico","logica"],desc:"Projetam, desenvolvem e protegem sistemas, softwares, redes e dados.",comp:["raciocínio lógico","programação","análise de dados","resolução de problemas"],perfil:"Curioso, analítico e persistente. Gosta de automatizar e aprender tecnologia nova.",carreiras:["Desenvolvedor de Software","Analista de Dados","Cibersegurança","Suporte Técnico","Dev QA"],form:["Curso básico de informática / lógica","Técnico em Informática","Graduação: ADS, CC, SI"],links:[["Curso em Vídeo — grátis","https://www.cursoemvideo.com/"],["SENAI SC","https://www.sc.senai.br/"]]},
{cod:"A02",nome:"Engenharia e Indústria",icone:"🏭",tags:["pratico","previsivel","equipe"],desc:"Projeto, construção e otimização de estruturas, máquinas e processos.",comp:["cálculo","visão sistêmica","planejamento técnico","qualidade"],perfil:"Prático e metódico. Gosta de entender como as coisas funcionam.",carreiras:["Engenheiro Mecânico","Técnico em Eletrotécnica","Projetista","Supervisor de Manufatura"],form:["Matemática básica + desenho técnico","Técnico em Mecânica/Eletrotécnica","Engenharias"],links:[["SENAI","https://www.sc.senai.br/"]]},
{cod:"A03",nome:"Saúde",icone:"🩺",tags:["equipe","pessoas","previsivel"],desc:"Prevenção, cuidado e bem-estar físico e mental das pessoas.",comp:["empatia","atenção a detalhes","decisão sob pressão","ética"],perfil:"Acolhedor e responsável. Vocação para cuidar.",carreiras:["Enfermagem","Fisioterapia","Nutrição","Psicologia","Técnico em Enfermagem"],form:["Biologia + voluntariado","Técnico em Enfermagem","Graduação na saúde"],links:[["Fiocruz","https://www.fiocruz.br/"]]},
{cod:"A04",nome:"Administração e Gestão",icone:"📊",tags:["equipe","lideranca","organizacao"],desc:"Planejam e organizam pessoas, recursos e processos.",comp:["liderança","planejamento","comunicação","gestão"],perfil:"Organizado e comunicativo. Gosta de coordenar e bater metas.",carreiras:["Administrador","Gerente de Projetos","RH","Empreendedor","Logística"],form:["Organização pessoal + Excel","Técnico em Administração","Administração"],links:[["SEBRAE","https://www.sebrae.com.br/"]]},
{cod:"A05",nome:"Direito e Ciências Sociais",icone:"⚖️",tags:["pessoas","questionador","previsivel"],desc:"Leis, direitos, sociedade e comportamento humano.",comp:["argumentação","leitura crítica","negociação","senso de justiça"],perfil:"Questionador e observador. Se interessa por justiça e sociedade.",carreiras:["Advogado","Assistente Social","Sociólogo","Mediador","Perito"],form:["Leitura + debate","Técnico / curso social","Direito / Ciências Sociais"],links:[["Planalto – Leis","https://www.planalto.gov.br/"]]},
{cod:"A06",nome:"Educação",icone:"📚",tags:["equipe","pessoas","paciente"],desc:"Ensinam e desenvolvem pessoas na escola e na comunidade.",comp:["didática","comunicação clara","paciência","planejamento pedagógico"],perfil:"Paciente e motivador. Gosta de ver o outro evoluir.",carreiras:["Professor","Pedagogo","Orientador Educacional","Instrutor","Tutor EAD"],form:["Monitoria / reforço","Magistério / cursos livres","Pedagogia / Licenciaturas"],links:[["MEC","https://www.gov.br/mec/"]]},
{cod:"A07",nome:"Comunicação e Marketing",icone:"📣",tags:["equipe","pessoas","dinamico","criativo"],desc:"Criam mensagens, marcas e estabelecem conexões entre organizações e públicos.",comp:["escrita persuasiva","criatividade","mídias digitais","storytelling"],perfil:"Extrovertido e criativo. Ligado em tendências.",carreiras:["Jornalista","Social Media","Analista de Marketing Digital","Redator Publicitário","Gestor de Tráfego Pago"],form:["Criar conteúdo / celular","Cursos de marketing","Comunicação / Publicidade"],links:[["SEBRAE Marketing","https://www.sebrae.com.br/"]]},
{cod:"A08",nome:"Design e Criatividade",icone:"🎨",tags:["individual","criativo","dinamico"],desc:"Transformam ideias em soluções visuais, estéticas e funcionais.",comp:["senso estético","ferramentas de criação","originalidade","atenção a detalhes"],perfil:"Imaginativo e sensível. Valoriza expressão e liberdade.",carreiras:["Designer Gráfico","UX/UI Designer","Ilustrador","Fotógrafo","Diretor de Arte"],form:["Desenho / Canva / Figma","Cursos de design","Design / Arquitetura"],links:[["Canva DesignSchool","https://designschool.canva.com/"]]},
{cod:"A09",nome:"Ciências e Pesquisa",icone:"🔬",tags:["individual","logica","paciente"],desc:"Investigam fenômenos naturais e sociais aplicando o método científico.",comp:["pensamento científico","análise estatística","rigor metodológico","experimentação"],perfil:"Curioso e detalhista. Movido pela busca de respostas e descobertas.",carreiras:["Pesquisador","Biólogo","Químico","Físico","Estatístico"],form:["Feira de ciências","Técnico em laboratório","Ciências / Biologia / Física"],links:[["CNPq","https://www.gov.br/cnpq/"]]},
{cod:"A10",nome:"Finanças e Contabilidade",icone:"💰",tags:["individual","previsivel","organizacao"],desc:"Gerenciam, analisam e controlam recursos financeiros, investimentos e tributos.",comp:["raciocínio quantitativo","análise financeira","atenção a detalhes","ética e integridade"],perfil:"Responsável e organizado. Confortável com números e normas.",carreiras:["Contador","Analista Financeiro","Auditor","Economista","Controller"],form:["Matemática financeira básica","Técnico em Contabilidade","Contábeis / Economia"],links:[["Banco Central – Educação Financeira","https://www.bcb.gov.br/cidadaniafinanceira/"]]},
{cod:"A11",nome:"Meio Ambiente e Agronegócio",icone:"🌱",tags:["campo","pratico","equipe"],desc:"Produção agropecuária, gestão de recursos naturais e soluções sustentáveis.",comp:["conhecimento de ecossistemas","sustentabilidade","trabalho de campo","legislação ambiental"],perfil:"Conectado à natureza, prático e de visão de longo prazo.",carreiras:["Engenheiro Agrônomo","Médico Veterinário","Gestor Ambiental","Técnico Agrícola","Consultor em Sustentabilidade"],form:["Horta / campo / voluntariado","Técnico Agrícola","Agronomia / Ambiental"],links:[["Embrapa","https://www.embrapa.br/"]]},
{cod:"A12",nome:"Turismo, Hotelaria e Gastronomia",icone:"🍳",tags:["equipe","pessoas","dinamico"],desc:"Criam experiências de hospitalidade, viagens, eventos e alimentação.",comp:["atendimento ao cliente","idiomas","organização de eventos","criatividade culinária"],perfil:"Sociável e atencioso. Gosta de receber bem.",carreiras:["Chef de Cozinha","Guia de Turismo","Gerente de Hotel","Organizador de Eventos","Confeiteiro"],form:["Cozinhar / receber / idiomas","Cursos de culinária / turismo","Gastronomia / Turismo"],links:[["SENAC","https://www.sc.senac.br/"]]}
];

/* Pesos RF14: interesses 35%, habilidades 35%, competências 20% */
const PESOS = {interesse:0.35, habilidade:0.35, competencia:0.20};

/* Cada resposta vale 0-4 pontos. Multiplica pelo peso da área (1-3). */
/* Etapa 1 = Interesses (12 perguntas), Etapa 2 = Habilidades (10), Etapa 3 = Competências (8), Etapa 4 = Preferências (4) */
const PERGUNTAS = [
// --- ETAPA 1: INTERESSES (12) ---
{id:"i1",etapa:1,txt:"Mexer com computador, app, jogo ou internet me empolga.",alvos:[["A01",3],["A09",1]]},
{id:"i2",etapa:1,txt:"Montar, desmontar ou entender como máquinas e coisas funcionam.",alvos:[["A02",3],["A01",1]]},
{id:"i3",etapa:1,txt:"Cuidar de pessoas, ajudar quem está doente ou precisando.",alvos:[["A03",3],["A06",1]]},
{id:"i4",etapa:1,txt:"Organizar time, vender ideia, liderar grupo ou empreender.",alvos:[["A04",3],["A07",1]]},
{id:"i5",etapa:1,txt:"Debater justiça, política, sociedade e direitos.",alvos:[["A05",3],["A06",1]]},
{id:"i6",etapa:1,txt:"Ensinar, explicar e ver o outro aprender.",alvos:[["A06",3],["A03",1]]},
{id:"i7",etapa:1,txt:"Criar vídeo, texto, post ou campanha que chame atenção.",alvos:[["A07",3],["A08",2]]},
{id:"i8",etapa:1,txt:"Desenhar, fotografar, decorar ou criar algo bonito.",alvos:[["A08",3],["A07",1]]},
{id:"i9",etapa:1,txt:"Fazer experimento, pesquisar e descobrir porquês.",alvos:[["A09",3],["A01",1],["A03",1]]},
{id:"i10",etapa:1,txt:"Lidar com números, dinheiro, planilha e organização financeira.",alvos:[["A10",3],["A04",1]]},
{id:"i11",etapa:1,txt:"Estar na natureza, plantar, cuidar de animal ou do planeta.",alvos:[["A11",3],["A09",1]]},
{id:"i12",etapa:1,txt:"Receber gente, cozinhar, viajar ou organizar evento.",alvos:[["A12",3],["A07",1]]},

// --- ETAPA 2: HABILIDADES (10) ---
{id:"h1",etapa:2,txt:"Já mexi com programação, robótica, Excel avançado ou editei algo no PC?",alvos:[["A01",3],["A09",1]]},
{id:"h2",etapa:2,txt:"Já montei móvel, fiz manutenção, solda, elétrica ou projeto técnico?",alvos:[["A02",3]]},
{id:"h3",etapa:2,txt:"Já cuidei de alguém, fiz primeiros socorros, curso de saúde ou voluntariado?",alvos:[["A03",3]]},
{id:"h4",etapa:2,txt:"Já liderei grupo, vendi algo, organizei grana ou evento?",alvos:[["A04",3],["A10",1]]},
{id:"h5",etapa:2,txt:"Escrevo bem, argumento bem, já participei de debate, júri simulado ou grêmio?",alvos:[["A05",3],["A07",1]]},
{id:"h6",etapa:2,txt:"Já ensinei alguém, dei reforço, monitoria ou expliquei conteúdo?",alvos:[["A06",3]]},
{id:"h7",etapa:2,txt:"Já criei conteúdo (vídeo, arte, texto) que outras pessoas viram?",alvos:[["A07",2],["A08",3]]},
{id:"h8",etapa:2,txt:"Sei desenhar, fotografar, usar Canva/Figma/CapCut ou cozinhar bem?",alvos:[["A08",3],["A12",1]]},
{id:"h9",etapa:2,txt:"Sou bom em matemática, pesquisa, laboratório ou feira de ciências?",alvos:[["A09",3],["A10",1],["A02",1]]},
{id:"h10",etapa:2,txt:"Sei cuidar de planta/animal, horta, ou entendo do campo/natureza?",alvos:[["A11",3],["A12",1]]},

// --- ETAPA 3: COMPETÊNCIAS (8 situacionais, cada uma vale 0-4 pontos) ---
{id:"c1",etapa:3,tipo:"multi",txt:"Na escola, quando o grupo trava, você:",opts:["Organizo e divido tarefas",["A04",3,"A02",1],"Dou ideia diferente que destrava",["A08",3,"A07",2],"Explico com calma até todos entenderem",["A06",3,"A03",1],"Analiso dados e fatos para decidir",["A01",3,"A09",2,"A10",1]]},
{id:"c2",etapa:3,tipo:"multi",txt:"Sob pressão (prova, entrega), você:",opts:["Mantém calma e cuida do time",["A03",3,"A06",1],"Foca no passo a passo e organiza",["A04",2,"A10",2],"Improvisa de jeito criativo",["A08",3,"A07",2],"Divide o problema em partes lógicas",["A01",3,"A09",2]]},
{id:"c3",etapa:3,tipo:"multi",txt:"O que as pessoas mais elogiam em você?",opts:["Comunicação",["A07",3,"A06",2],"Criatividade",["A08",3,"A12",1],"Organização",["A04",3,"A10",2],"Cuidado com os outros e com o ambiente",["A03",3,"A11",2]]},
{id:"c4",etapa:3,tipo:"multi",txt:"Prefere resolver problema como?",opts:["Testando e ajustando na prática",["A02",3,"A11",1],"Pesquisando a fundo",["A09",3,"A03",1],"Conversando e negociando",["A05",3,"A04",1],"Criando algo novo do zero",["A08",3,"A07",1]]},
{id:"c5",etapa:3,tipo:"multi",txt:"Em um trabalho, seu ponto forte é:",opts:["Liderar e distribuir",["A04",3,"A05",1],"Criar a parte visual",["A08",3,"A07",1],"Cuidar das pessoas",["A03",3,"A06",2],"Cuidar dos números e prazos",["A10",3,"A02",1]]},
{id:"c6",etapa:3,tipo:"multi",txt:"Se pudesse passar a tarde em uma oficina, seria de:",opts:["Programação e games",["A01",3,"A09",1],"Cozinha, hotel e evento",["A12",3,"A03",1],"Arte, design e foto",["A08",3,"A07",1],"Campo, natureza e laboratório",["A11",3,"A02",1]]},
{id:"c7",etapa:3,tipo:"multi",txt:"Quando erra, você:",opts:["Assume, ajusta e segue",["A04",2,"A02",2],"Pede ajuda e aprende",["A06",3,"A03",1],"Transforma o erro em ideia nova",["A08",3,"A07",1],"Investiga a causa raiz",["A09",3,"A01",2]]},
{id:"c8",etapa:3,tipo:"multi",txt:"Em discussão sobre tema social ou ambiental, você:",opts:["Defende com argumentos",["A05",3,"A04",1],"Escuta e media o grupo",["A06",2,"A03",2],"Traz dado e fato",["A09",2,"A10",2],"Propõe solução prática e sustentável",["A02",2,"A11",3]]},

// --- ETAPA 4: PREFERÊNCIAS (desempate RF28, não somam) ---
{id:"p1",etapa:4,tipo:"pref",txt:"Prefiro trabalhar:",opts:["Sozinho(a), no meu ritmo","Em equipe, com gente junto","Misto: parte sozinho, parte em grupo","Tanto faz"]},
{id:"p2",etapa:4,tipo:"pref",txt:"Ambiente ideal:",opts:["Dinâmico, muda todo dia","Previsível, organizado","Ao ar livre / prático","Tanto faz"]},
{id:"p3",etapa:4,tipo:"pref",txt:"Contato com pessoas:",opts:["O dia todo, adoro","Pouco, prefiro bastidor","Só quando precisa","Tanto faz"]},
{id:"p4",etapa:4,tipo:"pref",txt:"Onde me vejo melhor:",opts:["Escritório / computador","Campo / prática / rua","Com pessoas / palco / atendimento","Tanto faz"]}
];

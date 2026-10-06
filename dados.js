/* Projeto X — Dados do MVP conforme GitHub TCC-CEDUP-2026
   12 áreas (item 12), pesos RF14, thresholds RF25-27, simulados RF32-41 */
const AREAS = [
{cod:"A01",nome:"Tecnologia da Informação",icone:"💻",tags:["individual","dinamico","logica"],desc:"Projetam, desenvolvem e protegem sistemas, softwares, redes e dados.",comp:["raciocínio lógico","programação","análise de dados","resolução de problemas"],perfil:"Curioso, analítico e persistente. Gosta de automatizar e aprender tecnologia nova.",carreiras:["Desenvolvedor de Software","Analista de Dados","Cibersegurança","Suporte Técnico","Dev QA"],form:["Curso básico de informática / lógica","Técnico em Informática","Graduação: ADS, CC, SI"],links:[["Curso em Vídeo — grátis","https://www.cursoemvideo.com/"],["SENAI SC","https://www.sc.senai.br/"]]},
{cod:"A02",nome:"Engenharia e Indústria",icone:"🏭",tags:["pratico","previsivel","equipe"],desc:"Projeto, construção e otimização de estruturas, máquinas e processos.",comp:["cálculo","visão sistêmica","planejamento técnico","qualidade"],perfil:"Prático e metódico. Gosta de entender como as coisas funcionam.",carreiras:["Engenheiro Mecânico","Técnico em Eletrotécnica","Projetista","Supervisor de Manufatura"],form:["Matemática básica + desenho técnico","Técnico em Mecânica/Eletrotécnica","Engenharias"],links:[["SENAI","https://www.sc.senai.br/"]]},
{cod:"A03",nome:"Saúde",icone:"🩺",tags:["equipe","pessoas","previsivel"],desc:"Prevenção, cuidado e bem-estar físico e mental das pessoas.",comp:["empatia","atenção a detalhes","decisão sob pressão","ética"],perfil:"Acolhedor e responsável. Vocação para cuidar.",carreiras:["Enfermagem","Fisioterapia","Nutrição","Psicologia","Técnico em Enfermagem"],form:["Biologia + voluntariado","Técnico em Enfermagem","Graduação na saúde"],links:[["Fiocruz","https://www.fiocruz.br/"]]},
{cod:"A04",nome:"Administração e Gestão",icone:"📊",tags:["equipe","lideranca","organizacao"],desc:"Planejam e organizam pessoas, recursos e processos.",comp:["liderança","planejamento","comunicação","gestão"],perfil:"Organizado e comunicativo. Gosta de coordenar e bater metas.",carreiras:["Administrador","Gerente de Projetos","RH","Empreendedor","Logística"],form:["Organização pessoal + Excel","Técnico em Administração","Administração"],links:[["SEBRAE","https://www.sebrae.com.br/"]]},
{cod:"A05",nome:"Direito e Ciências Sociais",icone:"⚖️",tags:["pessoas","questionador","previsivel"],desc:"Leis, direitos, sociedade e comportamento humano.",comp:["argumentação","leitura crítica","negociação","ética"],perfil:"Questionador e observador. Se interessa por justiça e sociedade.",carreiras:["Advogado","Assistente Social","Sociólogo","Mediador","Perito"],form:["Leitura + debate","Técnico / curso social","Direito / Ciências Sociais"],links:[["Planalto – Leis","https://www.planalto.gov.br/"]]},
{cod:"A06",nome:"Educação",icone:"📚",tags:["equipe","pessoas","paciente"],desc:"Ensinam e desenvolvem pessoas na escola e na comunidade.",comp:["didática","comunicação clara","paciência","planejamento"],perfil:"Paciente e motivador. Gosta de ver o outro evoluir.",carreiras:["Professor","Pedagogo","Instrutor","Tutor EAD","Educador Social"],form:["Monitoria / reforço","Magistério / cursos livres","Pedagogia / Licenciaturas"],links:[["MEC","https://www.gov.br/mec/"]]},
{cod:"A07",nome:"Comunicação e Marketing",icone:"📣",tags:["equipe","pessoas","dinamico","criativo"],desc:"Criam mensagens, marcas e conexão com públicos.",comp:["escrita persuasiva","criatividade","mídias digitais","storytelling"],perfil:"Extrovertido e criativo. Ligado em tendências.",carreiras:["Jornalista","Social Media","Marketing Digital","Vídeomaker","Copywriter"],form:["Criar conteúdo / celular","Cursos de marketing","Comunicação / Publicidade"],links:[["SEBRAE Marketing","https://www.sebrae.com.br/"]]},
{cod:"A08",nome:"Design e Criatividade",icone:"🎨",tags:["individual","criativo","dinamico"],desc:"Transformam ideias em soluções visuais e funcionais.",comp:["senso estético","ferramentas de criação","originalidade","detalhes"],perfil:"Imaginativo e sensível. Valoriza expressão e liberdade.",carreiras:["Designer Gráfico","UX/UI","Ilustrador","Fotógrafo","Moda"],form:["Desenho / Canva / Figma","Cursos de design","Design / Arquitetura"],links:[["Canva DesignSchool","https://designschool.canva.com/"]]},
{cod:"A09",nome:"Ciências e Pesquisa",icone:"🔬",tags:["individual","logica","paciente"],desc:"Investigam a natureza e a sociedade com método científico.",comp:["pensamento científico","estatística","rigor","experimentação"],perfil:"Curioso e detalhista. Movido por descobrir o porquê.",carreiras:["Biólogo","Químico","Pesquisador","Lab / Dados","Professor Universitário"],form:["Feira de ciências","Técnico em laboratório","Ciências / Biologia / Física"],links:[["CNPq","https://www.gov.br/cnpq/"]]},
{cod:"A10",nome:"Finanças e Contabilidade",icone:"💰",tags:["individual","previsivel","organizacao"],desc:"Cuidam de dinheiro, contas, impostos e investimentos.",comp:["números","análise financeira","atenção","ética"],perfil:"Responsável e organizado. Confortável com números e normas.",carreiras:["Contador","Analista Financeiro","Auditor","Economista","Banco"],form:["Matemática financeira básica","Técnico em Contabilidade","Contábeis / Economia"],links:[["Banco Central – Educação Financeira","https://www.bcb.gov.br/cidadaniafinanceira/"]]},
{cod:"A11",nome:"Meio Ambiente e Agro",icone:"🌱",tags:["campo","pratico","equipe"],desc:"Produção rural e soluções sustentáveis para natureza.",comp:["ecossistemas","sustentabilidade","campo","legislação ambiental"],perfil:"Conectado à natureza, prático e de visão longa.",carreiras:["Agrônomo","Veterinário","Gestor Ambiental","Técnico Agrícola","Sustentabilidade"],form:["Horta / campo / voluntariado","Técnico Agrícola","Agronomia / Ambiental"],links:[["Embrapa","https://www.embrapa.br/"]]},
{cod:"A12",nome:"Turismo, Hotelaria e Gastronomia",icone:"🍳",tags:["equipe","pessoas","dinamico"],desc:"Hospitalidade, viagens, eventos e alimentação.",comp:["atendimento","idiomas","eventos","culinária"],perfil:"Sociável e atencioso. Gosta de receber bem.",carreiras:["Chef","Guia de Turismo","Hotelaria","Eventos","Confeiteiro"],form:["Cozinhar / receber / idiomas","Cursos de culinária / turismo","Gastronomia / Turismo"],links:[["SENAC","https://www.sc.senac.br/"]]}
];

const ESCALA_INTERESSE = ["Nada a ver comigo","Tem um pouco a ver","Neutro / não sei","Gosto bastante","Amo / quero muito"];
const ESCALA_HAB = ["Nunca fiz","Só vi de longe","Já fiz o básico","Sei fazer bem","Faço sempre / ensino outros"];

/* Cada pergunta pode pontuar até 3 áreas (RF15). peso 1-3 */
const PERGUNTAS = [
// ETAPA 1 — INTERESSES (12)
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
// ETAPA 2 — HABILIDADES (10)
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
// ETAPA 3 — COMPETÊNCIAS (8 situacionais, todas as 12 áreas cobertas)
{id:"c1",etapa:3,tipo:"multi",txt:"Na escola, quando o grupo trava, você:",opts:["Organizo e divido tarefas",["A04",3,"A02",1],"Dou ideia diferente que destrava",["A08",3,"A07",2],"Explico com calma até todos entenderem",["A06",3,"A03",1],"Analiso dados e fatos para decidir",["A01",3,"A09",2,"A10",1]]},
{id:"c2",etapa:3,tipo:"multi",txt:"Sob pressão (prova, entrega), você:",opts:["Mantém calma e cuida do time",["A03",3,"A06",1],"Foca no passo a passo e organiza",["A04",2,"A10",2],"Improvisa de jeito criativo",["A08",3,"A07",2],"Divide o problema em partes lógicas",["A01",3,"A09",2]]},
{id:"c3",etapa:3,tipo:"multi",txt:"O que as pessoas mais elogiam em você?",opts:["Comunicação",["A07",3,"A06",2],"Criatividade",["A08",3,"A12",1],"Organização",["A04",3,"A10",2],"Cuidado com os outros e com o ambiente",["A03",3,"A11",2]]},
{id:"c4",etapa:3,tipo:"multi",txt:"Prefere resolver problema como?",opts:["Testando e ajustando na prática",["A02",3,"A11",1],"Pesquisando a fundo",["A09",3,"A03",1],"Conversando e negociando",["A05",3,"A04",1],"Criando algo novo do zero",["A08",3,"A07",1]]},
{id:"c5",etapa:3,tipo:"multi",txt:"Em um trabalho, seu ponto forte é:",opts:["Liderar e distribuir",["A04",3,"A05",1],"Criar a parte visual",["A08",3,"A07",1],"Cuidar das pessoas",["A03",3,"A06",2],"Cuidar dos números e prazos",["A10",3,"A02",1]]},
{id:"c6",etapa:3,tipo:"multi",txt:"Se pudesse passar a tarde em uma oficina, seria de:",opts:["Programação e games",["A01",3,"A09",1],"Cozinha, hotel e evento",["A12",3,"A03",1],"Arte, design e foto",["A08",3,"A07",1],"Campo, natureza e laboratório",["A11",3,"A02",1]]},
{id:"c7",etapa:3,tipo:"multi",txt:"Quando erra, você:",opts:["Assume, ajusta e segue",["A04",2,"A02",2],"Pede ajuda e aprende",["A06",3,"A03",1],"Transforma o erro em ideia nova",["A08",3,"A07",1],"Investiga a causa raiz",["A09",3,"A01",2]]},
{id:"c8",etapa:3,tipo:"multi",txt:"Em discussão sobre tema social ou ambiental, você:",opts:["Defende com argumentos",["A05",3,"A04",1],"Escuta e media o grupo",["A06",2,"A03",2],"Traz dado e fato",["A09",2,"A10",2],"Propõe solução prática e sustentável",["A02",2,"A11",3]]},
// PREFERÊNCIAS (filtro/desempate RF16/RF28 — não somam — 4 alternativas cada)
{id:"p1",etapa:3,tipo:"pref",txt:"Prefiro trabalhar:",opts:["Sozinho(a), no meu ritmo","Em equipe, com gente junto","Misto: parte sozinho, parte em grupo","Tanto faz"]},
{id:"p2",etapa:3,tipo:"pref",txt:"Ambiente ideal:",opts:["Dinâmico, muda todo dia","Previsível, organizado","Ao ar livre / prático","Tanto faz"]},
{id:"p3",etapa:3,tipo:"pref",txt:"Contato com pessoas:",opts:["O dia todo, adoro","Pouco, prefiro bastidor","Só quando precisa","Tanto faz"]},
{id:"p4",etapa:3,tipo:"pref",txt:"Onde me vejo melhor:",opts:["Escritório / computador","Campo / prática / rua","Com pessoas / palco / atendimento","Tanto faz"]}
];

const SIMULADOS = {
generico:{titulo:"Simulado Geral — Processos Seletivos",area:"Geral",etapas:["Triagem de currículo (leitura)","Avaliação inicial (interativa)","Dinâmica em grupo (leitura)","Entrevista (leitura)"],questoes:[
{q:"No currículo, o ideal para quem está no ensino médio é:",o:["Colocar objetivo claro, contato e experiências mesmo que informais","Encher de cursos falsos","Colocar foto de festa e apelido","Deixar sem contato"],c:0,e:"Objetivo + contato + experiências reais (escola, voluntariado, bico) já contam muito."},
{q:"Na triagem, o recrutador olha primeiro:",o:["Erros de português e falta de clareza","Cor da fonte","Quantidade de páginas","Signo"],c:0,e:"Currículo claro e sem erro passa da triagem."},
{q:"Recebeu um e-mail com entrevista marcada. Você:",o:["Confirma, pesquisa a empresa e chega 15min antes","Vai de qualquer jeito sem pesquisar","Falta sem avisar","Leva um amigo junto sem avisar"],c:0,e:"Confirmar + pesquisar + pontualidade mostra responsabilidade."},
{q:"Pergunta: 'Me fale sobre você'. Melhor resposta:",o:["Resumo de 1min: quem sou, o que sei, o que quero aprender","Contar a vida toda desde criança","Dizer 'não sei' e ficar em silêncio","Falar mal da escola antiga"],c:0,e:"Pitch curto e honesto funciona."},
{q:"Pergunta: 'Qual seu ponto a melhorar?' Evite:",o:["Dizer 'sou perfeccionista' de forma ensaiada sem exemplo","Ser honesto com exemplo e plano de melhora","Citar algo real que está desenvolvendo","Mostrar autoconhecimento"],c:0,e:"Resposta genérica sem exemplo enfraquece."},
{q:"Em dinâmica em grupo, o avaliador observa:",o:["Escuta, cooperação e respeito à vez","Quem grita mais","Quem fica calado no canto","Quem critica os outros"],c:0,e:"Colaboração > competição."},
{q:"Colega discorda de você na dinâmica. Você:",o:["Escuta, pondera e propõe um meio-termo","Interrompe e impõe","Desiste na hora","Ri e ignora"],c:0,e:"Negociação respeitosa pontua."},
{q:"Teste: sobram 10min e 5 questões. Você:",o:["Prioriza as que sabe e chuta o resto com calma","Trava na primeira","Entrega em branco","Copia do lado"],c:0,e:"Gestão do tempo é competência avaliada."},
{q:"E-mail profissional deve ter:",o:["Assunto claro, saudação, texto curto e assinatura","Só emoji","CAIXA ALTA TUDO","Sem assunto"],c:0,e:"Clareza e formalidade básica."},
{q:"Roupa para entrevista presencial:",o:["Limpa, neutra e adequada ao local","Chinelo e regata sempre","Fantasia","Uniforme da escola sujo"],c:0,e:"Apresentação conta, sem exagero."},
{q:"Após a entrevista, o certo é:",o:["Agradecer e aguardar o prazo combinado","Cobrar 10x no WhatsApp no mesmo dia","Sumir","Falar mal nas redes"],c:0,e:"Agradecer mostra profissionalismo."},
{q:"Se não passar, você:",o:["Pede feedback e continua tentando","Desiste de tudo","Briga com recrutador","Mente no próximo"],c:0,e:"Feedback vira evolução."},
{q:"No trabalho em equipe, conflito se resolve:",o:["Conversando com respeito e foco na tarefa","Fofocando","Ignorando até explodir","Saindo do grupo"],c:0,e:"Comunicação direta e respeitosa."},
{q:"Pontualidade significa:",o:["Chegar 10-15min antes, avisar se atrasar","Chegar quando der","Atrasar sempre","Só chefe precisa ser pontual"],c:0,e:"Pontualidade é confiança."},
{q:"LGPD / seus dados no processo:",o:["Só passe o necessário e desconfie de pedido estranho","Passe senha do banco","Envie documento para qualquer link","Compartilhe tudo"],c:0,e:"Proteja seus dados."}
]},
tec:{titulo:"Simulado — Tecnologia (Suporte / Dev Jr)",area:"A01",etapas:["Triagem (leitura)","Teste técnico (interativo)","Entrevista técnica (leitura)"],questoes:[
{q:"Cliente diz 'minha internet caiu'. Primeiro passo do suporte:",o:["Perguntar o que aparece na tela e se outros aparelhos funcionam","Mandar formatar","Dizer que é vírus sem ver","Pedir para comprar outro roteador"],c:0,e:"Diagnóstico começa pelo sintoma + isolamento."},
{q:"Senha forte é:",o:["Longa, única, com letras/números/símbolos + 2FA","123456","Seu nome + data","Mesma para tudo"],c:0,e:"Unicidade + tamanho + 2FA."},
{q:"O que é phishing?",o:["Golpe que se passa por empresa para roubar dados","Tipo de peixe","Antivírus"," Cabo de rede"],c:0,e:"Desconfie de link urgente pedindo senha."},
{q:"Computador lento. Ação segura:",o:["Ver programas iniciando junto e espaço em disco","Apagar pasta System32","Baixar 'otimizador' pirata","Abrir 20 abas a mais"],c:0,e:"Startup + disco + malware real."},
{q:"Backup 3-2-1 significa:",o:["3 cópias, 2 mídias, 1 fora do local","3 senhas iguais","2 antivírus juntos","1 HD só"],c:0,e:"Redundância salva."},
{q:"HTML, CSS e JS servem para:",o:["Estrutura, estilo e interação da página","Só hacker usa","Imprimir boleto","Vírus"],c:0,e:"Base do frontend."},
{q:"Bug que só acontece às vezes. Você:",o:["Anota passos, tenta reproduzir e registra print/log","Finge que não viu","Reinicia e esquece","Culpa o usuário"],c:0,e:"Reproduzir + evidência = QA bom."},
{q:"Git/commit serve para:",o:["Salvar versões e voltar se der erro","Acelerar internet","Limpar vírus","Hackear"],c:0,e:"Versionamento protege."},
{q:"Cliente bravo no chat. Você:",o:["Mantém calma, escuta e propõe passo a passo","Responde grosseiro","Some","Manda meme"],c:0,e:"Empatia + processo."},
{q:"LGPD no suporte: ao atender, você:",o:["Pede só dado necessário e não expõe senha","Pede CPF da família toda","Compartilha tela com senha visível","Anota senha em post-it público"],c:0,e:"Mínimo necessário."},
{q:"Rede wi-fi aberta em entrevista online:",o:["Evita; usa rede confiável + testa áudio/vídeo antes","Usa qualquer uma sem senha","Deixa microfone estourando","Entra dirigindo"],c:0,e:"Ambiente testa profissionalismo."},
{q:"Algoritmo simples: ordenar 3 números. Lógica é:",o:["Comparar e trocar até ordenar","Adivinhar","Somar tudo","Reiniciar PC"],c:0,e:"Comparação + troca."},
{q:"Dado sensível vazou. Primeiro:",o:["Avisar responsável e trocar senhas","Apagar tudo escondido","Postar no status","Ignorar"],c:0,e:"Transparência + contenção."},
{q:"Portfólio Jr sem experiência: vale:",o:["Projetos de curso + GitHub organizado","Nada, só diploma conta","Mentir experiência","Só certificado pago"],c:0,e:"Projeto real > certificado."},
{q:"Pergunta final: 'Por que tecnologia?' Boa resposta:",o:["Exemplo real do que já fez + o que quer aprender","'Porque dá dinheiro' seco","'Não sei'","Falar mal de outra área"],c:0,e:"Exemplo + vontade de aprender."}
]},
saude:{titulo:"Simulado — Saúde (Apoio / Atendimento)",area:"A03",etapas:["Triagem (leitura)","Avaliação técnica e ética (interativa)","Entrevista (leitura)"],questoes:[
{q:"Paciente ansioso na recepção. Você:",o:["Acolhe com calma, explica o próximo passo","Ignora","Manda esperar sem info","Atende gritando"],c:0,e:"Acolhimento reduz ansiedade."},
{q:"Higiene das mãos: quando?",o:["Antes e depois de cada atendimento","Só no fim do dia","Nunca","Só se ver sujeira"],c:0,e:"Protocolo básico salva vidas."},
{q:"Dado de paciente no WhatsApp:",o:["Nunca compartilha sem autorização e usa canal oficial","Encaminha para grupo da família","Posta no status","Printa e guarda no celular"],c:0,e:"Sigilo é lei e ética."},
{q:"Queda com sangramento leve. Primeiro:",o:["Pressionar com gaze limpa e chamar responsável","Passar pasta de dente","Dar remédio qualquer","Sair correndo"],c:0,e:"Pressão + assepsia + avisar."},
{q:"Engasgo leve (consegue tossir). Você:",o:["Incentiva tossir e observa, sem bater forte","Dá soco nas costas","Dá água à força","Ignora"],c:0,e:"Tosse é o melhor mecanismo."},
{q:"Medicação: regra de ouro:",o:["Paciente, dose, hora, via e registro certos + sem automedicar","Dar o que tiver","Adivinhar dose","Pular registro"],c:0,e:"5 certos."},
{q:"Comunicação com idoso:",o:["Fala pausada, olho no olho, confirma entendimento","Grita","Usa termo técnico difícil","Fala só com acompanhante"],c:0,e:"Clareza + respeito."},
{q:"Resíduo perfurocortante vai em:",o:["Caixa rígida amarela (descarpack)","Lixo comum","Vaso","Bolso"],c:0,e:"Descarte correto evita acidente."},
{q:"Sinais vitais básicos incluem:",o:["Temperatura, pressão, pulso, respiração","Signo, altura do salto","Cor favorita","Time do coração"],c:0,e:"SSVV base."},
{q:"Trabalho em equipe na saúde exige:",o:["Passagem de plantão clara e sem omissão","Fofoca","Cada um por si","Esconder erro"],c:0,e:"Handoff salva."},
{q:"Estresse e burnout: prevenção é:",o:["Pausa, sono, apoio e falar quando passa do limite","Virar 24h sempre","Ignorar","Culpar paciente"],c:0,e:"Autocuidado é profissional."},
{q:"Consentimento: antes de procedimento simples, você:",o:["Explica e pede autorização","Faz sem avisar","Força","Grava sem permissão"],c:0,e:"Autonomia do paciente."},
{q:"Queda de idoso em casa: orientação é:",o:["Ambiente sem tapete solto, luz e apoio","Deixar tudo escorregadio","Trancar no quarto","Nada muda"],c:0,e:"Prevenção domiciliar."},
{q:"Emergência real (desmaio). Primeiro:",o:["Ver segurança, chamar ajuda e SAMU 192","Jogar água gelada e sacudir","Arrastar sozinho","Filmar"],c:0,e:"Cena segura + ajuda."},
{q:"Por que quer saúde? Boa resposta:",o:["Exemplo de cuidado real + vontade de estudar a área","'Dá status'","'Mandaram eu fazer'","Falar mal de paciente"],c:0,e:"Vocação + preparo."}
]}
};

const MATERIAIS = {
curriculo:{titulo:"Currículo — passo a passo",itens:["Cabeçalho: nome, cidade/UF, telefone, e-mail profissional","Objetivo em 1 linha (ex: Jovem Aprendiz – Atendimento)","Resumo: 2 linhas com o que você já faz bem","Experiências mesmo informais: bico, voluntariado, escola, igreja","Educação: escola, série, cursos com carga horária","Habilidades: Canva, Excel, comunicação, pontualidade","Evite: erro de português, foto de festa, mentira, 3 páginas","Modelo de 1 página pronto para copiar na escola/lan house"]},
redacao:{titulo:"Redação — estrutura que passa",itens:["Introdução: tema + sua tese em 3 linhas","2 parágrafos de argumento com exemplo real","Conclusão com proposta (quem faz o quê)","Conectivos: além disso, porém, portanto, por fim","Revise: ortografia, crase e repetição","Treine 1 redação/semana com tema de processo seletivo"]}};

const PESOS = {interesse:0.35, habilidade:0.35, competencia:0.20};

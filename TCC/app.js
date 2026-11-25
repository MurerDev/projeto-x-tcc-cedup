/* Projeto X — TCC CEDUP 2026 · app.js
 * Frontend consome a API (server.js). Se a API não responder, usa localStorage
 * apenas para não travar a demonstração no localhost.
 */
const API = location.protocol === 'file:' ? '' : ''; // mesma origem
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toastEl=$('#toast');let toastT;function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),2600)}

/* ---------------- API ---------------- */
let token=localStorage.getItem('px_token')||'';
let apiOnline=false;
async function api(path,opt={}){
  const r=await fetch(API+path,{...opt,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(opt.headers||{})}});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.erro||('Erro '+r.status));
  return j;
}
async function health(){try{const j=await fetch(API+'/api/health');apiOnline=j.ok;return j.ok}catch{apiOnline=false;return false}}

/* ---------------- Auth local (fallback) ---------------- */
const DB={read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write(k,v){localStorage.setItem(k,JSON.stringify(v))}};
let localUsers=DB.read('px_users',[]), localSession=DB.read('px_session',null);
async function localHash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('px::'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return 'f'+h}}
const me=()=>apiOnline?apiOnlineUser:(localUsers.find(u=>u.usernameLower===(localSession?.usernameLower||''))||null);
let apiOnlineUser=null;

async function login(u,p){
  if(apiOnline){const j=await api('/api/auth/login',{method:'POST',body:JSON.stringify({username:u,senha:p})});token=j.token;localStorage.setItem('px_token',token);apiOnlineUser=j.usuario;return j.usuario}
  const f=localUsers.find(x=>x.usernameLower===u.toLowerCase());if(!f||f.passHash!==await localHash(p))throw new Error('Usuário ou senha inválidos');
  localSession={usernameLower:f.usernameLower};DB.write('px_session',localSession);return f;
}
async function cadastrar(nome,u,p,idade,cidade){
  if(apiOnline){const j=await api('/api/auth/cadastrar',{method:'POST',body:JSON.stringify({nome,username:u,senha:p,idade,cidade})});token=j.token;localStorage.setItem('px_token',token);apiOnlineUser=j.usuario;return j.usuario}
  if(localUsers.some(x=>x.usernameLower===u.toLowerCase()))throw new Error('Username em uso');
  const h=await localHash(p);const usr={nome,username:u,usernameLower:u.toLowerCase(),passHash:h,idade,cidade,createdAt:Date.now()};localUsers.push(usr);DB.write('px_users',localUsers);localSession={usernameLower:usr.usernameLower};DB.write('px_session',localSession);return usr;
}
async function logout(){try{if(apiOnline)await api('/api/auth/logout',{method:'POST'})}catch{} token='';localStorage.removeItem('px_token');apiOnlineUser=null;localSession=null;DB.write('px_session',null)}

/* ---------------- Dados / pilares ---------------- */
const PILAR_NOMES={1:'Interesses',2:'Habilidades',3:'Competências',4:'Preferências'};
const PILAR_TOTAL={1:12,2:10,3:8,4:4};
let J={idx:0,ans:{},perguntas:[],finished:false,etapa:1};
let Q_SEL=null; // guarda o id da pergunta selecionada

/* Faz o bonequinho andar até a próxima estação antes de trocar de pergunta */
function caminhar(callback){
  const char=$('#gameCharacter');
  if(!char){callback();return}
  const dots=$$('.path-dot');
  const alvo=dots[Math.min(J.idx+1,dots.length-1)];
  char.classList.add('walking');
  if(alvo){
    char.style.transition='left .65s ease-in-out';
    char.style.left=alvo.offsetLeft+'px';
  }
  setTimeout(()=>{char.classList.remove('walking');callback()},700);
}
const ordemEtapas=[1,2,3,4];

function montarPerguntas(){J.perguntas=ordemEtapas.flatMap(e=>PERGUNTAS.filter(q=>q.etapa===e));J.etapa=1}

function etapaDoIndice(i){let a=0;for(const e of ordemEtapas){const n=PILAR_TOTAL[e];if(i<a+n)return e;a+=n}return 4}
function posDoIndice(i){let a=0;for(const e of ordemEtapas){const n=PILAR_TOTAL[e];if(i<a+n)return i-a+1;a+=n}return 1}

/* ---------------- Navegação ---------------- */
function go(view){
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===view));
  $$('#menu a').forEach(a=>a.classList.toggle('active',a.dataset.go===view));
  $('#menu').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
  if(view==='areas')renderAreasFull();
  if(view==='simulado')renderSimList();
  if(view==='materiais')renderMat();
  if(view==='historico')renderHist();
  if(view==='conta')renderConta();
  if(view==='jogo')prepararJogo();
  if(view==='inicio')renderAreasPreview();
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();const v=g.dataset.go;if(['resultado','historico','conta','simulado'].includes(v)&&!me()){go('conta');toast('Entre ou crie sua conta');return}go(v)}
});
$('#hamburger').onclick=()=>$('#menu').classList.toggle('open');
$('#btnHome').onclick=e=>{e.preventDefault();go('inicio')};
$('#btnConta').onclick=e=>{e.preventDefault();go(me()?'conta':'conta')};

/* ---------------- Áreas ---------------- */
function areaCard(a,pct,idx){const n=idx!=null?String(idx+1).padStart(2,'0'):a.cod;return `<div class="area-card" data-area="${a.cod}"><span class="area-idx">${n}</span><span class="area-cod">${a.cod}</span><h3>${a.nome}</h3><p>${a.desc}</p>${pct!=null?`<p class="pct">${pct.toFixed(1)}% — ver trilha</p>`:`<p class="link-more">abrir ficha</p>`}</div>`}
function renderAreasPreview(){$('#areasPreview').innerHTML=AREAS.map((a,i)=>areaCard(a,null,i)).join('')}
function renderAreasFull(){$('#areasFull').innerHTML=AREAS.map((a,i)=>areaCard(a,null,i)).join('')}
document.addEventListener('click',e=>{const c=e.target.closest('[data-area]');if(c)openTrilha(c.dataset.area)});

function openTrilha(cod){
  const a=AREAS.find(x=>x.cod===cod);const m=me();
  let v=0;if(m){const r=DB.read('px_lastResult',null);if(r&&r.scores)v=r.scores[cod]||0}
  const nivel=v>=75?'avançado — aperfeiçoar':'exploração — conhecer e desenvolver';
  const passos=nivel.startsWith('avançado')?['Aprofunde com projeto real/portfólio','Curso técnico ou graduação na área','Pratique com simulado + voluntariado','Prepare currículo e LinkedIn básico']:['Experimente grátis (vídeo + mini-projeto de 1 semana)','Curso básico/introdutório (SENAI/SEBRAE/Curso em Vídeo)','Converse com alguém da área + visite local','Refaça o questionário em 1 mês e compare'];
  $('#trilhaBox').innerHTML=`<span class="kicker">${a.cod} · ${v?v.toFixed(1)+'% compatível':'área explorada'}</span><h2 class="sec-title">${a.cod} - ${a.nome}</h2><p class="sec-sub">${a.desc}</p>
  <div class="panel"><h3>Perfil que combina</h3><p>${a.perfil}</p><p><strong>Competências:</strong> ${a.comp.join(', ')}</p><p><strong>Carreiras:</strong> ${a.carreiras.join(' / ')}</p></div>
  <div class="panel"><h3>Trilha sugerida: ${nivel}</h3>${passos.map((p,i)=>`<div class="trilha-step"><strong>${i+1}.</strong> ${p}</div>`).join('')}<h3>Formação possível</h3><p>${a.form.join(' | ')}</p><h3>Links</h3>${a.links.map(([t,u])=>`<a class="ext-link" href="${u}" target="_blank" rel="noopener">${t}</a>`).join('')}</div>
  <p class="form-hint">Trilha informativa do MVP. Simulado não altera a trilha.</p>`;
  go('trilha');
}

/* ---------------- Joguinho ---------------- */
async function prepararJogo(){
  montarPerguntas();
  let prog=null;
  if(me()){
    try{if(apiOnline){prog=await api('/api/progresso')}else{prog=DB.read('px_progresso',null)}
    }catch(e){prog=null}
  }
  const box=$('#retomarBox');
  if(prog && !prog.finalizado && prog.idx>0){
    box.hidden=false;
    $('#retomarInfo').textContent=`Você parou na pergunta ${prog.idx} de ${J.perguntas.length} (${new Date(prog.atualizado_em||Date.now()).toLocaleString('pt-BR')}).`;
    J.idx=prog.idx; J.ans=prog.respostas||{};
  }else if(prog && prog.finalizado){
    box.hidden=true; J.idx=0; J.ans={};
  }else{
    box.hidden=true; J.idx=0; J.ans={};
  }
  J.finished=false; J.etapa=etapaDoIndice(J.idx);
  renderJogo();
}

async function salvarProgresso(finalizado=false){
  if(!me())return;
  const body={idx:J.idx,etapa:J.etapa,respostas:J.ans,finalizado};
  try{if(apiOnline){await api('/api/progresso',{method:'PUT',body:JSON.stringify(body)})}else{DB.write('px_progresso',body)}}catch(e){DB.write('px_progresso',body)}
}

function renderJogo(){
  $('#gameEtapa').textContent=J.finished?J.perguntas.length:J.idx+1;
  $('#gameTotal').textContent=J.perguntas.length;
  $('#gamePilar').textContent=PILAR_NOMES[J.etapa]||'';
  $('#gameProgress').style.width=J.finished?'100%':Math.round((J.idx/J.perguntas.length)*100)+'%';
  const pts=$('#pathPoints');pts.innerHTML='';
  for(let i=0;i<J.perguntas.length;i++){const d=document.createElement('div');d.className='path-dot'+(i<J.idx?' done':i===J.idx?' active':'');pts.appendChild(d)}
  const char0=$('#gameCharacter'),dots0=$$('.path-dot');
  if(char0&&dots0[J.idx]){char0.style.transition='none';char0.style.left=dots0[J.idx].offsetLeft+'px';char0.style.top='-52px'}
  const card=$('#gameCard');
  if(J.finished){
    card.innerHTML=`<div class="card-header"><span class="card-pilar">Jogo concluído!</span><span class="card-num">Você respondeu tudo</span></div><div class="card-txt">Parabéns, você chegou ao final! 🎉</div><div class="card-nav"><button class="btn-primary" id="btnFinalizarJogo">Ver meu resultado →</button></div>`;
    $('#btnFinalizarJogo').onclick=async()=>{const r=calc();await salvarResultado(r);exibirResultado(r)};
    return;
  }
  const q=J.perguntas[J.idx];const pos=posDoIndice(J.idx);
  $('#quizStatus').textContent=`ETAPA ${J.etapa}/4 · ${PILAR_NOMES[J.etapa].toUpperCase()}`;
  let html=`<div class="card-header"><span class="card-pilar">${PILAR_NOMES[J.etapa]}</span><span class="card-num">Pergunta ${pos} de ${PILAR_TOTAL[J.etapa]}</span></div><h3 class="card-txt">${q.txt}</h3><div class="card-options">`;
  if(q.tipo==='pref'){q.opts.forEach((o,i)=>{html+=`<label class="${J.ans[q.id]===i?'sel':''}"><input type="radio" name="q" value="${i}" ${J.ans[q.id]===i?'checked':''}/> ${o}</label>`})}
  else{const esc=J.etapa===1?['Nada a ver comigo','Tem um pouco a ver','Neutro / não sei','Gosto bastante','Amo / quero muito']:['Nunca fiz','Só vi de longe','Já fiz o básico','Sei fazer bem','Faço sempre / ensino outros'];
    esc.forEach((o,i)=>{html+=`<label class="${J.ans[q.id]===i?'sel':''}"><input type="radio" name="q" value="${i}" ${J.ans[q.id]===i?'checked':''}/> <b>${i}</b> — ${o}</label>`})}
  html+='</div><div class="card-nav"><button class="btn-ghost dark" id="btnVoltar">← Voltar</button><button class="btn-primary" id="btnProximo">Próxima →</button></div>';
  card.innerHTML=html;
  $$('#cardOptions, #gameCard').forEach(()=>{});
  $$('#gameCard input').forEach(r=>r.onchange=()=>{J.ans[q.id]=parseInt(r.value);Q_SEL=q.id;$$('#gameCard label').forEach(l=>l.classList.remove('sel'));r.closest('label').classList.add('sel');salvarProgresso()});
  const bv=$('#btnVoltar');if(bv)bv.onclick=()=>{if(J.idx>0){J.idx--;J.etapa=etapaDoIndice(J.idx);renderJogo();salvarProgresso()}};
  const bp=$('#btnProximo');if(bp)bp.onclick=()=>{const qq=J.perguntas[J.idx];if(J.ans[qq.id]===undefined){toast('Responda antes de andar');return}caminhar(()=>{J.idx++;J.etapa=etapaDoIndice(J.idx);if(J.idx>=J.perguntas.length){J.finished=true;salvarProgresso(true)}renderJogo();salvarProgresso(J.finished)})};
}

/* botões fixos do topo do joguinho */
document.addEventListener('click',e=>{
  if(e.target.id==='btnProximoTopo'){const bp=$('#btnProximo');if(bp)bp.click()}
  if(e.target.id==='btnVoltarTopo'){const bv=$('#btnVoltar');if(bv)bv.click()}
  if(e.target.id==='btnContinuar'){$('#retomarBox').hidden=true}
  if(e.target.id==='btnRecomecar'){J.idx=0;J.ans={};J.etapa=1;J.finished=false;$('#retomarBox').hidden=true;renderJogo();salvarProgresso()}
});

/* ---------------- Cálculo ---------------- */
function normAlvos(alvos){const out=[];if(!alvos)return out;for(const a of alvos){if(Array.isArray(a)&&a.length===2&&typeof a[0]==='string')out.push([a[0],a[1]]);else if(typeof a==='string')out.push([a,alvos[alvos.indexOf(a)+1]||1])}return out}
function flatScoreDef(def){const out=[];for(let i=0;i<def.length;i+=2)out.push([def[i],def[i+1]||1]);return out}
function calc(){
  const scores={};AREAS.forEach(a=>scores[a.cod]={i:0,imax:0,h:0,hmax:0,c:0,cmax:0});
  for(const q of PERGUNTAS){
    const v=J.ans[q.id];if(v===undefined||v===-1||q.tipo==='pref')continue;
    if(q.tipo==='multi'){const def=q.opts[v*2+1];if(!Array.isArray(def))continue;const pares=flatScoreDef(def);
      for(const [ar,peso] of pares){if(scores[ar])scores[ar].c+=4*peso}
      const areasNaQ=new Set();q.opts.forEach((o,idx)=>{if(idx%2===1&&Array.isArray(o)){for(let k=0;k<o.length;k+=2)areasNaQ.add(o[k])}});
      areasNaQ.forEach(ar=>{let mp=0;q.opts.forEach((o,idx)=>{if(idx%2===1&&Array.isArray(o)){for(let k=0;k<o.length;k+=2){if(o[k]===ar)mp=Math.max(mp,o[k+1]||1)}}});if(scores[ar])scores[ar].cmax+=4*mp});
      continue}
    const pares=normAlvos(q.alvos);for(const [area,peso] of pares){const max=4*peso;if(!scores[area])continue;if(q.etapa===1){scores[area].i+=v*peso;scores[area].imax+=max}else if(q.etapa===2){scores[area].h+=v*peso;scores[area].hmax+=max}else{scores[area].c+=v*peso;scores[area].cmax+=max}}
  }
  const prefs=[J.ans.p1,J.ans.p2,J.ans.p3,J.ans.p4];const final={};
  for(const a of AREAS){const s=scores[a.cod];const pi=s.imax?s.i/s.imax:0,ph=s.hmax?s.h/s.hmax:0,pc=s.cmax?s.c/s.cmax:0;final[a.cod]=((pi*PESOS.interesse+ph*PESOS.habilidade+pc*PESOS.competencia)/(PESOS.interesse+PESOS.habilidade+PESOS.competencia))*100}
  let rank=Object.entries(final).sort((a,b)=>b[1]-a[1]);
  rank.sort((x,y)=>{if(Math.abs(y[1]-x[1])>0.5)return y[1]-x[1];const px=prefScore(x[0],prefs),py=prefScore(y[0],prefs);if(py!==px)return py-px;return x[0].localeCompare(y[0])});
  return{scores:final,rank,prefs}
}
function prefScore(cod,prefs){const a=AREAS.find(x=>x.cod===cod);if(!a)return 0;let s=0;const[p1,p2,p3,p4]=prefs||[];
if(p1===1&&a.tags.includes('equipe'))s++;if(p1===0&&a.tags.includes('individual'))s++;
if(p2===0&&a.tags.includes('dinamico'))s++;if(p2===1&&a.tags.includes('previsivel'))s++;if(p2===2&&(a.tags.includes('campo')||a.tags.includes('pratico')))s++;
if(p3===0&&a.tags.includes('pessoas'))s++;if(p3===1&&a.tags.includes('individual'))s++;
if(p4===0&&(a.tags.includes('logica')||a.tags.includes('organizacao')))s++;if(p4===1&&(a.tags.includes('campo')||a.tags.includes('pratico')))s++;if(p4===2&&a.tags.includes('pessoas'))s++;return s}

/* ---------------- Resultado ---------------- */
async function salvarResultado(r){
  const top=r.rank[0];
  DB.write('px_lastResult',r);
  if(!me())return;
  try{if(apiOnline){await api('/api/resultado',{method:'POST',body:JSON.stringify({scores:r.scores,prefs:r.prefs,topArea:top[0]})})}else{const arr=DB.read('px_results',[]);arr.unshift({data:new Date().toISOString(),scores:r.scores,prefs:r.prefs,top});DB.write('px_results',arr.slice(0,5))}
  }catch(e){}
}
async function exibirResultado(r){
  const top=Object.entries(r.scores).sort((a,b)=>b[1]-a[1]);
  const main=top.filter(([_,v])=>v>=60),mid=top.filter(([_,v])=>v>=40&&v<60);
  $('#resDate').textContent='Tentativa de '+new Date().toLocaleString('pt-BR');
  $('#resTitle').textContent=top[0][0]+' — '+AREAS.find(a=>a.cod===top[0][0]).nome;
  $('#resTop').innerHTML=main.length?main.map(([c,v])=>{const a=AREAS.find(x=>x.cod===c);return `<div class="res-card"><span class="area-cod">${a.cod}</span><div style="flex:1"><strong>${a.nome}</strong><div class="bar"><i style="width:${v}%"></i></div></div><span class="pct">${v.toFixed(1)}%</span><button class="btn-primary" data-area="${c}">Ver trilha</button></div>`}).join(''):'<p class="sec-sub">Nenhuma área acima de 60%.</p>';
  $('#resMore').innerHTML=mid.length?mid.map(([c,v])=>{const a=AREAS.find(x=>x.cod===c);return `<div class="res-card"><span class="area-cod">${a.cod}</span><div style="flex:1"><strong>${a.nome}</strong><div class="bar"><i style="width:${v}%"></i></div></div><span class="pct">${v.toFixed(1)}%</span><button class="btn-ghost dark" data-area="${c}">Trilha</button></div>`}).join(''):'<p class="sec-sub">Nada entre 40 e 59%.</p>';
  $('#resExplain').textContent=`Cálculo: interesses 35% + habilidades 35% + competências 20%. Preferências desempatam. Abaixo de 40% não exibimos. Maior: ${AREAS.find(a=>a.cod===top[0][0]).nome} (${top[0][1].toFixed(1)}%).`;
  drawChart(r.scores);
  $('#btnVerMais').onclick=()=>{const m=$('#resMore');m.hidden=!m.hidden;$('#btnVerMais').textContent=m.hidden?'Ver mais (40 a 59%)':'Ocultar'};
  go('resultado');
}
function drawChart(scores){const cv=$('#chartCanvas');if(!cv||!scores)return;const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);const top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,6);const bw=(W-40)/top.length;ctx.font='11px monospace';top.forEach(([c,v],i)=>{const h=(H-52)*(v/100);const x=20+i*bw;ctx.fillStyle='#141A26';ctx.fillRect(x,H-32-h,Math.max(10,bw-16),h);ctx.fillStyle='#1D3FD1';ctx.fillRect(x,H-32-h,Math.max(10,bw-16),5);ctx.fillStyle='#141A26';ctx.fillText(c,x,H-14);ctx.fillText(v.toFixed(0)+'%',x,H-32-h-6)})}

/* ---------------- Simulado ---------------- */
let S={key:null,idx:0,ans:{}};
function renderSimList(){
  const m=me();const auto=(()=>{const r=DB.read('px_lastResult',null);const top=r?.rank?.[0]?.[0];if(top==='A01')return 'tec';if(top==='A03')return 'saude';return 'generico'})();
  $('#simList').innerHTML=Object.entries(SIMULADOS).map(([k,s])=>`<div class="sim-opt" data-sim="${k}"><strong>${s.titulo}</strong><p class="form-hint">${s.questoes.length} questões · ${k===auto?'⭐ recomendado':'conteúdo '+(k==='generico'?'geral':'da área')}</p><p class="form-hint">${s.etapas.join(' → ')}</p></div>`).join('');
  $('#simBox').innerHTML=`<div class="panel"><strong>Como funciona:</strong> só a etapa interativa tem perguntas (múltipla escolha, sem tempo). No fim: gabarito com explicação e resumo. Histórico: 5 tentativas.</div>`;
}
document.addEventListener('click',e=>{const s=e.target.closest('[data-sim]');if(s)startSim(s.dataset.sim)});
function startSim(k){S={key:k,idx:0,ans:{}};renderSimQ()}
function renderSimQ(){const sim=SIMULADOS[S.key];const q=sim.questoes[S.idx];$('#simBox').innerHTML=`<p class="etapas">Questão ${S.idx+1}/${sim.questoes.length} · ${sim.titulo}</p><div class="progress"><div class="progress-fill" style="width:${Math.round(S.idx/sim.questoes.length*100)}%"></div></div><div class="q"><h4>${q.q}</h4>${q.o.map((o,i)=>`<label class="${S.ans[S.idx]===i?'sel':''}"><input type="radio" name="sq" value="${i}" ${S.ans[S.idx]===i?'checked':''}/> ${o}</label>`).join('')}</div><div class="card-nav"><button class="btn-ghost dark" id="simBack">← Voltar</button><button class="btn-primary" id="simNext">${S.idx===sim.questoes.length-1?'Ver gabarito':'Próxima →'}</button></div>`;
  $$('#simBox input').forEach(r=>r.onchange=()=>{S.ans[S.idx]=parseInt(r.value);$$('#simBox label').forEach(l=>l.classList.remove('sel'));r.closest('label').classList.add('sel')});
  $('#simBack').onclick=()=>{if(S.idx>0){S.idx--;renderSimQ()}};
  $('#simNext').onclick=()=>{if(S.ans[S.idx]===undefined)return toast('Escolha uma alternativa');if(S.idx<sim.questoes.length-1){S.idx++;renderSimQ()}else finishSim()};
}
async function finishSim(){
  const sim=SIMULADOS[S.key];let ac=0;const det=sim.questoes.map((q,i)=>{const ok=S.ans[i]===q.c;if(ok)ac++;return{...q,got:S.ans[i],ok}});
  const pct=Math.round(ac/sim.questoes.length*100);
  if(me()){try{if(apiOnline)await api('/api/simulado',{method:'POST',body:JSON.stringify({modulo:S.key,acertos:ac,total:sim.questoes.length})});else{const arr=DB.read('px_sims',[]);arr.unshift({data:new Date().toISOString(),mod:S.key,acertos:ac,total:sim.questoes.length,pct});DB.write('px_sims',arr.slice(0,5))}}catch(e){}}
  $('#simBox').innerHTML=`<div class="panel"><h3>Resultado: ${ac}/${sim.questoes.length} (${pct}%)</h3><p>${pct>=70?'Mandou bem! Revise os erros.':pct>=40?'Leia as explicações e tente de novo.':'Releia o material e refaça.'}</p><p class="form-hint">O simulado não muda sua trilha — é treino.</p><div class="row2"><button class="btn-ghost dark" onclick="renderSimList()">Outro simulado</button><button class="btn-primary" data-go="materiais">Ver materiais →</button></div></div>`+det.map((d,i)=>`<div class="q ${d.ok?'correct':'wrong'}"><h4>${i+1}. ${d.q}</h4><p>Você: ${d.o[d.got]??'—'} ${d.ok?'✅':'❌'} · Certa: ${d.o[d.c]}</p><p class="form-hint">💡 ${d.e}</p></div>`).join('');
}

/* ---------------- Materiais / histórico ---------------- */
function renderMat(){$('#matBox').innerHTML=Object.values(MATERIAIS).map(m=>`<div class="panel"><h3>${m.titulo}</h3>${m.itens.map((t,i)=>`<div class="trilha-step"><strong>${i+1}.</strong> ${t}</div>`).join('')}</div>`).join('')}
async function renderHist(){
  const m=me();
  let quiz=[],sims=[];
  try{if(apiOnline){quiz=await api('/api/resultado');sims=await api('/api/simulado')}else{quiz=DB.read('px_results',[]).map(r=>({data:r.data,scores:r.scores,top:r.top}));sims=DB.read('px_sims',[])}
  }catch(e){quiz=DB.read('px_results',[]).map(r=>({data:r.data,scores:r.scores,top:r.top}));sims=DB.read('px_sims',[])}
  $('#histQuiz').innerHTML=quiz.length?quiz.map((r,i)=>{const top=Array.isArray(r.top)?r.top:[r.top_area,r.scores?.[r.top_area]||0];return `<div class="res-card"><div style="flex:1"><strong>${i===0?'Atual':'Tentativa '+(i+1)} — ${new Date(r.data||r.criado_em).toLocaleString('pt-BR')}</strong><p class="form-hint">Top: ${AREAS.find(a=>a.cod===top[0])?.nome} (${top[1].toFixed(1)}%)</p></div></div>`}).join(''):'<p class="sec-sub">Sem tentativas ainda.</p>';
  $('#histSim').innerHTML=sims.length?sims.map(s=>`<div class="res-card"><div style="flex:1"><strong>${SIMULADOS[s.mod||s.modulo]?.titulo||s.mod||s.modulo}</strong><p class="form-hint">${new Date(s.data||s.criado_em).toLocaleString('pt-BR')} — ${s.acertos}/${s.total}</p></div><span class="pct">${s.pct}%</span></div>`).join(''):'<p class="sec-sub">Nenhum simulado ainda.</p>';
  const sa=$('#cmpA'),sb=$('#cmpB');if(sa&&sb&&quiz.length){sa.innerHTML=quiz.map((r,i)=>`<option value="${i}">${i===0?'Atual':'Tent.'+(i+1)} — ${new Date(r.data||r.criado_em).toLocaleDateString('pt-BR')}</option>`).join('');sb.innerHTML=sa.innerHTML;if(quiz[1])sb.value='1'}
}
document.addEventListener('click',e=>{if(e.target.id==='cmpBtn'){const q1=$('#cmpA').value,q2=$('#cmpB').value;const all=DB.read('px_results',[]);if(!all.length)return toast('Sem tentativas');const a=all[+q1],b=all[+q2];if(!a||!b)return;$('#cmpBox').innerHTML=AREAS.map(ar=>{const va=a.scores[ar.cod]||0,vb=b.scores[ar.cod]||0;return `<div class="res-card"><span class="area-cod">${ar.cod}</span><div style="flex:1"><strong>${ar.nome}</strong><p class="mono">${va.toFixed(1)}% vs ${vb.toFixed(1)}% · diff ${(va-vb).toFixed(1)}</p></div></div>`}).join('')}});

/* ---------------- Conta ---------------- */
function renderConta(){
  const m=me();
  if(!m){
    $('#contaSub').textContent='ENTRAR OU CRIAR CONTA';
    $('#contaBox').innerHTML=`<div class="tabs"><button class="tab active" id="tabLogin" type="button">ENTRAR</button><button class="tab" id="tabCad" type="button">CADASTRAR</button></div>
    <div class="auth-stage">
    <form id="formLogin" class="auth-dark" novalidate>
      <div class="field-dark"><span class="field-ico"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#4AA8FF"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v1H4v-1z" fill="#4AA8FF"/></svg></span><input id="loginUser" placeholder="Usuário" required /></div>
      <div class="field-dark"><span class="field-ico"><svg width="18" height="18" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="#4AA8FF"/><path d="M8 10V7a4 4 0 018 0v3" stroke="#4AA8FF" stroke-width="2" fill="none"/></svg></span><input id="loginPass" type="password" placeholder="Senha" required /></div>
      <small id="loginErr" class="auth-err"></small>
      <button class="btn-login" type="submit" id="btnLogin">ENTRAR</button>
    </form>
    <form id="formCad" class="auth-dark" hidden novalidate>
      <div class="field-dark"><input id="cadNome" placeholder="Nome (pode repetir)" required /></div>
      <div class="field-dark"><input id="cadUser" placeholder="Usuário (3-20, sem acento)" required /></div>
      <small id="userTip" class="auth-hint"></small>
      <div class="field-dark"><input id="cadPass" type="password" placeholder="Senha (mínimo 4)" required /></div>
      <small id="cadErr" class="auth-err"></small>
      <div class="auth-row2"><div class="field-dark"><input id="cadIdade" type="number" min="10" max="99" placeholder="Idade" /></div><div class="field-dark"><input id="cadCidade" placeholder="Cidade/UF" /></div></div>
      <button class="btn-login" type="submit" id="btnCad">CRIAR CONTA</button>
    </form>
    <div class="panel" style="margin-top:12px"><b>Apresentação rápida para a banca</b><p class="form-hint">Sem cadastro na hora? Use a demo.</p><button type="button" class="btn-ghost dark" id="demoBtn">Entrar com demo_banca / demo123</button></div>
    </div>`;
    bindAuthForm();
    return;
  }
  $('#contaSub').textContent=m.username.toUpperCase();
  $('#contaBox').innerHTML=`<div class="panel"><p><strong>Nome:</strong> ${m.nome}</p><p><strong>Username:</strong> ${m.username}</p><p><strong>Idade:</strong> ${m.idade||'—'} · <strong>Cidade:</strong> ${m.cidade||'—'}</p></div>
  <div class="panel"><h3>Progresso do questionário</h3><p class="form-hint" id="progInfo">Carregando...</p><button class="btn-ghost dark" id="btnZerarProgresso">Zerar e recomeçar</button></div>
  <div class="row2"><button class="btn-ghost dark" id="btnOut">Sair</button><button class="btn-ghost dark" id="btnDel" style="color:#A83A2E">Excluir conta</button></div>
  <p class="form-hint">Excluir apaga conta, resultados, respostas e simulados — sem retenção (RF11 / LGPD).</p>`;
  $('#btnOut').onclick=async()=>{await logout();toast('Sessão encerrada');go('inicio')};
  $('#btnDel').onclick=async()=>{if(!confirm('Excluir conta e todos os dados? Sem retenção.'))return;try{if(apiOnline)await api('/api/conta',{method:'DELETE'})}catch{} await logout();toast('Conta excluída');go('inicio')};
  $('#btnZerarProgresso').onclick=async()=>{try{if(apiOnline)await api('/api/progresso/limpar',{method:'POST'})}catch{} DB.write('px_progresso',null);toast('Progresso zerado');renderConta()};
  refreshProgInfo();
}
async function refreshProgInfo(){try{const p=apiOnline?await api('/api/progresso'):DB.read('px_progresso',null);const el=$('#progInfo');if(el)el.textContent=p&&!p.finalizado&&p.idx>0?`Parou na pergunta ${p.idx} de 34.`:p&&p.finalizado?'Questionário concluído — pode refazer quando quiser.':'Nenhuma resposta salva ainda.'}catch(e){}}
function bindAuthForm(){
  const tl=$('#tabLogin'),tc=$('#tabCad');if(tl)tl.onclick=()=>{tl.classList.add('active');tc.classList.remove('active');$('#formLogin').hidden=false;$('#formCad').hidden=true};
  if(tc)tc.onclick=()=>{tc.classList.add('active');tl.classList.remove('active');$('#formLogin').hidden=true;$('#formCad').hidden=false};
  const cu=$('#cadUser');if(cu)cu.addEventListener('input',e=>{const v=e.target.value.trim();const ok=/^[a-zA-Z0-9_.]{3,20}$/.test(v);const s=ok&&localUsers.some(u=>u.usernameLower===v.toLowerCase())?v+'1':null;const tip=$('#userTip');if(tip){tip.textContent=!v?'':!ok?'Formato inválido.':s?'Em uso. Sugestão: '+s:'Username livre.';tip.style.color=(!ok||s)?'#A83A2E':'#1A7A4C'}});
  const fl=$('#formLogin');if(fl)fl.onsubmit=async e=>{e.preventDefault();$('#loginErr').textContent='';try{const m=await login($('#loginUser').value.trim(),$('#loginPass').value);toast('Olá, '+m.nome);go(J.finished?'resultado':'jogo')}catch(err){$('#loginErr').textContent=err.message}};
  const fc=$('#formCad');if(fc)fc.onsubmit=async e=>{e.preventDefault();$('#cadErr').textContent='';try{const m=await cadastrar($('#cadNome').value.trim(),$('#cadUser').value.trim(),$('#cadPass').value,$('#cadIdade').value,$('#cadCidade').value);toast('Conta criada. Vamos jogar?');go('jogo')}catch(err){$('#cadErr').textContent=err.message}};
  const demo=$('#demoBtn');if(demo)demo.onclick=async()=>{try{await login('demo_banca','demo123')}catch{await cadastrar('Demo Banca','demo_banca','demo123','17','Jaragua do Sul/SC')}toast('Logado como demo_banca');go('jogo')};
}

/* ---------------- util / init ---------------- */
document.addEventListener('click',e=>{if(e.target.id==='btnPrint')window.print();if(e.target.id==='btnExport'){const r=DB.read('px_lastResult',null);if(!r)return toast('Sem resultado');const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='projeto-x-resultado.json';a.click()}});
document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const map={'1':'inicio','2':'jogo','3':'areas','4':'simulado','5':'materiais'};if(map[e.key])go(map[e.key])});

(async function init(){
  await health();
  if(token){try{if(apiOnline){const m=await api('/api/auth/me');apiOnlineUser=m}}catch{}}
  renderAreasPreview();
  bindAuthForm();
  go('inicio');
})();

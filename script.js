/* Projeto X — Joguinho do Perfil (script.js) */
/* Mantém auth (RF01-11), cálculo (RF14-16, RF25-28) e resultado em canvas */

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toastEl=$('#toast');let toastT;function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),2600)}

/* ---------- Auth (localStorage) ---------- */
const DB={read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write(k,v){localStorage.setItem(k,JSON.stringify(v))}};
let users=DB.read('px_users',[]), session=DB.read('px_session',null);
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('px::'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return 'f'+h}}
const me=()=>users.find(u=>u.usernameLower===(session?.usernameLower||''));
function saveUsers(){DB.write('px_users',users)}function setSession(u){session=u?{usernameLower:u.usernameLower,ts:Date.now()}:null;DB.write('px_session',session);refreshPerfil()}

/* ---------- Jogo estado ---------- */
let J={etapa:0,idx:0,ans:{},perguntas:[],finished:false};
const PILAR_NOMES={1:'Interesses',2:'Habilidades',3:'Competências',4:'Preferências'};
const PILAR_TOTAL={1:12,2:10,3:8,4:4};

function iniciarJogo(){
  J.perguntas=[...PERGUNTAS.filter(q=>q.etapa===1), ...PERGUNTAS.filter(q=>q.etapa===2), ...PERGUNTAS.filter(q=>q.etapa===3), ...PERGUNTAS.filter(q=>q.etapa===4)];
  J={etapa:0,idx:0,ans:{},perguntas:J.perguntas,finished:false};
  renderJogo();
}

function renderJogo(){
  if($('.view.active').dataset.view!=='mapa')return;
  $('#gameEtapa').textContent=J.finished?J.perguntas.length:J.idx+1;
  $('#gameTotal').textContent=J.perguntas.length;
  $('#gameProgress').style.width=J.finished?'100%':Math.round((J.idx/J.perguntas.length)*100)+'%';

  const pts=$('#pathPoints'); pts.innerHTML='';
  for(let i=0;i<J.perguntas.length;i++){
    const d=document.createElement('div'); d.className='path-dot'+(i<J.idx?' done': i===J.idx?' active':''); pts.appendChild(d);
  }

  const char=$('#gameCharacter'); const dots=$$('.path-dot');
  if(dots[J.idx]){ char.style.left=dots[J.idx].offsetLeft+'px'; char.style.top='-55px'; }

  if(J.finished){
    $('#gameCard').innerHTML=`
      <div class="card-header"><span class="card-pilar">Jogo concluído!</span><span class="card-num">Você respondeu tudo</span></div>
      <div class="card-body"><h3 class="card-txt">Parabéns, você chegou ao final do joguinho 🎉</h3></div>
      <div class="card-options"></div>
      <div class="card-nav"><button class="btn-primary" id="btnFinalizarJogo">Ver meu resultado →</button></div>
    `;
    $('#btnFinalizarJogo').onclick=()=>{const res=calc();exibirResultado(res);};
    return;
  }

  const q=J.perguntas[J.idx];
  // etapa pela posição no array embaralhado
  let acumulado=0, etapa=4, pos=1;
  for(const e of [1,2,3,4]){
    const n=PILAR_TOTAL[e];
    if(J.idx<acumulado+n){etapa=e; pos=J.idx-acumulado+1; break;}
    acumulado+=n;
  }
  $('#cardPilar').textContent=PILAR_NOMES[etapa];
  $('#cardNum').textContent=`Pergunta ${pos} de ${PILAR_TOTAL[etapa]}`;
  $('#cardTxt').textContent=q.txt;
  $('#cardFeedback').style.display='none'; $('#cardFeedback').textContent='';
  $('#cardNav').style.display='none';

  let html='';
  if(q.tipo==='pref'){
    q.opts.forEach((o,i)=>{html+=`<label><input type="radio" name="q" value="${i}"/> ${o}</label>`});
  }else{
    const esc=etapa===1?['Nada a ver comigo','Tem um pouco a ver','Neutro / não sei','Gosto bastante','Amo / quero muito']:['Nunca fiz','Só vi de longe','Já fiz o básico','Sei fazer bem','Faco sempre / ensino outros'];
    esc.forEach((o,i)=>{html+=`<label><input type="radio" name="q" value="${i}"/> <b>${i}</b> — ${o}</label>`});
  }
  $('#cardOptions').innerHTML=html;

  const prev=J.ans[q.id];
  if(prev!==undefined){
    const inputs=$$('#cardOptions input'); if(inputs[prev]){inputs[prev].checked=true; marcarSelecionada(inputs[prev]);}
  }
  $$('#cardOptions input').forEach(r=>{r.onchange=()=>{J.ans[q.id]=parseInt(r.value);J.dirty=true; marcarSelecionada(r); habilitarProximo();}});
}

function marcarSelecionada(el){
  $$('#cardOptions label').forEach(l=>l.classList.remove('sel'));
  if(el) el.closest('label').classList.add('sel');
}
function habilitarProximo(){$('#btnProximo').disabled=false; $('#btnProximo').textContent='Próxima →';}

document.addEventListener('click',e=>{
  if(e.target.id==='btnProximo'){
    const q=J.perguntas[J.idx];
    if(J.ans[q.id]===undefined){toast('Responda antes de andar');return}
    J.idx++; if(J.idx>=J.perguntas.length){J.finished=true;}
    renderJogo(); return;
  }
  if(e.target.id==='btnVoltar'){if(J.idx>0){J.idx--; renderJogo();} return;}
  if(e.target.id==='btnFinalizarJogo'){const res=calc(); exibirResultado(res); return;}
  if(e.target.id==='btnSairJogo'){go('mapa'); return;}
  if(e.target.id==='btnReiniciarJogo'){iniciarJogo(); return;}
});

function normAlvos(alvos){const out=[];if(!alvos)return out;for(const a of alvos){if(Array.isArray(a)&&a.length===2&&typeof a[0]==='string'){out.push([a[0],a[1]])}else if(typeof a==='string'){out.push([a,alvos[alvos.indexOf(a)+1]||1])}}return out}
function flatScoreDef(def){const out=[];for(let i=0;i<def.length;i+=2){out.push([def[i],def[i+1]||1])}return out}

function calc(){
  const scores={};AREAS.forEach(a=>scores[a.cod]={i:0,imax:0,h:0,hmax:0,c:0,cmax:0});
  for(const q of PERGUNTAS){
    const v=J.ans[q.id]; if(v===undefined||v===-1)continue; if(q.tipo==='pref')continue;
    if(q.tipo==='multi'){const def=q.opts[v*2+1];if(!Array.isArray(def))continue;const pares=flatScoreDef(def);
      for(const [ar,peso] of pares){if(scores[ar])scores[ar].c+=4*peso}
      const areasNaQ=new Set();q.opts.forEach((o,idx)=>{if(idx%2===1&&Array.isArray(o)){for(let k=0;k<o.length;k+=2)areasNaQ.add(o[k])}});
      areasNaQ.forEach(ar=>{let mp=0;q.opts.forEach((o,idx)=>{if(idx%2===1&&Array.isArray(o)){for(let k=0;k<o.length;k+=2){if(o[k]===ar)mp=Math.max(mp,o[k+1]||1)}}});if(scores[ar])scores[ar].cmax+=4*mp});
      continue}
    const pares=normAlvos(q.alvos);for(const [area,peso] of pares){const max=4*peso;if(scores[area]){if(q.etapa===1){scores[area].i+=v*peso;scores[area].imax+=max}else if(q.etapa===2){scores[area].h+=v*peso;scores[area].hmax+=max}else{scores[area].c+=v*peso;scores[area].cmax+=max}}}
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
if(p4===0&&(a.tags.includes('logica')||a.tags.includes('organizacao')))s++;if(p4===1&&(a.tags.includes('campo')||a.tags.includes('pratico')))s++;if(p4===2&&a.tags.includes('pessoas'))s++;
return s}

/* ---------- Resultado ---------- */
function exibirResultado(r){
  const top=Object.entries(r.scores).sort((a,b)=>b[1]-a[1]);
  const main=top.filter(([_,v])=>v>=60),mid=top.filter(([_,v])=>v>=40&&v<60);
  $('#resTop').innerHTML=main.length?main.map(([c,v])=>{const a=AREAS.find(x=>x.cod===c);return `<div class="res-card"><span class="area-cod">${a.cod}</span><div style="flex:1"><strong>${a.nome}</strong><div class="bar"><i style="width:${v}%"></i></div></div><span class="pct">${v.toFixed(1)}%</span><button class="btn-primary" data-area="${c}">Ver trilha</button></div>`}).join(''):'<p class="sec-sub">Nenhuma área acima de 60%.</p>';
  $('#resMore').innerHTML=mid.length?mid.map(([c,v])=>{const a=AREAS.find(x=>x.cod===c);return `<div class="res-card"><span class="area-cod">${a.cod}</span><div style="flex:1"><strong>${a.nome}</strong><div class="bar"><i style="width:${v}%"></i></div></div><span class="pct">${v.toFixed(1)}%</span><button class="btn-ghost dark" data-area="${c}">Trilha</button></div>`}).join(''):'<p class="sec-sub">Nada entre 40 e 59%.</p>';
  $('#resExplain').textContent=`Cálculo: interesses 35% + habilidades 35% + competências 20%. Preferências desempatam. Maior: ${AREAS.find(a=>a.cod===top[0][0]).nome} (${top[0][1].toFixed(1)}%).`;
  drawChart(r.scores);
  $('#btnVerMais').onclick=()=>{const m=$('#resMore');m.hidden=!m.hidden;$('#btnVerMais').textContent=m.hidden?'Ver mais (40 a 59%)':'Ocultar'};
  document.addEventListener('click',function handler(e){const b=e.target.closest('[data-area]');if(b){document.removeEventListener('click',handler);const a=AREAS.find(x=>x.cod===b.dataset.area);alert(`${a.cod} — ${a.nome}\n${a.desc}\nCarreiras: ${a.carreiras.join(' · ')}\nFormação: ${a.form.join(' | ')}`);}});
  go('resultado');
}

function drawChart(scores){const cv=$('#chartCanvas');if(!cv||!scores)return;const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);const top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,6);const bw=(W-40)/top.length;ctx.font='11px JetBrains Mono, monospace';top.forEach(([c,v],i)=>{const h=(H-52)*(v/100);const x=20+i*bw;ctx.fillStyle='#141A26';ctx.fillRect(x,H-32-h,Math.max(10,bw-16),h);ctx.fillStyle='#1D3FD1';ctx.fillRect(x,H-32-h,Math.max(10,bw-16),5);ctx.fillStyle='#141A26';ctx.fillText(c,x,H-14);ctx.fillText(v.toFixed(0)+'%',x,H-32-h-6)})}

/* ---------- Auth ---------- */
function showTab(which){authTab=which==='cad'?'cad':'login';const isLogin=authTab!=='cad';const fl=$('#formLogin'),fc=$('#formCad'),t=$('#authTitle'),tl=$('#tabLogin'),tc=$('#tabCad');if(fl)fl.hidden=!isLogin;if(fc)fc.hidden=isLogin;if(t)t.textContent=isLogin?'Entrar':'Cadastrar';if(tl)tl.classList.toggle('active',isLogin);if(tc)tc.classList.toggle('active',!isLogin)}
function applyAuthTab(){try{showTab(authTab)}catch(e){}}
let authTab='login';
const tabL=$('#tabLogin'),tabC=$('#tabCad');if(tabL)tabL.onclick=()=>showTab('login');if(tabC)tabC.onclick=()=>showTab('cad');
function suggest(u){const b=(u||'').toLowerCase().replace(/[^a-z0-9_.]/g,'');if(!b)return null;if(!users.some(x=>x.usernameLower===b))return null;for(let i=1;i<50;i++){if(!users.some(x=>x.usernameLower===b+i))return b+i}return b+'_x'}
function refreshAuthCount(){const el=$('#authCount');if(el)el.textContent=users.length?`· ${users.length} conta(s) neste navegador`:''}
$('#cadUser').addEventListener('input',e=>{const v=e.target.value.trim();const ok=/^[a-zA-Z0-9_.]{3,20}$/.test(v);const s=v?suggest(v):null;$('#userTip').textContent=!v?'3 a 20 caracteres: letras, numero, ponto ou _':!ok?'Formato invalido. Evite espaco e acento.':s?`"${v}" em uso. Sugestao: "${s}" — clique para usar.`:'Username livre.';$('#userTip').style.color=s||!ok?'#A83A2E':'#1A7A4C';$('#userTip').style.cursor=s?'pointer':'';$('#userTip').onclick=()=>{if(s){e.target.value=s;e.target.dispatchEvent(new Event('input'))}}});
$('#cadPass').addEventListener('input',e=>{const v=e.target.value;const f=v.length<4?'muito curta (min 4)':v.length<6?'ok para teste':/[A-Z]/.test(v)&&/[0-9]/.test(v)&&v.length>=8?'forte':'media';$('#passTip').textContent='Forca: '+f});
function bindToggle(btnId,inputId){const b=$(btnId);if(!b)return;b.onclick=()=>{const i=$(inputId);i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'ver':'ocultar'}}
bindToggle('#toggleLogin','#loginPass');bindToggle('#toggleCad','#cadPass');
try{const ru=localStorage.getItem('px_remember');if(ru){$('#loginUser').value=ru;const rm=$('#rememberMe');if(rm)rm.checked=true}}catch(e){}
const forgot=$('#forgotLink');if(forgot)forgot.onclick=e=>{e.preventDefault();toast('Sem e-mail nesta versao: fale com a equipe para resetar pelo banco.')};
$('#loginPass').addEventListener('keyup',e=>{if(e.getModifierState&&e.getModifierState('CapsLock')){$('#loginErr').textContent='Caps Lock ligado — confira maiusculas.'}else if($('#loginErr').textContent.includes('Caps'))$('#loginErr').textContent=''});
$('#formCad').onsubmit=async e=>{e.preventDefault();$('#cadErr').textContent='';const nome=$('#cadNome').value.trim(),user=$('#cadUser').value.trim(),pass=$('#cadPass').value;
if(nome.length<2){$('#cadErr').textContent='Informe seu nome (min 2 letras).';return}
if(!/^[a-zA-Z0-9_.]{3,20}$/.test(user)){$('#cadErr').textContent='Username: 3-20, so letras sem acento, numero, ponto ou _. ';return}
if(users.some(u=>u.usernameLower===user.toLowerCase())){const s=suggest(user);$('#cadErr').textContent=`Username em uso.${s?` Sugestao: ${s}`:''}`;return}
if(pass.length<4){$('#cadErr').textContent='Senha minima 4 caracteres.';return}
const btn=$('#btnCad');btn.disabled=true;btn.textContent='Criando...';
const h=await hash(pass);const u={nome,username:user,usernameLower:user.toLowerCase(),passHash:h,idade:$('#cadIdade').value||'',cidade:$('#cadCidade').value||'',createdAt:Date.now(),usernameChangedAt:0,resultados:[],simulados:[]};users.push(u);saveUsers();setSession(u);refreshAuthCount();btn.disabled=false;btn.textContent='CRIAR CONTA';toast('Conta criada. Vamos jogar?');go('mapa')};
$('#formLogin').onsubmit=async e=>{e.preventDefault();$('#loginErr').textContent='';const u=$('#loginUser').value.trim().toLowerCase(),p=$('#loginPass').value;
if(!u||!p){$('#loginErr').textContent='Preencha usuário e senha.';return}
const btn=$('#btnLogin');btn.disabled=true;btn.textContent='ENTRANDO...';
const f=users.find(x=>x.usernameLower===u);const ok=f&&f.passHash===await hash(p);btn.disabled=false;btn.textContent='ENTRAR';
if(!ok){$('#loginErr').textContent='Usuário ou senha inválidos. Confira e tente de novo.';return}
try{const rm=$('#rememberMe');if(rm&&rm.checked)localStorage.setItem('px_remember',u);else localStorage.removeItem('px_remember')}catch(e){}
setSession(f);toast('Ola, '+f.nome);go(f.resultados.length?'resultado':'mapa')};
const demoBtn=$('#demoBtn');if(demoBtn)demoBtn.onclick=async()=>{let d=users.find(x=>x.usernameLower==='demo_banca');if(!d){d={nome:'Demo Banca',username:'demo_banca',usernameLower:'demo_banca',passHash:await hash('demo123'),idade:'17',cidade:'Jaragua do Sul/SC',createdAt:Date.now(),usernameChangedAt:0,resultados:[],simulados:[]};users.push(d);saveUsers()}setSession(d);refreshAuthCount();toast('Logado como demo_banca / demo123');go('mapa')};

/* ---------- Navegação ---------- */
function go(view){$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===view));$$('#menu a').forEach(a=>a.classList.toggle('active',a.dataset.go===view));$('#menu').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
if(view==='auth'){try{applyAuthTab()}catch(e){}}
if(view==='mapa'){iniciarJogo();}
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();const v=g.dataset.go;if(['resultado'].includes(v)&&!me()){go('auth');toast('Crie uma conta para continuar');return}go(v)}
  const b=e.target.closest('[data-auth]');if(b){e.preventDefault();showTab(b.dataset.auth);go('auth')}
});
$('#btnHome').onclick=e=>{e.preventDefault();go('mapa')};

/* ---------- Export / print ---------- */
function doPrint(){window.print()}
function doExport(){const m=me();if(!m||!m.resultados[0])return toast('Sem resultado');const blob=new Blob([JSON.stringify(m.resultados[0],null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='projeto-x-resultado.json';a.click()}
document.addEventListener('click',e=>{
if(e.target.id==='btnPrint'||e.target.id==='printHome')window.print();
if(e.target.id==='btnExport')doExport();
});
document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const map={'1':'mapa','2':'resultado','3':'areas','4':'simulado','5':'materiais'};if(map[e.key])go(map[e.key])});

// Inicial
refreshPerfil();try{refreshAuthCount()}catch(e){}

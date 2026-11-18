/* ==========================================================================
   PRF Jaguaré - Script do painel do usuário
   ========================================================================== */

(function () {
  "use strict";

  // Estado do usuário (simulado)
  const usuario = {
    nome: "Carlos Eduardo Silva",
    cargo: "Policial Rodoviário Federal - 3ª PRF",
    unidade: "PRF Jaguaré - ES",
    matricula: "PRF-ES-8842",
  };

  // Dados simulados do dashboard
  const dados = {
    ocorrencias: 124,
    veiculos: 89,
    multas: 207,
    efetivo: 36,
  };

  // Referências DOM
  const els = {
    sidebar: document.getElementById("sidebar"),
    sidebarToggle: document.getElementById("sidebarToggle"),
    navItems: document.querySelectorAll(".nav-item"),
    pageTitle: document.getElementById("pageTitle"),
    pageSubtitle: document.getElementById("pageSubtitle"),
    dashboardBody: document.getElementById("dashboardBody"),
    btnLogout: document.getElementById("btnLogout"),
    btnLogoutSidebar: document.getElementById("btnLogoutSidebar"),
    userName: document.getElementById("userName"),
    userRole: document.getElementById("userRole"),
    sidebarUserName: document.getElementById("sidebarUserName"),
    sidebarUserRole: document.getElementById("sidebarUserRole"),
    userDropdown: document.getElementById("userDropdown"),
    userHeader: document.getElementById("userHeader"),
    btnNovaOcorrencia: document.getElementById("btnNovaOcorrencia"),
    modalNovaOcorrencia: document.getElementById("modalNovaOcorrencia"),
    modalBackdrop: document.getElementById("modalBackdrop"),
    modalClose: document.getElementById("modalClose"),
    formNovaOcorrencia: document.getElementById("formNovaOcorrencia"),
    btnCancelarOcorrencia: document.getElementById("btnCancelarOcorrencia"),
    toast: document.getElementById("toast"),
    toastMessage: document.getElementById("toastMessage"),
  };

  // Injeção do nome do usuário nos locais da interface
  function preencherUsuario() {
    if (els.userName) els.userName.textContent = usuario.nome;
    if (els.userRole) els.userRole.textContent = usuario.cargo;
    if (els.sidebarUserName) els.sidebarUserName.textContent = usuario.nome;
    if (els.sidebarUserRole) els.sidebarUserRole.textContent = usuario.unidade;
  }

  // Atualiza os cards de estatísticas
  function atualizarEstatisticas() {
    const map = {
      statOcorrencias: dados.ocorrencias,
      statVeiculos: dados.veiculos,
      statMultas: dados.multas,
      statEfetivo: dados.efetivo,
    };
    Object.entries(map).forEach(([id, valor]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = valor;
    });
  }

  // Navegação entre páginas (renderização simples de conteúdo)
  const paginas = {
    home: {
      title: "Início",
      subtitle: "Visão geral das atividades da unidade PRF Jaguaré.",
      render: () => `
        <section class="welcome-panel">
          <h2>Bem-vindo, ${usuario.nome}</h2>
          <p>Você está logado no painel da <strong>${usuario.unidade}</strong>. Acompanhe abaixo os principais indicadores de segurança viária da sua região.</p>
          <div class="welcome-actions">
            <button class="btn" onclick="app.novaOcorrencia()">Registrar Ocorrência</button>
            <button class="btn" onclick="app.verRelatorios()">Ver Relatórios</button>
          </div>
        </section>

        <div class="cards-grid">
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F4F0;</div>
            </div>
            <div class="card-value" id="dashOcorrencias">${dados.ocorrencias}</div>
            <div class="card-label">Ocorrências no mês</div>
            <div class="card-foot">
              <span class="badge badge-ok">Ativo</span>
              <span>&#x25B2; 12%</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F697;</div>
            </div>
            <div class="card-value" id="dashVeiculos">${dados.veiculos}</div>
            <div class="card-label">Veículos fiscalizados</div>
            <div class="card-foot">
              <span class="badge badge-ok">Ativo</span>
              <span>&#x25B2; 5%</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F4B3;</div>
            </div>
            <div class="card-value" id="dashMultas">${dados.multas}</div>
            <div class="card-label">Autuações emitidas</div>
            <div class="card-foot">
              <span class="badge badge-warn">Pendente</span>
              <span>&#x25BC; 3%</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F46E;&#x200D;&#x2640;&#xFE0F;</div>
            </div>
            <div class="card-value" id="dashEfetivo">${dados.efetivo}</div>
            <div class="card-label">Agentes de plantão</div>
            <div class="card-foot">
              <span class="badge badge-ok">Ativo</span>
              <span>&#x25AC; 0%</span>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ocorrência</th>
                <th>Tipo</th>
                <th>Local</th>
                <th>Data/Hora</th>
                <th>Status</th>
                <th>Agente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OC-2026-0412</td>
                <td>Acidente de trânsito</td>
                <td>BR-101, km 23 - Jaguaré/ES</td>
                <td>26/10/2026 14:30</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td>C. E. Silva</td>
              </tr>
              <tr>
                <td>OC-2026-0411</td>
                <td>Blitz / Operação</td>
                <td>BR-101, km 18 - Jaguaré/ES</td>
                <td>26/10/2026 09:00</td>
                <td><span class="status-chip aberto">&#x1F551; Aberto</span></td>
                <td>A. M. Rocha</td>
              </tr>
              <tr>
                <td>OC-2026-0410</td>
                <td>Infração de trânsito</td>
                <td>Av. Beira Rio, Centro - Jaguaré/ES</td>
                <td>25/10/2026 16:45</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td>R. S. Lima</td>
              </tr>
              <tr>
                <td>OC-2026-0409</td>
                <td>Veículo suspeito</td>
                <td>BR-101, km 31 - Jaguaré/ES</td>
                <td>25/10/2026 11:20</td>
                <td><span class="status-chip pendente">&#x23F3; Pendente</span></td>
                <td>M. F. Santos</td>
              </tr>
              <tr>
                <td>OC-2026-0408</td>
                <td>Acidente de trânsito</td>
                <td>BR-101, km 14 - Jaguaré/ES</td>
                <td>24/10/2026 19:10</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td>C. E. Silva</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
    ocorrencias: {
      title: "Ocorrências",
      subtitle: "Gerencie e visualize todas as ocorrências registradas pela unidade.",
      render: () => `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Localização</th>
                <th>Data/Hora</th>
                <th>Placa</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OC-2026-0412</td>
                <td>Acidente de trânsito</td>
                <td>BR-101, km 23 - Jaguaré/ES</td>
                <td>26/10/2026 14:30</td>
                <td>XYZ-9912</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Detalhes</button></td>
              </tr>
              <tr>
                <td>OC-2026-0411</td>
                <td>Blitz / Operação</td>
                <td>BR-101, km 18 - Jaguaré/ES</td>
                <td>26/10/2026 09:00</td>
                <td>—</td>
                <td><span class="status-chip aberto">&#x1F551; Aberto</span></td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Detalhes</button></td>
              </tr>
              <tr>
                <td>OC-2026-0410</td>
                <td>Infração de trânsito</td>
                <td>Av. Beira Rio, Centro - Jaguaré/ES</td>
                <td>25/10/2026 16:45</td>
                <td>ABC-1234</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Detalhes</button></td>
              </tr>
              <tr>
                <td>OC-2026-0409</td>
                <td>Veículo suspeito</td>
                <td>BR-101, km 31 - Jaguaré/ES</td>
                <td>25/10/2026 11:20</td>
                <td>DEF-5678</td>
                <td><span class="status-chip pendente">&#x23F3; Pendente</span></td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Detalhes</button></td>
              </tr>
              <tr>
                <td>OC-2026-0408</td>
                <td>Acidente de trânsito</td>
                <td>BR-101, km 14 - Jaguaré/ES</td>
                <td>24/10/2026 19:10</td>
                <td>GHI-3456</td>
                <td><span class="status-chip concluido">&#x2713; Concluído</span></td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Detalhes</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
    veiculos: {
      title: "Veículos",
      subtitle: "Consulta de veículos abordados e fiscalizados em operações da PRF.",
      render: () => `
        <div class="empty-state">
          <div class="empty-icon">&#x1F697;</div>
          <h3 style="font-family:Inter;font-weight:700;color:var(--prf-text);margin-bottom:0.5rem;">Nenhum veículo em destaque</h3>
          <p style="font-size:0.95rem;">Registre abordagens de veículos através do menu Ocorrências.</p>
        </div>
      `,
    },
    multas: {
      title: "Multas",
      subtitle: "Autuações e notificações de infrações de trânsito emitidas pela unidade.",
      render: () => `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Autuação</th>
                <th>Infração</th>
                <th>Código</th>
                <th>Valor</th>
                <th>Veículo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AT-88210</td>
                <td>Ultrapassagem proibida</td>
                <td>Art. 177, IV</td>
                <td>R$ 195,23</td>
                <td>XYZ-9912</td>
                <td><span class="status-chip aberto">&#x1F551; Aberto</span></td>
              </tr>
              <tr>
                <td>AT-88209</td>
                <td>Excesso de velocidade</td>
                <td>Art. 218, II</td>
                <td>R$ 130,16</td>
                <td>ABC-1234</td>
                <td><span class="status-chip concluido">&#x2713; Pago</span></td>
              </tr>
              <tr>
                <td>AT-88208</td>
                <td>Conduzir sem CNH</td>
                <td>Art. 162, I</td>
                <td>R$ 880,41</td>
                <td>DEF-5678</td>
                <td><span class="status-chip pendente">&#x23F3; Pendente</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
    relatorios: {
      title: "Relatórios",
      subtitle: "Emissão de relatórios gerenciais e estatísticos da unidade PRF Jaguaré.",
      render: () => `
        <div class="cards-grid">
          <div class="summary-card" style="cursor:pointer;" onclick="app.toast('Relatório de Ocorrências gerado com sucesso.')">
            <div class="card-top">
              <div class="card-icon">&#x1F4CB;</div>
            </div>
            <div class="card-value">124</div>
            <div class="card-label">Ocorrências mensais</div>
            <div class="card-foot"><span>Baixar PDF</span> &#x2197;</div>
          </div>
          <div class="summary-card" style="cursor:pointer;" onclick="app.toast('Relatório de Veículos gerado com sucesso.')">
            <div class="card-top">
              <div class="card-icon">&#x1F697;</div>
            </div>
            <div class="card-value">89</div>
            <div class="card-label">Veículos abordados</div>
            <div class="card-foot"><span>Baixar PDF</span> &#x2197;</div>
          </div>
          <div class="summary-card" style="cursor:pointer;" onclick="app.toast('Relatório de Multas gerado com sucesso.')">
            <div class="card-top">
              <div class="card-icon">&#x1F4B3;</div>
            </div>
            <div class="card-value">207</div>
            <div class="card-label">Autuações emitidas</div>
            <div class="card-foot"><span>Baixar PDF</span> &#x2197;</div>
          </div>
        </div>
      `,
    },
    informes: {
      title: "Informes",
      subtitle: "Comunicados internos e instruções normativas da PRF Jaguaré.",
      render: () => `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Autor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Instrução Normativa Nº 12/2026</td>
                <td>Normativo</td>
                <td>20/10/2026</td>
                <td>Comando Local</td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Abrir</button></td>
              </tr>
              <tr>
                <td>Escala de Plantão - Novembro</td>
                <td>Administrativo</td>
                <td>18/10/2026</td>
                <td>Pessoal</td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Abrir</button></td>
              </tr>
              <tr>
                <td>Operação Fim de Ano - Diretrizes</td>
                <td>Operacional</td>
                <td>15/10/2026</td>
                <td>Comando Local</td>
                <td><button class="btn btn-outline" style="height:auto;padding:4px 10px;font-size:0.8rem;">Abrir</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
    efetivo: {
      title: "Efetivo",
      subtitle: "Policiais rodoviários federais alocados na unidade Jaguaré.",
      render: () => `
        <div class="cards-grid">
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F46E;&#x200D;&#x2640;&#xFE0F;</div>
            </div>
            <div class="card-value">36</div>
            <div class="card-label">Agentes ativos</div>
            <div class="card-foot"><span>&#x25AC; Sem alteração</span></div>
          </div>
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F3E5;</div>
            </div>
            <div class="card-value">12</div>
            <div class="card-label">Em serviço hoje</div>
            <div class="card-foot"><span>Plantão ativo</span></div>
          </div>
          <div class="summary-card">
            <div class="card-top">
              <div class="card-icon">&#x1F3E6;</div>
            </div>
            <div class="card-value">3</div>
            <div class="card-label">De folga</div>
            <div class="card-foot"><span>&#x25AC; Sem alteração</span></div>
          </div>
        </div>
      `,
    },
    disciplinar: {
      title: "Disciplinar",
      subtitle: "Processos administrativos disciplinares e correições da unidade.",
      render: () => `
        <div class="empty-state">
          <div class="empty-icon">&#x1F3AB;</div>
          <h3 style="font-family:Inter;font-weight:700;color:var(--prf-text);margin-bottom:0.5rem;">Sem processos em andamento</h3>
          <p style="font-size:0.95rem;">Não há processos disciplinares abertos no momento.</p>
        </div>
      `,
    },
    configuracoes: {
      title: "Configurações",
      subtitle: "Preferências da conta e opções do painel do usuário.",
      render: () => `
        <div style="max-width:560px;">
          <div class="form">
            <div class="form-group">
              <label class="form-label">Nome completo</label>
              <input type="text" class="form-input" value="${usuario.nome}" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Cargo / Unidade</label>
              <input type="text" class="form-input" value="${usuario.cargo} - ${usuario.unidade}" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Matrícula PRF</label>
              <input type="text" class="form-input" value="${usuario.matricula}" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Tema da interface</label>
              <select class="form-select">
                <option>Claro (Padrão PRF)</option>
                <option>Escuro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notificações por e-mail</label>
              <select class="form-select">
                <option>Ativadas</option>
                <option>Desativadas</option>
              </select>
            </div>
            <div class="form-actions" style="justify-content:flex-start;">
              <button class="btn btn-primary" onclick="app.toast('Configurações salvas com sucesso.')">Salvar alterações</button>
            </div>
          </div>
        </div>
      `,
    },
  };

  // Renderiza uma página
  function renderPagina(chave) {
    const pagina = paginas[chave] || paginas.home;
    if (els.pageTitle) els.pageTitle.textContent = pagina.title;
    if (els.pageSubtitle) els.pageSubtitle.textContent = pagina.subtitle;
    if (els.dashboardBody) els.dashboardBody.innerHTML = pagina.render();

    // Atualiza itens ativos do menu
    els.navItems.forEach((item) => {
      const ativo = item.dataset.page === chave;
      item.classList.toggle("active", ativo);
    });

    // Fecha sidebar em mobile
    if (els.sidebar) els.sidebar.classList.remove("open");

    // Fecha dropdown do usuário
    fecharDropdownUsuario();
  }

  // Menu lateral mobile
  function initSidebar() {
    if (!els.sidebarToggle || !els.sidebar) return;
    els.sidebarToggle.addEventListener("click", () => {
      els.sidebar.classList.toggle("open");
    });

    // Fecha o sidebar ao clicar fora (mobile)
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 900 &&
        els.sidebar.classList.contains("open") &&
        !els.sidebar.contains(e.target) &&
        e.target !== els.sidebarToggle
      ) {
        els.sidebar.classList.remove("open");
      }
    });

    // Navegação dos itens do menu
    els.navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Se o clique foi em um link/btn dentro, ainda navegamos (exceto logout tratado à parte)
        const pagina = item.dataset.page;
        if (pagina && paginas[pagina]) {
          e.preventDefault();
          renderPagina(pagina);
        }
      });
    });
  }

  // Dropdown do usuário
  function initUserDropdown() {
    if (!els.userHeader || !els.userDropdown) return;
    els.userHeader.addEventListener("click", (e) => {
      e.stopPropagation();
      els.userDropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      fecharDropdownUsuario();
    });
  }

  function fecharDropdownUsuario() {
    if (els.userDropdown) els.userDropdown.classList.remove("open");
  }

  // Modal de nova ocorrência
  window.app = {
    novaOcorrencia: function () {
      if (els.modalNovaOcorrencia) els.modalNovaOcorrencia.removeAttribute("aria-hidden");
      if (els.modalBackdrop) els.modalBackdrop.removeAttribute("aria-hidden");
      if (els.modalNovaOcorrencia) els.modalNovaOcorrencia.classList.remove("hidden");
      if (els.modalBackdrop) els.modalBackdrop.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    },
    fecharNovaOcorrencia: function () {
      if (els.modalNovaOcorrencia) els.modalNovaOcorrencia.setAttribute("aria-hidden", "true");
      if (els.modalBackdrop) els.modalBackdrop.setAttribute("aria-hidden", "true");
      if (els.modalNovaOcorrencia) els.modalNovaOcorrencia.classList.add("hidden");
      if (els.modalBackdrop) els.modalBackdrop.classList.add("hidden");
      document.body.style.overflow = "";
      if (els.formNovaOcorrencia) els.formNovaOcorrencia.reset();
    },
    verRelatorios: function () {
      renderPagina("relatorios");
    },
    toast: function (msg, tipo = "sucesso") {
      if (!els.toast || !els.toastMessage) return;
      els.toastMessage.textContent = msg;
      els.toast.classList.add("show");
      setTimeout(() => {
        els.toast.classList.remove("show");
      }, 3000);
    },
  };

  function initModalOcorrencia() {
    if (!els.modalNovaOcorrencia) return;

    const fechar = () => window.app.fecharNovaOcorrencia();

    if (els.modalClose) els.modalClose.addEventListener("click", fechar);
    if (els.modalBackdrop) els.modalBackdrop.addEventListener("click", fechar);
    if (els.btnCancelarOcorrencia) els.btnCancelarOcorrencia.addEventListener("click", fechar);

    // Fecha com tecla Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.modalNovaOcorrencia.classList.contains("hidden")) {
        fechar();
      }
    });

    if (els.formNovaOcorrencia) {
      els.formNovaOcorrencia.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(els.formNovaOcorrencia);
        const tipo = formData.get("tipo") || "";
        const local = formData.get("local") || "";
        if (!tipo || !local) {
          window.app.toast("Preencha tipo e localização da ocorrência.", "erro");
          return;
        }
        window.app.toast("Ocorrência registrada com sucesso no sistema PRF.");
        fechar();
      });
    }
  }

  // Logout
  function initLogout() {
    function deslogar() {
      window.app.toast("Saindo da conta... Redirecionando para login.");
      setTimeout(() => {
        alert("Você foi desconectado da conta " + usuario.nome + ".\n(Em produção, redirecionaria para a tela de login.)");
      }, 700);
    }
    if (els.btnLogout) els.btnLogout.addEventListener("click", (e) => { e.preventDefault(); deslogar(); });
    if (els.btnLogoutSidebar) els.btnLogoutSidebar.addEventListener("click", (e) => { e.preventDefault(); deslogar(); });
  }

  // Exportar PDF simulado
  function initExport() {
    const btnExport = document.getElementById("btnExport");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        window.app.toast("Exportando relatório em PDF...");
      });
    }
  }

  // Inicialização
  function init() {
    preencherUsuario();
    atualizarEstatisticas();
    initSidebar();
    initUserDropdown();
    initModalOcorrencia();
    initLogout();
    initExport();
    renderPagina("home");
  }

  document.addEventListener("DOMContentLoaded", init);
})();

// Dados do cardápio (conforme imagem da Factory Açaí)
const tamanhos = [
  { id: '300ml', nome: 'Mini Fábrica', valor: '300 ml', preco: 16.00 },
  { id: '500ml', nome: 'Alta Produção', valor: '500 ml', preco: 19.00 },
  { id: '700ml', nome: 'Potência Máxima', valor: '700 ml', preco: 25.00 },
];

const acompanhamentos = [
  {
    categoria: 'Frutas',
    itens: [
      { id: 'banana', nome: 'Banana', preco: 3.00, emoji: '🍌' },
      { id: 'morango', nome: 'Morango', preco: 4.00, emoji: '🍓' },
      { id: 'abacaxi', nome: 'Abacaxi', preco: 4.00, emoji: '🍍' },
      { id: 'maracuja', nome: 'Maracujá', preco: 3.50, emoji: '🍇' },
      { id: 'uva-verde', nome: 'Uva verde', preco: 4.00, emoji: '🍇' },
    ],
  },
  {
    categoria: 'Chocolates, doces e complementos',
    itens: [
      { id: 'leite-condensado', nome: 'Leite condensado', preco: 3.50, emoji: '🥛' },
      { id: 'leite-em-po', nome: 'Leite em pó', preco: 3.50, emoji: '🥛' },
      { id: 'bis-branco', nome: 'Bis branco', preco: 3.50, emoji: '🍫' },
      { id: 'bis-preto', nome: 'Bis preto', preco: 3.50, emoji: '🍫' },
      { id: 'pacoquinha', nome: 'Paçoquinha', preco: 3.00, emoji: '🥜' },
      { id: 'amendoim', nome: 'Amendoim granulado', preco: 3.00, emoji: '🥜' },
      { id: 'coco-ralado', nome: 'Coco ralado', preco: 3.00, emoji: '🥥' },
      { id: 'bolacha-oleo', nome: 'Bolacha Óleo', preco: 4.00, emoji: '🍪' },
      { id: 'confete', nome: 'Confete', preco: 3.50, emoji: '🍬' },
      { id: 'ouro-branco', nome: 'Ouro Branco', preco: 4.00, emoji: '🍫' },
      { id: 'sonho-de-valsa', nome: 'Sonho de Valsa', preco: 4.00, emoji: '🍫' },
      { id: 'nutella', nome: 'Nutella', preco: 7.00, emoji: '🍫' },
      { id: 'trento', nome: 'Trento', preco: 4.00, emoji: '🍫' },
      { id: 'kit-kat', nome: 'Kit Kat', preco: 5.00, emoji: '🍫' },
      { id: 'aveia', nome: 'Aveia', preco: 3.00, emoji: '🌾' },
      { id: 'laka', nome: 'Laka', preco: 5.00, emoji: '🍫' },
      { id: 'diamante-negro', nome: 'Diamante Negro', preco: 5.00, emoji: '🍫' },
      { id: 'marshmallow', nome: 'Marshmallow', preco: 4.00, emoji: '🍡' },
      { id: 'ovomaltine', nome: 'Ovomaltine', preco: 4.00, emoji: '🥤' },
      { id: 'creme-avelha', nome: 'Creme de avelã', preco: 4.50, emoji: '🌰' },
      { id: 'chocolate-branco', nome: 'Chocolate branco', preco: 4.50, emoji: '🍫' },
      { id: 'leite-condensado-zero', nome: 'Leite condensado zero lactose', preco: 6.00, emoji: '🥛' },
      { id: 'leite-em-po-zero', nome: 'Leite em pó zero lactose', preco: 6.00, emoji: '🥛' },
      { id: 'mousse-maracuja', nome: 'Mousse de maracujá', preco: 4.00, emoji: '🍮' },
      { id: 'mousse-morango', nome: 'Mousse de morango', preco: 4.00, emoji: '🍮' },
      { id: 'mousse-leite-po', nome: 'Mousse de leite em pó', preco: 4.00, emoji: '🍮' },
      { id: 'calda-chocolate', nome: 'Calda de chocolate', preco: 3.00, emoji: '🍫' },
      { id: 'calda-morango', nome: 'Calda de morango', preco: 3.00, emoji: '🍓' },
    ],
  },
];

let carrinho = [];

// Estado do modal de compra (global scope)
const modalState = {
  etapa: 1,
  tamanho: null,
  complementos: [],
  observacao: '',
  qtd: 1,
};

// Função utilitária
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para fechar modal
function fecharModal(id) {
  const el = document.getElementById(id);
  if (el) {
    const focused = document.activeElement;
    if (focused && focused.closest('.modal')) {
      focused.blur();
    }
    el.removeAttribute('data-aberto');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Função para abrir o pedido (global scope)
function abrirPedido() {
  modalState.etapa = 1;
  modalState.tamanho = null;
  modalState.complementos = [];
  modalState.observacao = '';
  modalState.qtd = 1;

  renderWizard();
  atualizarResumo();

  if (modalProduto) {
    modalProduto.removeAttribute('aria-hidden');
    modalProduto.setAttribute('data-aberto', 'true');
    document.body.style.overflow = 'hidden';
  }
}

// Função para selecionar tamanho
function selecionarTamanho(tamanhoId) {
  modalState.tamanho = tamanhoId;
  renderWizard();
  atualizarResumo();
}

// Função para alternar complemento
function toggleComplemento(complementoId, selecionado) {
  if (selecionado) {
    modalState.complementos.push(complementoId);
  } else {
    modalState.complementos = modalState.complementos.filter((c) => c !== complementoId);
  }
  renderWizard();
  atualizarResumo();
}

// Função para renderizar o resumo
function atualizarResumo() {
  let preco = 0;
  let tamanhoTexto = '--';
  let compsTexto = '--';

  if (modalState.tamanho) {
    const t = tamanhos.find((x) => x.id === modalState.tamanho);
    if (t) {
      preco = t.preco;
      tamanhoTexto = `${t.nome} · ${t.valor}`;
    }
  }

  modalState.complementos.forEach((cid) => {
    const cat = acompanhamentos.find((c) => c.itens.some((i) => i.id === cid));
    if (cat) {
      const item = cat.itens.find((i) => i.id === cid);
      if (item) {
        preco += item.preco;
        if (compsTexto === '--') compsTexto = item.nome;
        else compsTexto += ', ' + item.nome;
      }
    }
  });

  const resumoTamanho = document.getElementById('resumo-tamanho');
  const resumoComplementos = document.getElementById('resumo-complementos');
  const resumoTotal = document.getElementById('resumo-total');

  if (resumoTamanho) resumoTamanho.textContent = tamanhoTexto;
  if (resumoComplementos) resumoComplementos.textContent = compsTexto;
  if (resumoTotal) resumoTotal.textContent = formatarMoeda(preco);

  // Aplica estilo vazio se não houver complementos
  if (resumoComplementos) {
    if (compsTexto === '--') {
      resumoComplementos.classList.add('empty');
    } else {
      resumoComplementos.classList.remove('empty');
    }
  }

  if (resumoTamanho) {
    if (tamanhoTexto === '--') {
      resumoTamanho.classList.add('empty');
    } else {
      resumoTamanho.classList.remove('empty');
    }
  }
}

// Elementos do DOM (global scope) - serão definidos no DOMContentLocalized
const cartDrawer = document.getElementById('carrinho');
const modalCheckout = document.getElementById('modal-checkout');
let modalProduto; // definido dinamicamente

// Função para renderizar o carrinho (global scope)
function atualizarCarrinho() {
  const cartItens = document.getElementById('cart-itens');
  const cartCount = document.getElementById('cart-count');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cartVazio = document.getElementById('cart-vazio');
  const cartResumo = document.getElementById('cart-resumo');

  if (!cartItens) return;

  cartItens.innerHTML = '';
  let totalItens = 0;
  let subtotal = 0;

  if (carrinho.length === 0) {
    if (cartVazio) cartVazio.style.display = 'block';
    if (cartResumo) cartResumo.style.display = 'none';
    if (document.getElementById('btn-checkout')) document.getElementById('btn-checkout').disabled = true;
  } else {
    if (cartVazio) cartVazio.style.display = 'none';
    if (cartResumo) cartResumo.style.display = 'block';
    if (document.getElementById('btn-checkout')) document.getElementById('btn-checkout').disabled = false;

    carrinho.forEach((item, idx) => {
      subtotal += item.preco * item.qtd;
      totalItens += item.qtd;

      const compsHtml =
        item.complementos && item.complementos.length
          ? `<div class="comps">+ ${item.complementos
              .map((cid) => {
                  const cat = acompanhamentos.find(
                    (c) => c.itens.some((i) => i.id === cid)
                  );
                  return cat ? cat.itens.find((i) => i.id === cid)?.nome || cid : cid;
                })
              .join(', ')}</div>`
          : '';

      const obsHtml = item.observacao
        ? `<div class="obs">Observação: ${item.observacao}</div>`
        : '';

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="imagem">🫐</div>
        <div class="info">
          <div class="nome">${item.nome}</div>
          <div class="tamanho-cart">${item.tamanho}</div>
          ${compsHtml}
          ${obsHtml}
          <div class="preco">${formatarMoeda(item.preco)}</div>
        </div>
        <div class="cart-qtd">
          <button type="button" data-acao="diminuir" data-idx="${idx}">−</button>
          <span>${item.qtd}</span>
          <button type="button" data-acao="aumentar" data-idx="${idx}">+</button>
          <button type="button" class="remover" data-acao="remover" data-idx="${idx}" title="Remover">🗑️</button>
        </div>
      `;
      cartItens.appendChild(el);
    });
  }

  if (cartCount) cartCount.textContent = totalItens;
  if (cartCountBadge) cartCountBadge.textContent = totalItens + ' itens';
  if (cartSubtotal) cartSubtotal.textContent = formatarMoeda(subtotal);
  if (cartTotal) cartTotal.textContent = formatarMoeda(subtotal);

  // Delegação de eventos para os botões do carrinho
  cartItens.onclick = (e) => {
    const btn = e.target.closest('button[data-acao]');
    if (!btn) return;

    const idx = parseInt(btn.dataset.idx);
    const acao = btn.dataset.acao;

    if (acao === 'aumentar') {
      carrinho[idx].qtd += 1;
    } else if (acao === 'diminuir') {
      carrinho[idx].qtd -= 1;
      if (carrinho[idx].qtd <= 0) carrinho.splice(idx, 1);
    } else if (acao === 'remover') {
      carrinho.splice(idx, 1);
    }

    // Atualizar display - incluindo nomes dos complementos
    const item = carrinho[idx];
    const compsHtml =
      item.complementos && item.complementos.length
        ? `<div class="comps">+ ${item.complementos
            .map((cid) => {
              const cat = acompanhamentos.find(
                (c) => c.itens.some((i) => i.id === cid)
              );
              return cat ? cat.itens.find((i) => i.id === cid)?.nome || cid : cid;
            })
            .join(', ')}</div>`
        : '';

    // Recarregar carrinho para atualizar o display completo
    atualizarCarrinho();
  };
}

// Função para renderizar o wizard
function renderWizard() {
  // Atualiza progresso visual
  document.querySelectorAll('.step-progress').forEach((el) => {
    const step = parseInt(el.dataset.step);
    el.classList.toggle('active', step === modalState.etapa);
  });

  document.querySelectorAll('.progress-label').forEach((el) => {
    const step = parseInt(el.id.replace('lbl-', ''));
    el.classList.toggle('active', step === modalState.etapa);
  });

  // Etapa 1: Tamanho
  const tamanhosEl = document.getElementById('buy-tamanhos');
  if (tamanhosEl) {
    tamanhosEl.innerHTML = tamanhos
      .map(
        (t) => `
      <label class="tamanho-card ${modalState.tamanho === t.id ? 'selected' : ''}">
        <input type="radio" name="tamanho" value="${t.id}" ${modalState.tamanho === t.id ? 'checked' : ''} onchange="selecionarTamanho('${t.id}')">
        <span class="tamanho-nome">${t.nome}</span>
        <span class="tamanho-info">${t.valor} · ${formatarMoeda(t.preco)}</span>
      </label>
      `
      )
      .join('');
  }

  // Etapa 2: Complementos (em grid)
  const compsEl = document.getElementById('buy-complementos');
  if (compsEl) {
    compsEl.innerHTML = acompanhamentos
      .flatMap((cat) => cat.itens)
      .map(
        (c) => `
      <label class="complemento-card ${modalState.complementos.includes(c.id) ? 'selected' : ''}">
        <input type="checkbox" value="${c.id}" ${modalState.complementos.includes(c.id) ? 'checked' : ''} onchange="toggleComplemento('${c.id}', this.checked)">
        <span class="complemento-emoji">${c.emoji}</span>
        <span class="complemento-card-nome">${c.nome}</span>
        <span class="complemento-card-preco">+ ${formatarMoeda(c.preco)}</span>
      </label>
      `
      )
      .join('');
  }

  // Etapa 3: Observação
  const obsTextarea = document.getElementById('buy-observacao');
  if (obsTextarea) obsTextarea.value = modalState.observacao;

  // Etapa 4: Quantidade
  const qtdInput = document.getElementById('buy-qtd');
  if (qtdInput) qtdInput.value = modalState.qtd;

  // Mostra/esconde painéis
  document.querySelectorAll('.buy-panel').forEach((panel) => {
    panel.classList.toggle('active', parseInt(panel.dataset.step) === modalState.etapa);
  });

  // Botões de navegação
  const btnVoltar = document.getElementById('buy-voltar');
  const btnProximo = document.getElementById('buy-proximo');
  const btnAdd = document.getElementById('buy-add');

  if (btnVoltar) btnVoltar.style.display = modalState.etapa > 1 ? 'inline-flex' : 'none';

  if (modalState.etapa === 4) {
    if (btnProximo) btnProximo.style.display = 'none';
    if (btnAdd) btnAdd.style.display = 'inline-flex';
  } else {
    if (btnProximo) btnProximo.style.display = 'inline-flex';
    if (btnAdd) btnAdd.style.display = 'none';
  }

  // Desabilita "Próximo" na etapa 1 se nenhum tamanho selecionado
  if (btnProximo) {
    if (modalState.etapa === 1 && !modalState.tamanho) {
      btnProximo.disabled = true;
    } else {
      btnProximo.disabled = false;
    }
  }
}

// ---------- Inicialização quando o DOM estiver pronto ----------
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const btnFazerPedidoTopo = document.getElementById('btn-fazer-pedido-topo');
  modalProduto = document.getElementById('modal-produto');
  
  // ---------- Botões Fazer Pedido ----------
  if (btnFazerPedidoTopo) {
    btnFazerPedidoTopo.addEventListener('click', abrirPedido);
  }

  // ---------- Fecha com ESC ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal[data-aberto="true"]').forEach((m) => fecharModal(m.id));
      if (cartDrawer) cartDrawer.removeAttribute('data-aberto');
      document.body.style.overflow = '';
    }
  });

  // ---------- Navegação do wizard ----------
  const btnVoltar = document.getElementById('buy-voltar');
  const btnProximo = document.getElementById('buy-proximo');

  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      modalState.etapa = modalState.etapa > 1 ? modalState.etapa - 1 : 1;
      renderWizard();
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener('click', () => {
      // Na etapa 1, verificar se tamanho foi selecionado
      if (modalState.etapa === 1 && !modalState.tamanho) {
        btnProximo.disabled = true;
        return;
      }
      // Avançar para próxima etapa
      modalState.etapa++;
      renderWizard();
    });
  }

  // ---------- Adicionar ao carrinho ----------
  const btnAdd = document.getElementById('buy-add');

  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      // Criar objeto do item do carrinho
      const item = {
        nome: document.getElementById('buy-titulo')?.textContent || 'Açaí Factory',
        tamanho: modalState.tamanho || '300ml',
        qtd: modalState.qtd,
        preco: 0,
        complementos: [...modalState.complementos],
        observacao: modalState.observacao
      };
      
      // Calcular preço base baseado no tamanho selecionado
      const t = tamanhos.find((x) => x.id === modalState.tamanho);
      if (t) {
        item.preco = t.preco;
      } else {
        item.preco = 16.00; // preço padrão
      }
      
      // Adicionar complementos ao preço
      modalState.complementos.forEach((cid) => {
        const cat = acompanhamentos.find((c) => c.itens.some((i) => i.id === cid));
        if (cat) {
          const itemCat = cat.itens.find((i) => i.id === cid);
          if (itemCat) {
            item.preco += itemCat.preco;
          }
        }
      });
      
      // Adicionar ao carrinho
      carrinho.push(item);
      
      // Atualizar display do carrinho
      atualizarCarrinho();
      
      // Fechar o modal do pedido
      fecharModal('modal-produto');
    });
  }

  // ---------- Fecha modais com botão "X" (data-fechar) ----------
  document.querySelectorAll('[data-fechar]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modal = btn.closest('.modal');
      if (modal) fecharModal(modal.id);
    });
  });

  // ---------- Login Admin ----------
  const btnAdmin = document.getElementById('btn-admin');
  const modalLogin = document.getElementById('modal-login');
  const formLogin = document.getElementById('form-login');
  const loginErro = document.getElementById('login-erro');
  const SENHA_ADMIN = 'factory123';

  if (btnAdmin && modalLogin) {
    btnAdmin.addEventListener('click', () => {
      modalLogin.removeAttribute('aria-hidden');
      modalLogin.setAttribute('data-aberto', 'true');
      document.body.style.overflow = 'hidden';
    });

    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const senha = document.getElementById('login-senha').value;

        if (senha === SENHA_ADMIN) {
          fecharModal('modal-login');
          if (loginErro) loginErro.style.display = 'none';
          formLogin.reset();
          window.location.href = 'admin.html';
        } else {
          if (loginErro) loginErro.style.display = 'block';
          document.getElementById('login-senha').focus();
        }
      });
    }

    function fecharModalLogin() {
      modalLogin.removeAttribute('data-aberto');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-fechar-login]').forEach((btn) => {
      btn.addEventListener('click', fecharModalLogin);
    });

    const overlayLogin = modalLogin.querySelector('.modal-overlay');
    if (overlayLogin) {
      overlayLogin.addEventListener('click', fecharModalLogin);
    }

    const btnCancelarLogin = document.getElementById('btn-cancelar-login');
    if (btnCancelarLogin) {
      btnCancelarLogin.addEventListener('click', fecharModalLogin);
    }
  }

  // ---------- Checkout simulado ----------
  const btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout && modalCheckout) {
    btnCheckout.addEventListener('click', () => {
      modalCheckout.removeAttribute('aria-hidden');
      modalCheckout.setAttribute('data-aberto', 'true');
    });
  }

  const formCheckout = document.getElementById('form-checkout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('checkout-nome').value;
      const endereco = document.getElementById('checkout-endereco').value;
      const telefone = document.getElementById('checkout-telefone').value;
      const pagamento = document.getElementById('checkout-pagamento').value;
      const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
      const msg = document.getElementById('checkout-msg');

      const pedidoId = Date.now();

      if (msg) {
        msg.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:1.2rem; font-weight:800; color:#2e7d32; margin-bottom:10px;">✅ Pedido recebido!</div>
            <div style="font-size:1rem; color:#333; margin-bottom:5px;">Número do seu pedido: <strong style="color:#5b149a;">#${pedidoId}</strong></div>
            <div style="font-size:0.9rem; color:#666; margin-bottom:15px;">Total: ${formatarMoeda(total)} | Pagamento: ${pagamento}</div>
            <div style="font-size:0.9rem; color:#666; margin-bottom:15px;">Telefone: ${telefone}</div>
            <div style="font-size:0.85rem; color:#888;">Guarde este número para consultar seu pedido.</div>
          </div>
        `;
      }

      // Salvar pedido no localStorage
      const pedido = {
        id: pedidoId,
        nome,
        endereco,
        telefone,
        pagamento,
        total,
        status: 'Pendente',
        data: new Date().toLocaleString('pt-BR'),
        itens: carrinho.map(i => ({
          nome: i.nome,
          tamanho: i.tamanho,
          qtd: i.qtd,
          preco: i.preco,
          complementos: i.complementos,
          observacao: i.observacao
        }))
      };

      const pedidosSalvos = JSON.parse(localStorage.getItem('factory_pedidos') || '[]');
      pedidosSalvos.push(pedido);
      localStorage.setItem('factory_pedidos', JSON.stringify(pedidosSalvos));

      setTimeout(() => {
        carrinho = [];
        atualizarCarrinho();
        fecharModal('modal-checkout');
        if (formCheckout) formCheckout.reset();
        if (msg) msg.innerHTML = '';
      }, 2500);
    });
  }

  // ---------- Inicialização ----------
  atualizarCarrinho();
});
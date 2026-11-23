const API_BASE_URL = "https://ppw-1-tads.vercel.app";

async function requisicaoAPI(endpoint, opcoes = {}) {
  try {
    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...opcoes.headers
      },
      ...opcoes
    });

    // 1. Lê o JSON (a API sempre retorna { sucesso, mensagem, ... })
    const dados = await resposta.json();

    // 2. Valida response.ok / response.status ANTES de assumir sucesso
    if (!resposta.ok) {
      return {
        ok: false,
        status: resposta.status,
        mensagem: dados.mensagem || `Erro inesperado (${resposta.status})`,
        dados
      };
    }

    return {
      ok: true,
      status: resposta.status,
      dados
    };
  } catch (erro) {
    console.error("Falha na requisição:", erro);
    return {
      ok: false,
      status: 0,
      mensagem: "Erro de conexão com o servidor. Verifique sua internet."
    };
  }
}

// =========================================================
// CONTROLE DO MENU DO USUÁRIO E TEMA (PADRÃO ÓTICAS VISÃO)
// =========================================================

function atualizarMenuUsuario() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const menuUsuario = document.getElementById('menuUsuario');

  if (!menuUsuario) return;

  if (usuarioLogado) {
    // Requisito 1.a: Logado mostra APENAS "Meus Dados", "Meus Pedidos" e "Sair"
    menuUsuario.innerHTML = `
      <li><a class="dropdown-item" href="meus_dados.html" style="color: #350909 !important;"><strong>Meus Dados</strong></a></li>
      <li><a class="dropdown-item" href="meus_pedidos.html" style="color: #350909 !important;"><strong>Meus Pedidos</strong></a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger" href="#" onclick="fazerLogout(event)" style="color: #350909 !important;"><strong>Sair</strong></a></li>
    `;
  } else {
    // Mantém exatamente a sua estrutura original quando deslogado
    menuUsuario.innerHTML = `
      <li><a class="dropdown-item" href="login.html" style="color: #350909 !important;"><strong>Login / Cadastrar-se</strong></a></li>
      <li><a class="dropdown-item" href="carrinho.html" style="color: #350909 !important;"><strong>Carrinho</strong></a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="contato.html" style="color: #350909 !important;"><strong>Contato</strong></a></li>
    `;
  }
}

function fazerLogout(e) {
  if (e) e.preventDefault();
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

function aplicarTemaDoSistema() {
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-bs-theme', prefereEscuro ? 'dark' : 'light');
}

aplicarTemaDoSistema();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTemaDoSistema);

function atualizarBadgeCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinhoOtica')) || [];
  const totalItens = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);

  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = totalItens;
    badge.style.display = totalItens > 0 ? 'inline-block' : 'none';
  }

  const imgCarrinho = document.querySelector('.carrinho-img');
  if (imgCarrinho) {
    if (totalItens > 0) {
      imgCarrinho.src = 'img/carrinho-cheio.png';
      imgCarrinho.classList.add('carrinho-cheio');
    } else {
      imgCarrinho.src = 'img/carrinho.png';
      imgCarrinho.classList.remove('carrinho-cheio');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarMenuUsuario();
  atualizarBadgeCarrinho();
});
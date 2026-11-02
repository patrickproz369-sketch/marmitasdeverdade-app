import React, { useState, useMemo } from 'react';
import './App.css';

// 1. BANCO DE DADOS & DADOS NUTRICIONAIS REAIS (TACO/USDA)
const BASE_ADICIONAIS = [
  { id: 'ovo', nome: 'Ovo Caipira Cozido (1 un)', preco: 3.50, desc: 'Albumina e colina pura', nutri: { cal: 74, prot: 6.3, carb: 0.6, gord: 5.0, fibra: 0 } },
  { id: 'frango_extra', nome: 'Porção Extra de Frango (100g)', preco: 8.50, desc: 'Peito grelhado em cubos', nutri: { cal: 159, prot: 32.0, carb: 0.0, gord: 3.2, fibra: 0 } },
  { id: 'carne_extra', nome: 'Porção Extra de Patinho (100g)', preco: 10.90, desc: 'Carne magra refogada', nutri: { cal: 172, prot: 29.5, carb: 0.0, gord: 5.8, fibra: 0 } },
  { id: 'bacon_crispy', nome: 'Bacon Artesanal Crocante (30g)', preco: 5.90, desc: 'Defumação natural em lenha', nutri: { cal: 135, prot: 9.2, carb: 0.4, gord: 11.0, fibra: 0 } },
  { id: 'queijo_minas', nome: 'Queijo Minas Frescal Selado (50g)', preco: 5.50, desc: 'Leve e rico em cálcio', nutri: { cal: 120, prot: 8.5, carb: 1.6, gord: 9.0, fibra: 0 } },
  { id: 'legumes_extra', nome: 'Mix de Legumes no Vapor (120g)', preco: 4.90, desc: 'Brócolis, cenoura e vagem', nutri: { cal: 52, prot: 2.4, carb: 9.2, gord: 0.4, fibra: 4.1 } },
  { id: 'arroz_extra', nome: 'Porção Extra Arroz Integral (100g)', preco: 4.00, desc: 'Arroz agulhinha integral', nutri: { cal: 124, prot: 2.6, carb: 25.8, gord: 1.0, fibra: 2.7 } },
  { id: 'feijao_extra', nome: 'Feijão Carioca Cremoso (100g)', preco: 4.50, desc: 'Tempero caseiro suave', nutri: { cal: 91, prot: 5.5, carb: 16.2, gord: 0.5, fibra: 6.4 } }
];

const OPCOES_MONTAGEM = {
  tamanhos: [
    { id: 'P', nome: 'Tamanho P (320g)', peso: '320g', preco: 19.90, fatorNutri: 0.8 },
    { id: 'M', nome: 'Tamanho M (450g) - Mais Vendido', peso: '450g', preco: 24.90, fatorNutri: 1.0 },
    { id: 'G', nome: 'Tamanho G (600g) - Hipertrofia', peso: '600g', preco: 30.90, fatorNutri: 1.35 }
  ],
  proteinas: [
    { id: 'frango', nome: 'Peito de Frango em Cubos Grelhado', precoExtra: 0, nutri: { cal: 160, prot: 32, carb: 0, gord: 3.2, fibra: 0 } },
    { id: 'patinho', nome: 'Patinho Moído Magro Refogado', precoExtra: 2.50, nutri: { cal: 175, prot: 30, carb: 0, gord: 6.0, fibra: 0 } },
    { id: 'tilapia', nome: 'Filé de Tilápia com Crosta de Ervas', precoExtra: 4.00, nutri: { cal: 140, prot: 28, carb: 0, gord: 2.8, fibra: 0 } },
    { id: 'grao_bico', nome: 'Mix Vegano de Cogumelos & Grão de Bico', precoExtra: 2.00, nutri: { cal: 180, prot: 12, carb: 26, gord: 4.0, fibra: 7.5 } }
  ],
  bases: [
    { id: 'arroz_int', nome: 'Arroz Integral Cateto com Cenoura', precoExtra: 0, nutri: { cal: 130, prot: 2.7, carb: 27, gord: 1.0, fibra: 2.8 } },
    { id: 'pure_batata_doce', nome: 'Purê Aveludado de Batata Doce', precoExtra: 0, nutri: { cal: 115, prot: 1.6, carb: 26, gord: 0.5, fibra: 3.0 } },
    { id: 'mandioca', nome: 'Mandioca Cozida no Vapor com Salsa', precoExtra: 1.00, nutri: { cal: 145, prot: 1.2, carb: 35, gord: 0.3, fibra: 2.0 } },
    { id: 'quinoa', nome: 'Quinoa Real em Grãos com Alho-Poró', precoExtra: 3.50, nutri: { cal: 140, prot: 5.0, carb: 24, gord: 2.2, fibra: 3.5 } }
  ],
  legumes: [
    { id: 'brocolis', nome: 'Brócolis ao Alho Dourado', precoExtra: 0, nutri: { cal: 35, prot: 2.8, carb: 5.0, gord: 0.4, fibra: 3.0 } },
    { id: 'abobrinha', nome: 'Abobrinha Italiana Grelhada', precoExtra: 0, nutri: { cal: 25, prot: 1.5, carb: 3.8, gord: 0.3, fibra: 1.8 } },
    { id: 'cenoura_vagem', nome: 'Mix de Cenoura e Vagem no Azeite', precoExtra: 0, nutri: { cal: 40, prot: 1.8, carb: 7.2, gord: 0.6, fibra: 2.9 } },
    { id: 'aspargos', nome: 'Aspargos Verdes Selados', precoExtra: 4.00, nutri: { cal: 30, prot: 2.5, carb: 4.0, gord: 0.2, fibra: 2.2 } }
  ],
  ingredientesRetiraveis: [
    'Sem Alho', 'Sem Cebola', 'Sem Sal Extra / Hipossódico', 'Sem Azeite no Acabamento'
  ]
};

const MARMITAS_PRONTAS = [
  {
    id: 1,
    nome: "Marmita Fit - Frango com Batata Doce",
    categoria: "Mais Vendida",
    badgeClasse: "badge-laranja",
    descricao: "Peito de frango grelhado em cubos, purê aveludado de batata doce e brócolis ao alho.",
    preco: 21.90,
    imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Frango Grelhado (140g)",
      base: "Purê de Batata Doce (150g)",
      legumes: ["Brócolis ao Alho (90g)"]
    },
    nutri: { cal: 385, prot: 41, carb: 36, gord: 4.8, fibra: 6.2 }
  },
  {
    id: 2,
    nome: "Patinho Moído Nobre com Arroz Integral",
    categoria: "Hipertrofia",
    badgeClasse: "badge-vermelho",
    descricao: "Carne moída magra refogada, arroz integral cateto e mix de legumes frescos salteados.",
    preco: 24.50,
    imagem: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Patinho Moído Magro (150g)",
      base: "Arroz Integral c/ Cenoura (140g)",
      legumes: ["Mix de Legumes (100g)"]
    },
    nutri: { cal: 440, prot: 43, carb: 39, gord: 8.5, fibra: 6.8 }
  },
  {
    id: 3,
    nome: "Tilápia com Crosta de Ervas & Legumes",
    categoria: "Low Carb",
    badgeClasse: "badge-verde",
    descricao: "Filé de tilápia fresca, crosta crocante de ervas finas, abobrinha e cenoura na chapa.",
    preco: 26.90,
    imagem: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Tilápia em Crosta (160g)",
      base: "Mix Low Carb de Vegetais (150g)",
      legumes: ["Abobrinha e Vagem (90g)"]
    },
    nutri: { cal: 310, prot: 37, carb: 11, gord: 5.4, fibra: 5.1 }
  },
  {
    id: 4,
    nome: "Strogonoff Fit de Frango Cremoso",
    categoria: "Equilíbrio",
    badgeClasse: "badge-roxo",
    descricao: "Cubos de frango macios, molho suave à base de iogurte natural, arroz integral e batatas assadas.",
    preco: 23.90,
    imagem: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Strogonoff Light (150g)",
      base: "Arroz Integral (120g)",
      legumes: ["Batatas Rústicas Assadas (80g)"]
    },
    nutri: { cal: 415, prot: 38, carb: 42, gord: 7.9, fibra: 4.5 }
  },
  {
    id: 5,
    nome: "Escondidinho de Mandioca com Carne Seca",
    categoria: "Especial",
    badgeClasse: "badge-laranja",
    descricao: "Mandioca cremosa sem lactose, carne seca premium desfiada e queijo minas gratinado.",
    preco: 27.00,
    imagem: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Carne Seca Dessalgada (140g)",
      base: "Purê Rústico de Mandioca (160g)",
      legumes: ["Queijo Minas Gratinado (30g)"]
    },
    nutri: { cal: 480, prot: 39, carb: 48, gord: 11.5, fibra: 4.0 }
  },
  {
    id: 6,
    nome: "Bowl Vegano Energético de Grão de Bico",
    categoria: "Vegano",
    badgeClasse: "badge-ciano",
    descricao: "Grão de bico crocante, cogumelos salteados, quinoa real, tomate cereja confit e cubos de abacate.",
    preco: 25.50,
    imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    composicaoPadrao: {
      proteina: "Cogumelos & Grão de Bico (150g)",
      base: "Quinoa Real (120g)",
      legumes: ["Abacate & Tomates Confit (90g)"]
    },
    nutri: { cal: 390, prot: 18, carb: 49, gord: 12.0, fibra: 11.4 }
  }
];

export default function App() {
  const SEU_WHATSAPP = "5531995516104";

  const [carrinho, setCarrinho] = useState([]);
  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const [modalNutriItem, setModalNutriItem] = useState(null);
  const [modalCustomizar, setModalCustomizar] = useState(false);
  const [modalCheckout, setModalCheckout] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const [cliente, setCliente] = useState({
    nome: "",
    endereco: "",
    bairro: "",
    pagamento: "PIX",
    trocoPara: ""
  });

  const [customizacao, setCustomizacao] = useState({
    itemOriginal: null,
    tamanho: OPCOES_MONTAGEM.tamanhos[1],
    proteina: OPCOES_MONTAGEM.proteinas[0],
    base: OPCOES_MONTAGEM.bases[0],
    legumes: [OPCOES_MONTAGEM.legumes[0].id],
    remocoes: [],
    adicionaisQtd: {},
    obsItem: ""
  });

  const calculoCustomizacao = useMemo(() => {
    let preco = customizacao.tamanho.preco;
    let nutri = { cal: 0, prot: 0, carb: 0, gord: 0, fibra: 0 };
    const fator = customizacao.tamanho.fatorNutri;

    if (customizacao.proteina) {
      preco += customizacao.proteina.precoExtra || 0;
      nutri.cal += (customizacao.proteina.nutri.cal * fator);
      nutri.prot += (customizacao.proteina.nutri.prot * fator);
      nutri.carb += (customizacao.proteina.nutri.carb * fator);
      nutri.gord += (customizacao.proteina.nutri.gord * fator);
      nutri.fibra += (customizacao.proteina.nutri.fibra * fator);
    }

    if (customizacao.base) {
      preco += customizacao.base.precoExtra || 0;
      nutri.cal += (customizacao.base.nutri.cal * fator);
      nutri.prot += (customizacao.base.nutri.prot * fator);
      nutri.carb += (customizacao.base.nutri.carb * fator);
      nutri.gord += (customizacao.base.nutri.gord * fator);
      nutri.fibra += (customizacao.base.nutri.fibra * fator);
    }

    customizacao.legumes.forEach(legId => {
      const leg = OPCOES_MONTAGEM.legumes.find(l => l.id === legId);
      if (leg) {
        preco += leg.precoExtra || 0;
        nutri.cal += leg.nutri.cal;
        nutri.prot += leg.nutri.prot;
        nutri.carb += leg.nutri.carb;
        nutri.gord += leg.nutri.gord;
        nutri.fibra += leg.nutri.fibra;
      }
    });

    BASE_ADICIONAIS.forEach(add => {
      const qtd = customizacao.adicionaisQtd[add.id] || 0;
      if (qtd > 0) {
        preco += add.preco * qtd;
        nutri.cal += add.nutri.cal * qtd;
        nutri.prot += add.nutri.prot * qtd;
        nutri.carb += add.nutri.carb * qtd;
        nutri.gord += add.nutri.gord * qtd;
        nutri.fibra += add.nutri.fibra * qtd;
      }
    });

    return {
      precoFinal: preco,
      nutri: {
        cal: Math.round(nutri.cal),
        prot: Math.round(nutri.prot),
        carb: Math.round(nutri.carb),
        gord: Math.round(nutri.gord),
        fibra: Math.round(nutri.fibra)
      }
    };
  }, [customizacao]);

  const abrirMontador = (itemOriginal = null) => {
    setCustomizacao({
      itemOriginal: itemOriginal,
      tamanho: OPCOES_MONTAGEM.tamanhos[1],
      proteina: OPCOES_MONTAGEM.proteinas[0],
      base: OPCOES_MONTAGEM.bases[0],
      legumes: [OPCOES_MONTAGEM.legumes[0].id],
      remocoes: [],
      adicionaisQtd: {},
      obsItem: ""
    });
    setModalCustomizar(true);
  };

  const alterarQtdAdicional = (adicionalId, delta) => {
    setCustomizacao(prev => {
      const qtdAtual = prev.adicionaisQtd[adicionalId] || 0;
      const novaQtd = Math.max(0, qtdAtual + delta);
      return {
        ...prev,
        adicionaisQtd: { ...prev.adicionaisQtd, [adicionalId]: novaQtd }
      };
    });
  };

  const alternarLegume = (id) => {
    setCustomizacao(prev => {
      const existe = prev.legumes.includes(id);
      if (existe) {
        if (prev.legumes.length === 1) return prev;
        return { ...prev, legumes: prev.legumes.filter(item => item !== id) };
      } else {
        if (prev.legumes.length >= 3) return prev;
        return { ...prev, legumes: [...prev.legumes, id] };
      }
    });
  };

  const alternarRemocao = (ingrediente) => {
    setCustomizacao(prev => {
      const existe = prev.remocoes.includes(ingrediente);
      return {
        ...prev,
        remocoes: existe ? prev.remocoes.filter(i => i !== ingrediente) : [...prev.remocoes, ingrediente]
      };
    });
  };

  const salvarNoCarrinho = () => {
    const listaAdicionais = BASE_ADICIONAIS
      .filter(add => (customizacao.adicionaisQtd[add.id] || 0) > 0)
      .map(add => ({
        ...add,
        qtd: customizacao.adicionaisQtd[add.id]
      }));

    const novoItem = {
      cartId: Date.now() + Math.random(),
      nome: customizacao.itemOriginal ? customizacao.itemOriginal.nome : `Marmita Personalizada (${customizacao.tamanho.nome.split(' ')[0]})`,
      tipo: customizacao.itemOriginal ? "Prato Customizado" : "Monte Sua Marmita",
      tamanho: customizacao.tamanho.nome,
      proteina: customizacao.proteina.nome,
      base: customizacao.base.nome,
      legumes: customizacao.legumes.map(lid => OPCOES_MONTAGEM.legumes.find(l => l.id === lid)?.nome),
      remocoes: customizacao.remocoes,
      adicionais: listaAdicionais,
      obsItem: customizacao.obsItem,
      precoUnitario: calculoCustomizacao.precoFinal,
      qtd: 1,
      nutri: calculoCustomizacao.nutri
    };

    setCarrinho([...carrinho, novoItem]);
    setModalCustomizar(false);
    setCarrinhoAberto(true);
  };

  const adicionarPratoDireto = (marmita) => {
    const novoItem = {
      cartId: Date.now() + Math.random(),
      nome: marmita.nome,
      tipo: "Prato Pronto",
      tamanho: "Padrão da Casa (400g)",
      proteina: marmita.composicaoPadrao.proteina,
      base: marmita.composicaoPadrao.base,
      legumes: marmita.composicaoPadrao.legumes,
      remocoes: [],
      adicionais: [],
      obsItem: "",
      precoUnitario: marmita.preco,
      qtd: 1,
      nutri: marmita.nutri
    };
    setCarrinho([...carrinho, novoItem]);
    setCarrinhoAberto(true);
  };

  const alterarQtdCarrinho = (cartId, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.cartId === cartId) {
        const novaQtd = item.qtd + delta;
        return novaQtd > 0 ? { ...item, qtd: novaQtd } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removerDoCarrinho = (cartId) => {
    setCarrinho(carrinho.filter(i => i.cartId !== cartId));
  };

  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.precoUnitario * item.qtd), 0);
  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.qtd, 0);

  const finalizarPedidoWhatsApp = () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    if (!cliente.nome.trim() || !cliente.endereco.trim() || !cliente.bairro.trim()) {
      return alert("Por favor, preencha nome, endereço e bairro para entrega!");
    }

    let msg = `🍱 *NOVO PEDIDO - MARMITAS DE VERDADE*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Cliente:* ${cliente.nome.trim()}\n`;
    msg += `📍 *Endereço:* ${cliente.endereco.trim()} - ${cliente.bairro.trim()}\n`;
    msg += `💳 *Pagamento:* ${cliente.pagamento}`;
    if (cliente.pagamento === "Dinheiro" && cliente.trocoPara) {
      msg += ` (Troco para R$ ${cliente.trocoPara})`;
    }
    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📋 *ITENS ESCOLHIDOS:*\n\n`;

    carrinho.forEach((item, index) => {
      msg += `*${index + 1}. ${item.qtd}x ${item.nome}*\n`;
      msg += `   ▫️ *Tamanho:* ${item.tamanho}\n`;
      msg += `   ▫️ *Proteína:* ${item.proteina}\n`;
      msg += `   ▫️ *Base:* ${item.base}\n`;
      msg += `   ▫️ *Legumes:* ${item.legumes.join(', ')}\n`;

      if (item.remocoes && item.remocoes.length > 0) {
        msg += `   ⚠️ *Retirar:* ${item.remocoes.join(', ')}\n`;
      }
      if (item.adicionais && item.adicionais.length > 0) {
        msg += `   ➕ *Adicionais:*\n`;
        item.adicionais.forEach(add => {
          msg += `      • ${add.qtd}x ${add.nome} (+R$ ${(add.preco * add.qtd).toFixed(2)})\n`;
        });
      }
      if (item.nutri) {
        msg += `   📊 *Nutri/unidade:* ${item.nutri.cal} kcal | P: ${item.nutri.prot}g | C: ${item.nutri.carb}g | G: ${item.nutri.gord}g\n`;
      }
      msg += `   💵 *Subtotal:* R$ ${(item.precoUnitario * item.qtd).toFixed(2)}\n\n`;
    });

    if (observacoesGerais.trim()) {
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📝 *Observações:* ${observacoesGerais.trim()}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *VALOR TOTAL: R$ ${totalCarrinho.toFixed(2)}*\n`;
    msg += `🛵 _Taxa de entrega a combinar conforme rota._\n`;

    const url = `https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const marmitasFiltradas = filtroCategoria === "Todas"
    ? MARMITAS_PRONTAS
    : MARMITAS_PRONTAS.filter(m => m.categoria.toLowerCase() === filtroCategoria.toLowerCase());

  return (
    <div className="app-container">
      {/* CABEÇALHO */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-group">
            <div className="logo-box">🍱</div>
            <div>
              <div className="brand-title">
                MARMITAS <span className="brand-highlight">DE VERDADE</span>
              </div>
              <p className="brand-subtitle">Alimentação Limpa • Ultra Fresca • Performance Diária</p>
            </div>
          </div>

          <button onClick={() => setCarrinhoAberto(true)} className="cart-btn-header">
            <span>🛒</span>
            <span className="cart-badge">{totalItensCarrinho}</span>
            <span>R$ {totalCarrinho.toFixed(2)}</span>
          </button>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag">⚡ NUTRIÇÃO INTELIGENTE & SOB MEDIDA</div>
          <h2 className="hero-title">Comida de verdade feita para os seus objetivos</h2>
          <p className="hero-desc">
            Escolha um prato do nosso cardápio balanceado ou <strong>monte sua marmita grama por grama</strong> com cálculo de macronutrientes em tempo real.
          </p>
          <div className="hero-actions">
            <button onClick={() => abrirMontador(null)} className="btn-primary">
              ✨ Montar Minha Marmita do Zero
            </button>
            <a href="#cardapio" className="btn-secondary">
              Ver Pratos Prontos ⬇
            </a>
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORIA */}
      <nav className="categories-nav" id="cardapio">
        {["Todas", "Mais Vendida", "Hipertrofia", "Low Carb", "Equilíbrio", "Vegano"].map(cat => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className={`category-btn ${filtroCategoria === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* GRID DE PRATOS */}
      <main className="main-content">
        <div className="dishes-grid">
          {marmitasFiltradas.map((marmita) => (
            <div key={marmita.id} className="dish-card">
              <span className={`card-badge ${marmita.badgeClasse}`}>
                {marmita.categoria}
              </span>

              <div className="card-media">
                <img src={marmita.imagem} alt={marmita.nome} className="card-img" />
                <button
                  onClick={() => setModalNutriItem(marmita)}
                  className="btn-nutri-badge"
                  title="Ver Tabela Nutricional"
                >
                  📊 {marmita.nutri ? `${marmita.nutri.cal} kcal` : 'Nutrição'}
                </button>
              </div>

              <div className="card-content">
                <h3 className="card-title">{marmita.nome}</h3>
                <p className="card-desc">{marmita.descricao}</p>

                {marmita.nutri ? (
                  <div className="macro-tags">
                    <span className="macro-tag">P: {marmita.nutri.prot}g</span>
                    <span className="macro-tag">C: {marmita.nutri.carb}g</span>
                    <span className="macro-tag">G: {marmita.nutri.gord}g</span>
                  </div>
                ) : (
                  <span className="macro-tag-empty">Informação nutricional não cadastrada</span>
                )}

                <div className="card-bottom">
                  <div className="price-group">
                    <span className="price-label">A partir de</span>
                    <div className="price-val">R$ {marmita.preco.toFixed(2)}</div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => abrirMontador(marmita)}
                      className="btn-outline"
                    >
                      ⚙️ Customizar
                    </button>
                    <button
                      onClick={() => adicionarPratoDireto(marmita)}
                      className="btn-add"
                    >
                      + Direto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL: PERSONALIZAÇÃO & MONTAGEM */}
      {modalCustomizar && (
        <div className="modal-overlay">
          <div className="modal-box modal-box-scroll">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Configurador Avançado</span>
                <h2 className="modal-heading">
                  {customizacao.itemOriginal ? `Customizar: ${customizacao.itemOriginal.nome}` : 'Monte Sua Marmita do Zero'}
                </h2>
              </div>
              <button onClick={() => setModalCustomizar(false)} className="btn-close">✕</button>
            </div>

            {/* Live Macro Bar */}
            <div className="live-macro-strip">
              <div className="macro-item">
                <span className="macro-num">{calculoCustomizacao.nutri.cal}</span>
                <span className="macro-lbl">Calorias (kcal)</span>
              </div>
              <div className="macro-item">
                <span className="macro-num">{calculoCustomizacao.nutri.prot}g</span>
                <span className="macro-lbl">Proteínas</span>
              </div>
              <div className="macro-item">
                <span className="macro-num">{calculoCustomizacao.nutri.carb}g</span>
                <span className="macro-lbl">Carbos</span>
              </div>
              <div className="macro-item">
                <span className="macro-num">{calculoCustomizacao.nutri.gord}g</span>
                <span className="macro-lbl">Gorduras</span>
              </div>
              <div className="macro-item">
                <span className="macro-num">{calculoCustomizacao.nutri.fibra}g</span>
                <span className="macro-lbl">Fibras</span>
              </div>
            </div>

            {/* 1. Tamanho */}
            <div className="config-step">
              <label className="step-title">1. Escolha a Gramatura / Tamanho</label>
              <div className="chips-grid">
                {OPCOES_MONTAGEM.tamanhos.map(tam => (
                  <button
                    key={tam.id}
                    onClick={() => setCustomizacao({ ...customizacao, tamanho: tam })}
                    className={`chip-card ${customizacao.tamanho.id === tam.id ? 'active' : ''}`}
                  >
                    <strong>{tam.nome}</strong>
                    <span className="chip-subprice">Base: R$ {tam.preco.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Proteína */}
            <div className="config-step">
              <label className="step-title">2. Selecione a Proteína</label>
              <div className="list-options">
                {OPCOES_MONTAGEM.proteinas.map(prot => (
                  <div
                    key={prot.id}
                    onClick={() => setCustomizacao({ ...customizacao, proteina: prot })}
                    className={`list-row ${customizacao.proteina.id === prot.id ? 'active' : ''}`}
                  >
                    <div className="row-info">
                      <strong>{prot.nome}</strong>
                      <span className="row-nutri">{prot.nutri.cal} kcal • {prot.nutri.prot}g prot</span>
                    </div>
                    <div className="row-price">
                      {prot.precoExtra > 0 ? `+ R$ ${prot.precoExtra.toFixed(2)}` : 'Incluso'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Base / Carboidrato */}
            <div className="config-step">
              <label className="step-title">3. Selecione a Base / Carboidrato</label>
              <div className="list-options">
                {OPCOES_MONTAGEM.bases.map(base => (
                  <div
                    key={base.id}
                    onClick={() => setCustomizacao({ ...customizacao, base: base })}
                    className={`list-row ${customizacao.base.id === base.id ? 'active' : ''}`}
                  >
                    <div className="row-info">
                      <strong>{base.nome}</strong>
                      <span className="row-nutri">{base.nutri.cal} kcal • {base.nutri.carb}g carb</span>
                    </div>
                    <div className="row-price">
                      {base.precoExtra > 0 ? `+ R$ ${base.precoExtra.toFixed(2)}` : 'Incluso'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Legumes */}
            <div className="config-step">
              <label className="step-title">4. Escolha seus Legumes (1 a 3 opções)</label>
              <div className="chips-grid">
                {OPCOES_MONTAGEM.legumes.map(leg => {
                  const sel = customizacao.legumes.includes(leg.id);
                  return (
                    <div
                      key={leg.id}
                      onClick={() => alternarLegume(leg.id)}
                      className={`chip-card ${sel ? 'active' : ''}`}
                    >
                      <strong>{sel ? '✓ ' : '+ '}{leg.nome}</strong>
                      <span className="chip-subprice">{leg.nutri.cal} kcal • {leg.nutri.fibra}g fibra</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Adicionais com preços */}
            <div className="config-step">
              <label className="step-title">5. Adicionais Turbinados (Opcional)</label>
              <div className="list-options">
                {BASE_ADICIONAIS.map(add => {
                  const qtd = customizacao.adicionaisQtd[add.id] || 0;
                  return (
                    <div key={add.id} className="addon-row">
                      <div className="addon-info">
                        <strong>{add.nome}</strong>
                        <span className="addon-desc">{add.desc}</span>
                        <span className="addon-nutri">+{add.nutri.cal} kcal | +{add.nutri.prot}g prot | R$ {add.preco.toFixed(2)} un</span>
                      </div>
                      <div className="stepper-control">
                        <button
                          onClick={() => alterarQtdAdicional(add.id, -1)}
                          className="stepper-btn"
                          disabled={qtd === 0}
                        >-</button>
                        <span className="stepper-val">{qtd}</span>
                        <button
                          onClick={() => alterarQtdAdicional(add.id, 1)}
                          className="stepper-btn"
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Remoções */}
            <div className="config-step">
              <label className="step-title">6. Restrições e Remoções</label>
              <div className="removal-tags">
                {OPCOES_MONTAGEM.ingredientesRetiraveis.map(ing => {
                  const sel = customizacao.remocoes.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => alternarRemocao(ing)}
                      className={`removal-btn ${sel ? 'active' : ''}`}
                    >
                      {sel ? '✕ Retirar ' : '+ Manter '} {ing}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rodapé do Modal de Customização */}
            <div className="modal-footer-sticky">
              <div className="footer-total-group">
                <span>Total da Marmita</span>
                <div className="footer-price">R$ {calculoCustomizacao.precoFinal.toFixed(2)}</div>
              </div>
              <button onClick={salvarNoCarrinho} className="btn-confirm-dish">
                Adicionar ao Carrinho 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TABELA NUTRICIONAL */}
      {modalNutriItem && (
        <div className="modal-overlay">
          <div className="modal-box modal-nutri">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Composição e Ficha Técnica</span>
                <h3 className="modal-heading-sub">{modalNutriItem.nome}</h3>
              </div>
              <button onClick={() => setModalNutriItem(null)} className="btn-close">✕</button>
            </div>

            {modalNutriItem.nutri ? (
              <div>
                <div className="nutri-hero-box">
                  <div className="nutri-hero-val">{modalNutriItem.nutri.cal}</div>
                  <div className="nutri-hero-lbl">Calorias Totais (kcal)</div>
                </div>

                <div className="nutri-table-list">
                  <div className="nutri-table-row">
                    <span>Proteínas</span>
                    <strong>{modalNutriItem.nutri.prot} g</strong>
                  </div>
                  <div className="nutri-table-row">
                    <span>Carboidratos Líquidos</span>
                    <strong>{modalNutriItem.nutri.carb} g</strong>
                  </div>
                  <div className="nutri-table-row">
                    <span>Gorduras Totais</span>
                    <strong>{modalNutriItem.nutri.gord} g</strong>
                  </div>
                  <div className="nutri-table-row">
                    <span>Fibras Alimentares</span>
                    <strong>{modalNutriItem.nutri.fibra} g</strong>
                  </div>
                </div>

                <p className="nutri-legal">
                  *Valores aproximados com base nas tabelas TACO e referências de preparo sem gordura hidrogenada.
                </p>
              </div>
            ) : (
              <div className="nutri-empty">
                <p>Informação nutricional não cadastrada para este item.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRAWER DO CARRINHO */}
      {carrinhoAberto && (
        <div className="cart-backdrop" onClick={() => setCarrinhoAberto(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3>🛒 Meu Pedido ({totalItensCarrinho})</h3>
              <button onClick={() => setCarrinhoAberto(false)} className="btn-close">✕</button>
            </div>

            <div className="cart-body">
              {carrinho.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🥗</div>
                  <p>Seu carrinho está vazio.</p>
                  <button onClick={() => { setCarrinhoAberto(false); abrirMontador(); }} className="btn-primary">
                    Montar Marmita Agora
                  </button>
                </div>
              ) : (
                carrinho.map(item => (
                  <div key={item.cartId} className="cart-item-card">
                    <div className="cart-item-header">
                      <div>
                        <strong className="cart-item-title">{item.nome}</strong>
                        <span className="cart-item-subtitle">{item.tamanho} • {item.proteina}</span>
                      </div>
                      <button onClick={() => removerDoCarrinho(item.cartId)} className="btn-trash">
                        🗑️
                      </button>
                    </div>

                    <div className="cart-composition-box">
                      <div><strong>Base:</strong> {item.base}</div>
                      <div><strong>Legumes:</strong> {item.legumes.join(', ')}</div>
                      {item.remocoes.length > 0 && (
                        <div className="text-danger">
                          <strong>Sem:</strong> {item.remocoes.join(', ')}
                        </div>
                      )}
                      {item.adicionais.length > 0 && (
                        <div className="text-success">
                          <strong>Extras:</strong> {item.adicionais.map(a => `${a.qtd}x ${a.nome}`).join(' | ')}
                        </div>
                      )}
                    </div>

                    <div className="cart-item-footer">
                      <div className="stepper-control stepper-mini">
                        <button onClick={() => alterarQtdCarrinho(item.cartId, -1)} className="stepper-btn">-</button>
                        <span className="stepper-val">{item.qtd}</span>
                        <button onClick={() => alterarQtdCarrinho(item.cartId, 1)} className="stepper-btn">+</button>
                      </div>
                      <div className="cart-item-price">
                        R$ {(item.precoUnitario * item.qtd).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="cart-footer-box">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <strong>R$ {totalCarrinho.toFixed(2)}</strong>
                </div>

                <button onClick={() => { setCarrinhoAberto(false); setModalCheckout(true); }} className="btn-proceed-checkout">
                  Prosseguir para Entrega →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT & ENTREGA */}
      {modalCheckout && (
        <div className="modal-overlay">
          <div className="modal-box modal-box-scroll">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Quase Pronto</span>
                <h2 className="modal-heading">Dados de Entrega</h2>
              </div>
              <button onClick={() => setModalCheckout(false)} className="btn-close">✕</button>
            </div>

            <div className="checkout-form">
              <div className="form-field">
                <label className="form-label">Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo"
                  className="form-input"
                  value={cliente.nome}
                  onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Endereço Completo (Rua, Número e Apto) *</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Afonso Pena, 1500 - Apt 402"
                  className="form-input"
                  value={cliente.endereco}
                  onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Bairro / Região *</label>
                <input
                  type="text"
                  placeholder="Ex: Savassi ou Funcionários"
                  className="form-input"
                  value={cliente.bairro}
                  onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Forma de Pagamento Preferida *</label>
                <select
                  className="form-input"
                  value={cliente.pagamento}
                  onChange={(e) => setCliente({ ...cliente, pagamento: e.target.value })}
                >
                  <option value="PIX">⚡ Chave PIX (Aprovação Imediata)</option>
                  <option value="Cartão de Crédito">💳 Cartão de Crédito (Maquininha na entrega)</option>
                  <option value="Cartão de Débito">💳 Cartão de Débito (Maquininha)</option>
                  <option value="Dinheiro">💵 Dinheiro em Espécie</option>
                </select>
              </div>

              {cliente.pagamento === "Dinheiro" && (
                <div className="form-field">
                  <label className="form-label">Precisa de troco para quanto?</label>
                  <input
                    type="text"
                    placeholder="Ex: 50,00 ou 100,00"
                    className="form-input"
                    value={cliente.trocoPara}
                    onChange={(e) => setCliente({ ...cliente, trocoPara: e.target.value })}
                  />
                </div>
              )}

              <div className="form-field">
                <label className="form-label">Observações para o Entregador ou Cozinha</label>
                <textarea
                  placeholder="Ex: Deixar na portaria, campainha estragada, talher descartável..."
                  className="form-textarea"
                  value={observacoesGerais}
                  onChange={(e) => setObservacoesGerais(e.target.value)}
                />
              </div>

              <div className="checkout-summary-box">
                <span>Valor Final das Marmitas:</span>
                <span className="summary-val">R$ {totalCarrinho.toFixed(2)}</span>
              </div>

              <button onClick={finalizarPedidoWhatsApp} className="btn-whatsapp-finish">
                💬 Enviar Pedido Pronto no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA FIXA MOBILE */}
      {carrinho.length > 0 && !carrinhoAberto && (
        <aside aria-label="Resumo do pedido" className="mobile-sticky-bar">
          <div>
            <div className="mobile-bar-label">Total ({totalItensCarrinho} itens)</div>
            <div className="mobile-bar-total">R$ {totalCarrinho.toFixed(2)}</div>
          </div>
          <button onClick={() => setCarrinhoAberto(true)} className="mobile-bar-btn">
            Ver Carrinho 🛒
          </button>
        </aside>
      )}
    </div>
  );
}

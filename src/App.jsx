import React, { useState, useMemo } from 'react';
import './App.css';

// CONSTANTE DA REGRA DE NEGÓCIO - RMBH
const PEDIDO_MINIMO_MARMITAS = 15;
const PERCENTUAL_DESCONTO_KIT = 0.05; // 5% de desconto automático para kits de 15+ marmitas
const SEU_WHATSAPP = "5531995516104";

// ADICIONAIS CONGELADOS
const BASE_ADICIONAIS = [
  { id: 'ovo', nome: 'Ovo Caipira Cozido Extra', preco: 3.00, desc: 'Embalado a vácuo para congelamento', nutri: { cal: 74, prot: 6.3, carb: 0.6, gord: 5.0, fibra: 0 } },
  { id: 'frango_extra', nome: 'Porção Extra Frango Desfiado (100g)', preco: 7.50, desc: 'Peito refogado e suculento', nutri: { cal: 159, prot: 32.0, carb: 0.0, gord: 3.2, fibra: 0 } },
  { id: 'carne_extra', nome: 'Porção Extra Carne Moída (100g)', preco: 8.90, desc: 'Patinho magro refogado', nutri: { cal: 172, prot: 29.5, carb: 0.0, gord: 5.8, fibra: 0 } },
  { id: 'bacon_crispy', nome: 'Torresminho / Bacon Crocante (30g)', preco: 4.90, desc: 'Ideal para feijoada ou tropeiro', nutri: { cal: 135, prot: 9.2, carb: 0.4, gord: 11.0, fibra: 0 } },
  { id: 'queijo_minas', nome: 'Queijo Minas Curado Gratinado (50g)', preco: 5.00, desc: 'Queijo canastra/minas autêntico', nutri: { cal: 125, prot: 8.5, carb: 1.6, gord: 9.0, fibra: 0 } },
  { id: 'legumes_extra', nome: 'Mix de Legumes Congelados (120g)', preco: 4.50, desc: 'Cenoura, abobrinha e vagem no vapor', nutri: { cal: 52, prot: 2.4, carb: 9.2, gord: 0.4, fibra: 4.1 } },
  { id: 'feijao_tropeiro', nome: 'Porção Feijão Tropeiro Mineiro (120g)', preco: 6.00, desc: 'Feijão, farinha biju e couve', nutri: { cal: 195, prot: 9.5, carb: 22.0, gord: 7.8, fibra: 5.5 } }
];

// OPÇÕES PARA QUEM QUER MONTAR O SEU POTE CONGELADO DO ZERO
const OPCOES_MONTAGEM = {
  tamanhos: [
    { id: 'PADRAO', nome: 'Pote Tradicional 400g', peso: '400g', preco: 18.90, fatorNutri: 1.0 },
    { id: 'REFORCADO', nome: 'Pote Reforçado 500g (Mais Pedido)', peso: '500g', preco: 21.90, fatorNutri: 1.25 },
    { id: 'MEGA', nome: 'Pote Família / Hipertrofia 650g', peso: '650g', preco: 26.90, fatorNutri: 1.55 }
  ],
  proteinas: [
    { id: 'carne_panela', nome: 'Carne de Panela Desfiada no Molho', precoExtra: 2.00, nutri: { cal: 210, prot: 32, carb: 2, gord: 8.5, fibra: 0 } },
    { id: 'frango_grelhado', nome: 'Peito de Frango Grelhado em Tiras', precoExtra: 0, nutri: { cal: 160, prot: 32, carb: 0, gord: 3.2, fibra: 0 } },
    { id: 'patinho_moido', nome: 'Patinho Moído Magro Refogado', precoExtra: 1.50, nutri: { cal: 175, prot: 30, carb: 0, gord: 6.0, fibra: 0 } },
    { id: 'carne_seca', nome: 'Carne Seca Desfiada e Dessalgada', precoExtra: 3.00, nutri: { cal: 220, prot: 31, carb: 1, gord: 10.0, fibra: 0 } }
  ],
  bases: [
    { id: 'arroz_feijao', nome: 'Arroz Branco Soltinho + Feijão Carioca', precoExtra: 0, nutri: { cal: 190, prot: 6.0, carb: 38, gord: 1.2, fibra: 5.0 } },
    { id: 'arroz_integral', nome: 'Arroz Integral c/ Cenoura + Feijão', precoExtra: 0, nutri: { cal: 175, prot: 5.8, carb: 35, gord: 1.0, fibra: 6.2 } },
    { id: 'pure_batata', nome: 'Purê Caseiro de Batata com Manteiga', precoExtra: 1.00, nutri: { cal: 155, prot: 2.5, carb: 28, gord: 3.8, fibra: 2.2 } },
    { id: 'pure_mandioca', nome: 'Purê Rústico de Mandioca Mineira', precoExtra: 1.50, nutri: { cal: 165, prot: 1.8, carb: 34, gord: 2.1, fibra: 3.0 } }
  ],
  legumes: [
    { id: 'couve_mineira', nome: 'Couve Fininha Refogada no Alho', precoExtra: 0, nutri: { cal: 45, prot: 2.9, carb: 6.0, gord: 1.2, fibra: 3.8 } },
    { id: 'cenoura_abobrinha', nome: 'Mix Cenoura e Abobrinha no Azeite', precoExtra: 0, nutri: { cal: 35, prot: 1.5, carb: 5.2, gord: 0.8, fibra: 2.5 } },
    { id: 'brocolis_alho', nome: 'Brócolis ao Alho Dourado', precoExtra: 1.00, nutri: { cal: 38, prot: 3.0, carb: 5.5, gord: 0.5, fibra: 3.2 } }
  ],
  ingredientesRetiraveis: [
    'Sem Alho', 'Sem Cebola', 'Pouco Sal', 'Sem Tempero Verde'
  ]
};

// 3. CARDÁPIO CLÁSSICO DE CONGELADAS (RMBH)
const MARMITAS_PRONTAS = [
  {
    id: 1,
    nome: "Carne de Panela com Arroz, Feijão e Legumes",
    categoria: "Mais Vendida",
    badgeClasse: "badge-laranja",
    pesoEmbalagem: "Pote Selado 500g",
    descricao: "Carne bovina macia desmanchando ao molho de tomate caseiro, arroz branco soltinho, feijão carioquinha cremoso e cenoura com abobrinha refogadas.",
    preco: 21.90,
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Carne de Panela no Molho (160g)",
      base: "Arroz Branco + Feijão Carioca (240g)",
      legumes: ["Legumes no Vapor (100g)"]
    },
    nutri: { cal: 485, prot: 39, carb: 52, gord: 12.5, fibra: 7.2 }
  },
  {
    id: 2,
    nome: "Strogonoff de Frango com Arroz e Batatas Assadas",
    categoria: "Clássica",
    badgeClasse: "badge-roxo",
    pesoEmbalagem: "Pote Selado 450g",
    descricao: "Cubos de filé de frango ao molho strogonoff tradicional bem encorpado, acompanha arroz branco soltinho e batatinhas douradas ao forno.",
    preco: 19.90,
    imagem: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Strogonoff de Frango Caseiro (160g)",
      base: "Arroz Branco (190g)",
      legumes: ["Batatas Douradas no Forno (100g)"]
    },
    nutri: { cal: 460, prot: 41, carb: 48, gord: 10.8, fibra: 3.5 }
  },
  {
    id: 3,
    nome: "Lasanha à Bolonhesa Caseira (Gratinada no Pote)",
    categoria: "Especial",
    badgeClasse: "badge-vermelho",
    pesoEmbalagem: "Pote Forno/Micro 500g",
    descricao: "Massa artesanal intercalada com molho à bolonhesa rico em carne bovina, molho bechamel cremoso e cobertura generosa de queijo gratinado.",
    preco: 22.90,
    imagem: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Molho Bolonhesa Especial (180g)",
      base: "Massa de Lasanha e Bechamel (220g)",
      legumes: ["Queijo Gratinado (100g)"]
    },
    nutri: { cal: 560, prot: 36, carb: 54, gord: 21.0, fibra: 3.8 }
  },
  {
    id: 4,
    nome: "Feijoada Completa Tradicional com Couve e Farofa",
    categoria: "Tradicional",
    badgeClasse: "badge-laranja",
    pesoEmbalagem: "Pote Selado 500g",
    descricao: "Feijão preto bem apurado com carnes nobres (carne seca, lombo e calabresa defumada), arroz branco, couve refogada e farofinha crocante.",
    preco: 22.50,
    imagem: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Feijoada com Carnes Nobres (220g)",
      base: "Arroz Branco + Farofa (200g)",
      legumes: ["Couve Mineira Refogada (80g)"]
    },
    nutri: { cal: 590, prot: 44, carb: 58, gord: 18.5, fibra: 9.8 }
  },
  {
    id: 5,
    nome: "Filé de Frango Grelhado com Purê e Arroz Integral",
    categoria: "Linha Fit",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 400g",
    descricao: "Filé de peito de frango marinado em ervas frescas, purê aveludado de batatas, arroz integral com cenoura ralada e brócolis ao alho.",
    preco: 17.90,
    imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Peito de Frango Grelhado (140g)",
      base: "Purê de Batata + Arroz Integral (180g)",
      legumes: ["Brócolis ao Alho (80g)"]
    },
    nutri: { cal: 360, prot: 42, carb: 35, gord: 4.8, fibra: 5.5 }
  },
  {
    id: 6,
    nome: "Escondidinho de Mandioca com Carne Seca Nobre",
    categoria: "Mineira",
    badgeClasse: "badge-ciano",
    pesoEmbalagem: "Pote Forno/Micro 450g",
    descricao: "Purê aveludado de mandioca amarela cozida no vapor, recheado com carne seca desfiada e dessalgada, finalizado com queijo minas curado.",
    preco: 20.90,
    imagem: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=650&q=80",
    composicaoPadrao: {
      proteina: "Carne Seca Acebolada (150g)",
      base: "Purê Cremoso de Mandioca (220g)",
      legumes: ["Queijo Minas Gratinado (80g)"]
    },
    nutri: { cal: 490, prot: 37, carb: 49, gord: 14.0, fibra: 4.5 }
  }
];

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const [modalNutriItem, setModalNutriItem] = useState(null);
  const [modalCustomizar, setModalCustomizar] = useState(false);
  const [modalCheckout, setModalCheckout] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const [cliente, setCliente] = useState({
    nome: "",
    cidade: "Belo Horizonte",
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

  // Cálculo de Preço e Nutrição do montador
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

  // Totais do Carrinho e Regra de 15 Unidades
  const totalMarmitas = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const subtotalCarrinho = carrinho.reduce((acc, item) => acc + (item.precoUnitario * item.qtd), 0);
  
  const atingiuMinimo = totalMarmitas >= PEDIDO_MINIMO_MARMITAS;
  const marmitasFaltando = Math.max(0, PEDIDO_MINIMO_MARMITAS - totalMarmitas);
  
  // Desconto de Kit (5% a partir de 15 unidades)
  const valorDescontoKit = atingiuMinimo ? (subtotalCarrinho * PERCENTUAL_DESCONTO_KIT) : 0;
  const totalComDesconto = subtotalCarrinho - valorDescontoKit;

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
      nome: customizacao.itemOriginal ? customizacao.itemOriginal.nome : `Pote Personalizado (${customizacao.tamanho.nome.split(' ')[0]})`,
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
      tamanho: marmita.pesoEmbalagem,
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

  // FINALIZAR PEDIDO VIA WHATSAPP (RMBH)
  const finalizarPedidoWhatsApp = () => {
    if (!atingiuMinimo) {
      return alert(`O pedido mínimo para entrega de congelados na RMBH é de ${PEDIDO_MINIMO_MARMITAS} unidades. Faltam ${marmitasFaltando} marmitas.`);
    }

    if (!cliente.nome.trim() || !cliente.endereco.trim() || !cliente.bairro.trim()) {
      return alert("Por favor, preencha nome, endereço e bairro para calcularmos sua rota de entrega na Grande BH!");
    }

    let msg = `🍱 *NOVO PEDIDO - MARMITAS CONGELADAS (KIT RMBH)*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Cliente:* ${cliente.nome.trim()}\n`;
    msg += `📍 *Entrega:* ${cliente.endereco.trim()} - ${cliente.bairro.trim()} (${cliente.cidade})\n`;
    msg += `💳 *Forma de Pagamento:* ${cliente.pagamento}`;
    if (cliente.pagamento === "Dinheiro" && cliente.trocoPara) {
      msg += ` (Troco para R$ ${cliente.trocoPara})`;
    }
    msg += `\n📦 *Total de Marmitas:* ${totalMarmitas} unidades (Mínimo de 15 atingido! ✅)\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📋 *ITENS DO SEU KIT:*\n\n`;

    carrinho.forEach((item, index) => {
      msg += `*${index + 1}. ${item.qtd}x ${item.nome}*\n`;
      msg += `   ▫️ *Pote:* ${item.tamanho}\n`;
      msg += `   ▫️ *Composição:* ${item.proteina} + ${item.base} + ${item.legumes.join(', ')}\n`;

      if (item.remocoes && item.remocoes.length > 0) {
        msg += `   ⚠️ *Retirar:* ${item.remocoes.join(', ')}\n`;
      }
      if (item.adicionais && item.adicionais.length > 0) {
        msg += `   ➕ *Adicionais:*\n`;
        item.adicionais.forEach(add => {
          msg += `      • ${add.qtd}x ${add.nome} (+R$ ${(add.preco * add.qtd).toFixed(2)})\n`;
        });
      }
      msg += `   💵 *Subtotal:* R$ ${(item.precoUnitario * item.qtd).toFixed(2)}\n\n`;
    });

    if (observacoesGerais.trim()) {
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📝 *Observações:* ${observacoesGerais.trim()}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛒 *Subtotal:* R$ ${subtotalCarrinho.toFixed(2)}\n`;
    if (valorDescontoKit > 0) {
      msg += `🎉 *Desconto Kit Congelados (5%):* -R$ ${valorDescontoKit.toFixed(2)}\n`;
    }
    msg += `💰 *TOTAL A PAGAR: R$ ${totalComDesconto.toFixed(2)}*\n`;
    msg += `🛵 _Taxa de entrega combinada conforme rota em Belo Horizonte / Contagem / Betim / Nova Lima._\n`;

    const url = `https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const marmitasFiltradas = filtroCategoria === "Todas"
    ? MARMITAS_PRONTAS
    : MARMITAS_PRONTAS.filter(m => m.categoria.toLowerCase() === filtroCategoria.toLowerCase());

  return (
    <div className="app-container">
      {/* AVISO DO TOPO: REGRA DE 15 MARMITAS */}
      <div className="top-banner-aviso">
        <span>❄️ <strong>Kits de Marmitas Congeladas (RMBH):</strong> Pedido mínimo de <strong>15 unidades</strong>. Ganhe 5% de desconto no kit!</span>
      </div>

      {/* CABEÇALHO */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-group">
            <div className="logo-box">🍱</div>
            <div>
              <div className="brand-title">
                MARMITAS <span className="brand-highlight">DE VERDADE</span>
              </div>
              <p className="brand-subtitle">Comida Caseira Congelada Ultra Fresca • Grande BH</p>
            </div>
          </div>

          <button onClick={() => setCarrinhoAberto(true)} className="cart-btn-header">
            <span>🛒</span>
            <span className={`cart-badge ${atingiuMinimo ? 'badge-ok' : 'badge-alert'}`}>
              {totalMarmitas}/15
            </span>
            <span>R$ {totalComDesconto.toFixed(2)}</span>
          </button>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag">❄️ CONGELAMENTO RÁPIDO EM POTES LIVRES DE BPA</div>
          <h2 className="hero-title">O sabor da comida caseira mineira no seu freezer</h2>
          <p className="hero-desc">
            Pratos preparados no dia e ultracongelados em embalagens seladas de <strong>400g a 500g</strong>. Prontas para aquecer no micro-ondas em 5 minutos.
          </p>
          <div className="hero-actions">
            <button onClick={() => abrirMontador(null)} className="btn-primary">
              ✨ Montar Marmita Personalizada
            </button>
            <a href="#cardapio" className="btn-secondary">
              Ver Cardápio de Congeladas ⬇
            </a>
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORIA */}
      <nav className="categories-nav" id="cardapio">
        {["Todas", "Mais Vendida", "Clássica", "Tradicional", "Linha Fit", "Mineira"].map(cat => (
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
                <span className="badge-pote-volume">{marmita.pesoEmbalagem}</span>
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
                    <span className="price-label">Preço da unidade</span>
                    <div className="price-val">R$ {marmita.preco.toFixed(2)}</div>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => abrirMontador(marmita)}
                      className="btn-outline"
                    >
                      ⚙️ Ajustar
                    </button>
                    <button
                      onClick={() => adicionarPratoDireto(marmita)}
                      className="btn-add"
                    >
                      + Pote
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
                <span className="modal-eyebrow">Personalização de Pote Congelado</span>
                <h2 className="modal-heading">
                  {customizacao.itemOriginal ? `Ajustar: ${customizacao.itemOriginal.nome}` : 'Montar Pote Congelado'}
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

            {/* 1. Tamanho da Embalagem */}
            <div className="config-step">
              <label className="step-title">1. Tamanho do Pote (Gramatura Congelada)</label>
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
              <label className="step-title">2. Escolha a Proteína Principal</label>
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

            {/* 3. Base / Acompanhamento */}
            <div className="config-step">
              <label className="step-title">3. Selecione a Base de Carboidrato</label>
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
              <label className="step-title">4. Escolha os Legumes / Acompanhamentos</label>
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
                      <span className="chip-subprice">{leg.nutri.cal} kcal</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Adicionais com preços */}
            <div className="config-step">
              <label className="step-title">5. Adicionais no Pote (Opcional)</label>
              <div className="list-options">
                {BASE_ADICIONAIS.map(add => {
                  const qtd = customizacao.adicionaisQtd[add.id] || 0;
                  return (
                    <div key={add.id} className="addon-row">
                      <div className="addon-info">
                        <strong>{add.nome}</strong>
                        <span className="addon-desc">{add.desc}</span>
                        <span className="addon-nutri">+R$ {add.preco.toFixed(2)} un</span>
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
              <label className="step-title">6. Restrições e Temperos</label>
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

            {/* Rodapé do Modal */}
            <div className="modal-footer-sticky">
              <div className="footer-total-group">
                <span>Valor Unitário</span>
                <div className="footer-price">R$ {calculoCustomizacao.precoFinal.toFixed(2)}</div>
              </div>
              <button onClick={salvarNoCarrinho} className="btn-confirm-dish">
                Adicionar ao Kit 🛍️
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
                <span className="modal-eyebrow">Informações Nutricionais</span>
                <h3 className="modal-heading-sub">{modalNutriItem.nome}</h3>
              </div>
              <button onClick={() => setModalNutriItem(null)} className="btn-close">✕</button>
            </div>

            {modalNutriItem.nutri ? (
              <div>
                <div className="nutri-hero-box">
                  <div className="nutri-hero-val">{modalNutriItem.nutri.cal}</div>
                  <div className="nutri-hero-lbl">Calorias Estimadas (kcal / porção)</div>
                </div>

                <div className="nutri-table-list">
                  <div className="nutri-table-row">
                    <span>Proteínas</span>
                    <strong>{modalNutriItem.nutri.prot} g</strong>
                  </div>
                  <div className="nutri-table-row">
                    <span>Carboidratos</span>
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
                  *Valores calculados com base na Tabela TACO para refeições caseiras congeladas sem conservantes químicos.
                </p>
              </div>
            ) : (
              <div className="nutri-empty">
                <p>Informação nutricional não cadastrada para este prato.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OFFCANVAS / DRAWER DO CARRINHO */}
      {carrinhoAberto && (
        <div className="cart-backdrop" onClick={() => setCarrinhoAberto(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div>
                <h3>🛒 Seu Kit ({totalMarmitas} marmitas)</h3>
                <span className="cart-subhead">Pedido Mínimo: 15 unidades</span>
              </div>
              <button onClick={() => setCarrinhoAberto(false)} className="btn-close">✕</button>
            </div>

            {/* STATUS DO PEDIDO MÍNIMO COM PROGRESS BAR */}
            <div className="cart-progress-box">
              <div className="progress-labels">
                <span>Progresso do Pedido Mínimo:</span>
                <strong>{totalMarmitas} / 15 marmitas</strong>
              </div>
              <div className="progress-track">
                <div 
                  className={`progress-fill ${atingiuMinimo ? 'fill-completed' : ''}`}
                  style={{ width: `${Math.min(100, (totalMarmitas / PEDIDO_MINIMO_MARMITAS) * 100)}%` }}
                />
              </div>

              {!atingiuMinimo ? (
                <div className="aviso-minimo-pendente">
                  ⚠️ <strong>Faltam {marmitasFaltando} {marmitasFaltando === 1 ? 'marmita' : 'marmitas'}</strong> para atingir o pedido mínimo de entrega!
                </div>
              ) : (
                <div className="aviso-minimo-ok">
                  🎉 <strong>Parabéns!</strong> Pedido mínimo atingido! 5% de desconto de kit liberado!
                </div>
              )}
            </div>

            <div className="cart-body">
              {carrinho.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">❄️</div>
                  <p>Seu kit de congeladas está vazio.</p>
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
                  <span>Subtotal:</span>
                  <span>R$ {subtotalCarrinho.toFixed(2)}</span>
                </div>

                {atingiuMinimo && (
                  <div className="cart-total-row text-success">
                    <span>Desconto de Kit (5%):</span>
                    <span>- R$ {valorDescontoKit.toFixed(2)}</span>
                  </div>
                )}

                <div className="cart-total-row total-destaque">
                  <span>Total Final:</span>
                  <strong>R$ {totalComDesconto.toFixed(2)}</strong>
                </div>

                <button
                  onClick={() => { setCarrinhoAberto(false); setModalCheckout(true); }}
                  className={`btn-proceed-checkout ${!atingiuMinimo ? 'disabled' : ''}`}
                  disabled={!atingiuMinimo}
                >
                  {atingiuMinimo ? "Prosseguir para Entrega (Grande BH) →" : `Adicione mais ${marmitasFaltando} marmitas para liberar`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT & ENTREGA RMBH */}
      {modalCheckout && (
        <div className="modal-overlay">
          <div className="modal-box modal-box-scroll">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Finalização de Pedido</span>
                <h2 className="modal-heading">Dados de Entrega (RMBH)</h2>
              </div>
              <button onClick={() => setModalCheckout(false)} className="btn-close">✕</button>
            </div>

            <div className="checkout-form">
              <div className="form-field">
                <label className="form-label">Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Ana Paula Ferreira"
                  className="form-input"
                  value={cliente.nome}
                  onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Município da Região Metropolitana *</label>
                <select
                  className="form-input"
                  value={cliente.cidade}
                  onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })}
                >
                  <option value="Belo Horizonte">Belo Horizonte</option>
                  <option value="Contagem">Contagem</option>
                  <option value="Betim">Betim</option>
                  <option value="Nova Lima">Nova Lima</option>
                  <option value="Santa Luzia">Santa Luzia</option>
                  <option value="Ibirité">Ibirité</option>
                  <option value="Sabará">Sabará</option>
                  <option value="Outra Cidade RMBH">Outra Cidade (RMBH)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Endereço Completo (Rua, Número e Apto) *</label>
                <input
                  type="text"
                  placeholder="Ex: Rua Alagoas, 1020 - Apt 501"
                  className="form-input"
                  value={cliente.endereco}
                  onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Bairro *</label>
                <input
                  type="text"
                  placeholder="Ex: Funcionários, Eldorado, etc."
                  className="form-input"
                  value={cliente.bairro}
                  onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Forma de Pagamento *</label>
                <select
                  className="form-input"
                  value={cliente.pagamento}
                  onChange={(e) => setCliente({ ...cliente, pagamento: e.target.value })}
                >
                  <option value="PIX">⚡ Chave PIX (Aprovação e Agendamento Imediato)</option>
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
                    placeholder="Ex: 300,00 ou 350,00"
                    className="form-input"
                    value={cliente.trocoPara}
                    onChange={(e) => setCliente({ ...cliente, trocoPara: e.target.value })}
                  />
                </div>
              )}

              <div className="form-field">
                <label className="form-label">Observações sobre a Entrega ou Freezer</label>
                <textarea
                  placeholder="Ex: Entregar após as 18h, deixar com a portaria, etc."
                  className="form-textarea"
                  value={observacoesGerais}
                  onChange={(e) => setObservacoesGerais(e.target.value)}
                />
              </div>

              <div className="checkout-summary-box">
                <div>
                  <span>Total do Kit ({totalMarmitas} marmitas):</span>
                  {valorDescontoKit > 0 && (
                    <small style={{ display: 'block', color: '#10b981' }}>
                      Economia de R$ {valorDescontoKit.toFixed(2)} aplicada!
                    </small>
                  )}
                </div>
                <span className="summary-val">R$ {totalComDesconto.toFixed(2)}</span>
              </div>

              <button onClick={finalizarPedidoWhatsApp} className="btn-whatsapp-finish">
                💬 Enviar Pedido no WhatsApp da Cozinha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA FIXA MOBILE */}
      {carrinho.length > 0 && !carrinhoAberto && (
        <aside aria-label="Resumo do pedido" className="mobile-sticky-bar">
          <div>
            <div className="mobile-bar-label">
              Kit: {totalMarmitas}/15 marmitas {!atingiuMinimo && `(Faltam ${marmitasFaltando})`}
            </div>
            <div className="mobile-bar-total">R$ {totalComDesconto.toFixed(2)}</div>
          </div>
          <button onClick={() => setCarrinhoAberto(true)} className="mobile-bar-btn">
            Ver Kit 🛒
          </button>
        </aside>
      )}
    </div>
  );
}

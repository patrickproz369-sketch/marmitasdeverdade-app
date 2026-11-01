import React, { useState } from 'react';

// CATÁLOGO DE MARMITAS FITNESS COM FOTOS EM ALTA QUALIDADE
const MARMITAS = [
  {
    id: 1,
    nome: "Marmita Fit - Frango com Batata Doce",
    categoria: "Mais Vendida",
    descricao: "Peito de frango grelhado em cubos, purê de batata doce e brócolis ao alho.",
    preco: 19.90,
    imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nome: "Patinho Moído com Arroz Integral",
    categoria: "Hipertrofia",
    descricao: "Carne moída magra refogada, arroz integral com cenoura e mix de legumes no vapor.",
    preco: 22.00,
    imagem: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nome: "Tilápia Grelhada com Legumes",
    categoria: "Low Carb",
    descricao: "Filé de tilápia com crosta de ervas, abobrinha, cenoura e vagem salteadas no azeite.",
    preco: 24.50,
    imagem: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    nome: "Strogonoff Fit de Frango",
    categoria: "Equilíbrio",
    descricao: "Frango em tiras, molho cremoso leve de iogurte, arroz integral e batatas assadas.",
    preco: 21.90,
    imagem: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    nome: "Escondidinho Fit de Mandioca e Carne Seca",
    categoria: "Especial",
    descricao: "Mandioca cremosa sem lactose, carne seca desfiada e dessalgada, gratinado com queijo minas.",
    preco: 23.90,
    imagem: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    nome: "Espaguete de Abobrinha com Almôndegas",
    categoria: "Low Carb",
    descricao: "Tiras finas de abobrinha fresca, almôndegas caseiras de patinho e molho rústico de tomate.",
    preco: 20.00,
    imagem: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    nome: "Bowl Vegano Energético",
    categoria: "Vegano",
    descricao: "Grão de bico crocante, cogumelos salteados, quinoa real, tomate cereja e abacate.",
    preco: 23.00,
    imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    nome: "Salmão com Purê de Mandioquinha",
    categoria: "Premium",
    descricao: "Posta de salmão grelhado no azeite de oliva, purê aveludado e aspargos verdes.",
    preco: 32.90,
    imagem: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"
  }
];

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // DADOS DO CLIENTE E PAGAMENTO
  const [cliente, setCliente] = useState({
    nome: "",
    endereco: "",
    bairro: "",
    pagamento: "Cartão de Crédito"
  });

  // COLOQUE AQUI O SEU NÚMERO DE WHATSAPP (com DDD, ex: 5511999999999)
  const SEU_WHATSAPP = "5531995516104"; 

  // FUNÇÕES DO CARRINHO
  const adicionarAoCarrinho = (item) => {
    const itemExistente = carrinho.find((i) => i.id === item.id);
    if (itemExistente) {
      setCarrinho(carrinho.map((i) => i.id === item.id ? { ...i, qtd: i.qtd + 1 } : i));
    } else {
      setCarrinho([...carrinho, { ...item, qtd: 1 }]);
    }
  };

  const alterarQtd = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.qtd + delta;
        return novaQtd > 0 ? { ...item, qtd: novaQtd } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(i => i.id !== id));
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  // FINALIZAR PEDIDO VIA WHATSAPP
  const finalizarPedidoWhatsApp = () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    if (!cliente.nome || !cliente.endereco) {
      return alert("Por favor, preencha seu nome e endereço de entrega!");
    }

    let texto = `🍱 *NOVO PEDIDO - MARMITAS DE VERDADE*\n\n`;
    texto += `👤 *Cliente:* ${cliente.nome}\n`;
    texto += `📍 *Endereço:* ${cliente.endereco} - ${cliente.bairro}\n`;
    texto += `💳 *Forma de Pagamento:* ${cliente.pagamento}\n\n`;
    texto += `*Itens Escolhidos:*\n`;

    carrinho.forEach(item => {
      texto += `▪️ ${item.qtd}x ${item.nome} - R$ ${(item.preco * item.qtd).toFixed(2)}\n`;
    });

    if (observacoes.trim() !== "") {
      texto += `\n📝 *Observações:* ${observacoes}\n`;
    }

    texto += `\n💰 *VALOR TOTAL: R$ ${total.toFixed(2)}*`;

    const url = `https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      {/* CABEÇALHO / LOGO DO SITE */}
      <header style={styles.header}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoIconBox}>🍱</div>
          <div>
            <h1 style={styles.titulo}>
              MARMITAS <span style={styles.tituloDestaque}>DE VERDADE</span>
            </h1>
            <p style={styles.subtitulo}>Comida de verdade, sem conservantes e 100% saudável</p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={styles.main}>
        {/* CARDÁPIO */}
        <section style={styles.cardapio}>
          <h2 style={styles.secaoTitulo}>Cardápio do Dia</h2>
          <div style={styles.gridMarmitas}>
            {MARMITAS.map((marmita) => (
              <div key={marmita.id} style={styles.card}>
                <div style={styles.badge}>{marmita.categoria}</div>
                <img src={marmita.imagem} alt={marmita.nome} style={styles.cardImg} />
                <div style={styles.cardBody}>
                  <h3 style={styles.cardNome}>{marmita.nome}</h3>
                  <p style={styles.cardDesc}>{marmita.descricao}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardPreco}>R$ {marmita.preco.toFixed(2)}</span>
                    <button 
                      onClick={() => adicionarAoCarrinho(marmita)} 
                      style={styles.btnAdicionar}
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CARRINHO LATERAL */}
        <aside style={styles.carrinho}>
          <h3 style={styles.carrinhoTitulo}>🛒 Seu Carrinho</h3>
          {carrinho.length === 0 ? (
            <p style={styles.carrinhoVazio}>Seu carrinho está vazio.</p>
          ) : (
            <div>
              {carrinho.map((item) => (
                <div key={item.id} style={styles.itemCarrinho}>
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block' }}>{item.nome}</strong>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      R$ {item.preco.toFixed(2)} x {item.qtd}
                    </span>
                  </div>
                  <div style={styles.controlesQtd}>
                    <button onClick={() => alterarQtd(item.id, -1)} style={styles.btnQtd}>-</button>
                    <span style={{ margin: '0 8px', fontWeight: 'bold' }}>{item.qtd}</span>
                    <button onClick={() => alterarQtd(item.id, 1)} style={styles.btnQtd}>+</button>
                    <button onClick={() => removerDoCarrinho(item.id)} style={styles.btnRemover}>🗑️</button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '16px' }}>
                <label style={styles.label}>Observações:</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: sem cebola, talher descartável..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.totalBox}>
                <span>Total:</span>
                <span style={styles.totalValor}>R$ {total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => setMostrarModal(true)} 
                style={styles.btnFinalizar}
              >
                Prosseguir para Entrega & Pagamento
              </button>
            </div>
          )}
        </aside>
      </main>

      {/* MODAL DE CHECKOUT & PAGAMENTO */}
      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '20px' }}>Finalizar seu Pedido</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 18px 0' }}>
              Informe os dados de entrega e forma de pagamento:
            </p>

            <div style={styles.formGroup}>
              <label style={styles.label}>Seu Nome:</label>
              <input 
                type="text" 
                placeholder="Ex: Carlos Eduardo" 
                style={styles.input}
                value={cliente.nome}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Endereço (Rua e Número):</label>
              <input 
                type="text" 
                placeholder="Ex: Rua das Palmeiras, 150 - Apt 42" 
                style={styles.input}
                value={cliente.endereco}
                onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bairro / Região:</label>
              <input 
                type="text" 
                placeholder="Ex: Centro" 
                style={styles.input}
                value={cliente.bairro}
                onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Forma de Pagamento:</label>
              <select 
                style={styles.input}
                value={cliente.pagamento}
                onChange={(e) => setCliente({ ...cliente, pagamento: e.target.value })}
              >
                <option value="Cartão de Crédito">💳 Cartão de Crédito (na entrega ou link)</option>
                <option value="Cartão de Débito">💳 Cartão de Débito (na maquininha)</option>
                <option value="PIX">⚡ Chave PIX</option>
                <option value="Dinheiro">💵 Dinheiro (avise se precisa de troco)</option>
              </select>
            </div>

            <div style={styles.totalBoxModal}>
              <span>Total a Pagar:</span>
              <span style={styles.totalValor}>R$ {total.toFixed(2)}</span>
            </div>

            <button 
              onClick={finalizarPedidoWhatsApp} 
              style={styles.btnWhatsapp}
            >
              💬 Enviar Pedido no WhatsApp
            </button>

            <button 
              onClick={() => setMostrarModal(false)} 
              style={styles.btnFecharModal}
            >
              Voltar ao Cardápio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ESTILOS MODERNOS
const styles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    color: '#1e293b',
    margin: 0,
    paddingBottom: '60px'
  },
  header: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '25px 20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    textAlign: 'left'
  },
  logoIconBox: {
    fontSize: '36px',
    backgroundColor: '#1e293b',
    padding: '10px 14px',
    borderRadius: '14px',
    border: '1px solid #334155',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  titulo: { 
    margin: 0, 
    fontSize: '28px', 
    fontWeight: '900', 
    letterSpacing: '1px',
    lineHeight: '1.1'
  },
  tituloDestaque: {
    color: '#22c55e'
  },
  subtitulo: { 
    margin: '6px 0 0', 
    color: '#94a3b8', 
    fontSize: '14px',
    fontWeight: '400'
  },
  main: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  cardapio: { flex: '1 1 650px' },
  secaoTitulo: { fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' },
  gridMarmitas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#16a34a',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase'
  },
  cardImg: { width: '100%', height: '175px', objectFit: 'cover' },
  cardBody: { padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardNome: { fontSize: '16px', margin: '0 0 8px 0', fontWeight: 'bold' },
  cardDesc: { fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', flex: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPreco: { fontSize: '18px', fontWeight: 'bold', color: '#16a34a' },
  btnAdicionar: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '9px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  carrinho: {
    flex: '0 0 320px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '20px'
  },
  carrinhoTitulo: { margin: '0 0 15px 0', fontSize: '18px' },
  carrinhoVazio: { color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' },
  itemCarrinho: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  controlesQtd: { display: 'flex', alignItems: 'center' },
  btnQtd: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    width: '26px',
    height: '26px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnRemover: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '8px',
    fontSize: '15px'
  },
  label: { fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' },
  textarea: {
    width: '100%',
    height: '60px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    fontSize: '12px',
    resize: 'none'
  },
  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '18px 0',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  totalBoxModal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '16px 0',
    padding: '10px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  totalValor: { color: '#16a34a' },
  btnFinalizar: {
    width: '100%',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '13px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '440px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  formGroup: { marginBottom: '14px' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  btnWhatsapp: {
    width: '100%',
    backgroundColor: '#25D366',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '8px'
  },
  btnFecharModal: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};
import React, { useState, useMemo } from 'react';
import './App.css';

// 1. REGRAS DE NEGÓCIO & CONFIGURAÇÕES - RMBH
const PEDIDO_MINIMO_MARMITAS = 15;
const PERCENTUAL_DESCONTO_KIT = 0.05; // 5% de desconto automático para 15+ marmitas
const SEU_WHATSAPP = "5531995516104";

// 2. BANCO DE ADICIONAIS COM DADOS NUTRICIONAIS (TABELA TACO)
const BASE_ADICIONAIS = [
  { id: 'ovo', nome: 'Ovo Caipira Cozido Extra', preco: 3.00, desc: 'Acondicionado no pote', nutri: { cal: 74, prot: 6.3, carb: 0.6, gord: 5.0, fibra: 0 } },
  { id: 'frango_extra', nome: 'Porção Extra Frango Desfiado (100g)', preco: 7.50, desc: 'Peito refogado e suculento', nutri: { cal: 159, prot: 32.0, carb: 0.0, gord: 3.2, fibra: 0 } },
  { id: 'carne_extra', nome: 'Porção Extra Carne Moída (100g)', preco: 8.90, desc: 'Patinho magro refogado', nutri: { cal: 172, prot: 29.5, carb: 0.0, gord: 5.8, fibra: 0 } },
  { id: 'bacon_crispy', nome: 'Torresminho / Bacon Crocante (30g)', preco: 4.90, desc: 'Crocante para finalizar o pote', nutri: { cal: 135, prot: 9.2, carb: 0.4, gord: 11.0, fibra: 0 } },
  { id: 'queijo_minas', nome: 'Queijo Minas Curado Gratinado (50g)', preco: 5.00, desc: 'Gratinado por cima do pote', nutri: { cal: 125, prot: 8.5, carb: 1.6, gord: 9.0, fibra: 0 } },
  { id: 'legumes_extra', nome: 'Mix de Legumes no Vapor (120g)', preco: 4.50, desc: 'Cenoura, abobrinha e vagem', nutri: { cal: 52, prot: 2.4, carb: 9.2, gord: 0.4, fibra: 4.1 } },
  { id: 'feijao_tropeiro', nome: 'Porção Feijão Tropeiro Mineiro (120g)', preco: 6.00, desc: 'Feijão, farinha biju e couve', nutri: { cal: 195, prot: 9.5, carb: 22.0, gord: 7.8, fibra: 5.5 } }
];

// 3. OPÇÕES DE MONTAGEM (PERSONALIZAÇÃO COMPLETA)
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

// 4. CARDÁPIO DE MARMITAS CLÁSSICAS CONGELADAS (SEM FEIJOADA)
const MARMITAS_PRONTAS = [
  {
    id: 1,
    nome: "Lasanha à Bolonhesa Caseira (Gratinada no Pote)",
    categoria: "Mais Vendida",
    badgeClasse: "badge-vermelho",
    pesoEmbalagem: "Pote Forno/Micro 500g",
    descricao: "Lasanha caseira à bolonhesa, com molho cremoso e queijo gratinado.",
    preco: 22.90,
    imagem: "/images/marmitas/lasanha-bolonhesa.jpg",
    composicaoPadrao: {
      proteina: "Molho Bolonhesa Especial (180g)",
      base: "Massa de Lasanha e Bechamel (220g)",
      legumes: ["Queijo Gratinado (100g)"]
    },
    nutri: { cal: 560, prot: 36, carb: 54, gord: 21.0, fibra: 3.8 }
  },
  {
    id: 2,
    nome: "Strogonoff de Frango com Arroz e Batatas",
    categoria: "Clássica",
    badgeClasse: "badge-roxo",
    pesoEmbalagem: "Pote Selado 450g",
    descricao: "Frango cremoso ao molho strogonoff, com arroz soltinho e batatas.",
    preco: 19.90,
    imagem: "/images/marmitas/strogonoff-frango.jpg",
    composicaoPadrao: {
      proteina: "Strogonoff de Frango Caseiro (160g)",
      base: "Arroz Branco (190g)",
      legumes: ["Batatas Douradas (100g)"]
    },
    nutri: { cal: 460, prot: 41, carb: 48, gord: 10.8, fibra: 3.5 }
  },
  {
    id: 3,
    nome: "Carne de Panela com Arroz, Feijão e Legumes",
    categoria: "Tradicional",
    badgeClasse: "badge-laranja",
    pesoEmbalagem: "Pote Selado 500g",
    descricao: "Carne macia ao molho, arroz, feijão carioca e legumes cozidos.",
    preco: 21.90,
    imagem: "/images/marmitas/carne-panela.jpg",
    composicaoPadrao: {
      proteina: "Carne de Panela no Molho (160g)",
      base: "Arroz Branco + Feijão Carioca (240g)",
      legumes: ["Legumes no Vapor (100g)"]
    },
    nutri: { cal: 485, prot: 39, carb: 52, gord: 12.5, fibra: 7.2 }
  },
  {
    id: 4,
    nome: "Filé de Frango Grelhado com Purê e Arroz Integral",
    categoria: "Linha Fit",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 400g",
    descricao: "Frango grelhado, purê caseiro, arroz integral e brócolis com alho.",
    preco: 17.90,
    imagem: "/images/marmitas/frango-pure-arroz-integral.jpg",
    composicaoPadrao: {
      proteina: "Peito de Frango Grelhado (140g)",
      base: "Purê de Batata + Arroz Integral (180g)",
      legumes: ["Brócolis ao Alho (80g)"]
    },
    nutri: { cal: 360, prot: 42, carb: 35, gord: 4.8, fibra: 5.5 }
  },
  {
    id: 5,
    nome: "Patinho Moído com Arroz Branco, Feijão e Cenoura",
    categoria: "Equilíbrio",
    badgeClasse: "badge-laranja",
    pesoEmbalagem: "Pote Selado 450g",
    descricao: "Patinho moído bem temperado, arroz, feijão e cenoura macia.",
    preco: 19.90,
    imagem: "/images/marmitas/patinho-arroz-feijao.jpg",
    composicaoPadrao: {
      proteina: "Patinho Moído Magro (150g)",
      base: "Arroz Branco + Feijão Carioca (200g)",
      legumes: ["Cenouras Salteadas (100g)"]
    },
    nutri: { cal: 430, prot: 40, carb: 42, gord: 8.5, fibra: 5.0 }
  },
  {
    id: 6,
    nome: "Escondidinho de Mandioca com Carne Seca Nobre",
    categoria: "Mineira",
    badgeClasse: "badge-ciano",
    pesoEmbalagem: "Pote Forno/Micro 450g",
    descricao: "Mandioca cremosa, carne seca desfiada e queijo minas gratinado.",
    preco: 20.90,
    imagem: "/images/marmitas/escondidinho-carne-seca.jpg",
    composicaoPadrao: {
      proteina: "Carne Seca Acebolada (150g)",
      base: "Purê Cremoso de Mandioca (220g)",
      legumes: ["Queijo Minas Gratinado (80g)"]
    },
    nutri: { cal: 490, prot: 37, carb: 49, gord: 14.0, fibra: 4.5 }
  }
];

const MARMITAS_SAUDAVEIS = [
  {
    id: 101,
    nome: "Frango Grelhado com Arroz Integral e Feijão",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 450g",
    descricao: "Frango grelhado, arroz integral, feijão carioca e brócolis no alho.",
    preco: 19.90,
    imagem: "/images/marmitas/saudavel-frango-arroz-integral.jpg",
    composicaoPadrao: {
      proteina: "Frango Grelhado (150g)",
      base: "Arroz Integral + Feijão Carioca (220g)",
      legumes: ["Brócolis ao Alho (80g)"]
    },
    nutri: { cal: 405, prot: 39, carb: 46, gord: 8.0, fibra: 8.0 }
  },
  {
    id: 102,
    nome: "Frango Desfiado com Purê de Batata-doce",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 400g",
    descricao: "Frango desfiado bem temperado, purê de batata-doce e cenoura cozida.",
    preco: 19.90,
    imagem: "/images/marmitas/saudavel-frango-pure-batata-doce.jpg",
    composicaoPadrao: {
      proteina: "Frango Desfiado (150g)",
      base: "Purê de Batata-doce (180g)",
      legumes: ["Cenoura Cozida (70g)"]
    },
    nutri: { cal: 385, prot: 37, carb: 42, gord: 7.0, fibra: 6.0 }
  },
  {
    id: 103,
    nome: "Carne em Tiras com Arroz, Feijão e Abobrinha",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 450g",
    descricao: "Carne magra em tiras, arroz soltinho, feijão e abobrinha refogada.",
    preco: 22.90,
    imagem: "/images/marmitas/saudavel-carne-tiras-arroz-feijao.jpg",
    composicaoPadrao: {
      proteina: "Carne Magra em Tiras (150g)",
      base: "Arroz Branco + Feijão Carioca (220g)",
      legumes: ["Abobrinha Refogada (80g)"]
    },
    nutri: { cal: 445, prot: 38, carb: 45, gord: 11.0, fibra: 7.0 }
  },
  {
    id: 104,
    nome: "Patinho Moído com Arroz Integral e Legumes",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 450g",
    descricao: "Patinho moído refogado, arroz integral, feijão e legumes cozidos.",
    preco: 20.90,
    imagem: "/images/marmitas/saudavel-patinho-arroz-integral.jpg",
    composicaoPadrao: {
      proteina: "Patinho Moído Magro (150g)",
      base: "Arroz Integral + Feijão Carioca (220g)",
      legumes: ["Mix de Legumes Cozidos (80g)"]
    },
    nutri: { cal: 430, prot: 39, carb: 43, gord: 10.0, fibra: 8.0 }
  },
  {
    id: 105,
    nome: "Frango Grelhado com Batata-doce e Legumes",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 400g",
    descricao: "Filé de frango grelhado, batata-doce assada e mix de legumes.",
    preco: 18.90,
    imagem: "/images/marmitas/saudavel-frango-batata-doce.jpg",
    composicaoPadrao: {
      proteina: "Filé de Frango Grelhado (150g)",
      base: "Batata-doce Assada (170g)",
      legumes: ["Mix de Legumes (80g)"]
    },
    nutri: { cal: 370, prot: 38, carb: 39, gord: 7.0, fibra: 7.0 }
  },
  {
    id: 106,
    nome: "Frango Grelhado com Arroz, Feijão e Couve",
    categoria: "Marmitas Saudáveis",
    badgeClasse: "badge-verde",
    pesoEmbalagem: "Pote Fit 450g",
    descricao: "Frango grelhado, arroz branco, feijão carioca e couve refogada.",
    preco: 19.90,
    imagem: "/images/marmitas/saudavel-frango-couve-arroz-feijao.jpg",
    composicaoPadrao: {
      proteina: "Frango Grelhado (150g)",
      base: "Arroz Branco + Feijão Carioca (220g)",
      legumes: ["Couve Refogada (80g)"]
    },
    nutri: { cal: 415, prot: 39, carb: 47, gord: 8.0, fibra: 7.0 }
  }
];

const VISUAIS_MARMITAS = {
  1: { proteina: "lasanha", base: "molho", legumes: "queijo" },
  2: { proteina: "strogonoff", base: "arroz", legumes: "batata" },
  3: { proteina: "carne", base: "arroz-feijao", legumes: "mix" },
  4: { proteina: "frango", base: "arroz-pure", legumes: "brocolis" },
  5: { proteina: "moida", base: "arroz-feijao", legumes: "cenoura" },
  6: { proteina: "carne-seca", base: "mandioca", legumes: "queijo" },
  101: { proteina: "frango", base: "integral-feijao", legumes: "brocolis" },
  102: { proteina: "frango-desfiado", base: "batata-doce-pure", legumes: "cenoura" },
  103: { proteina: "carne-tiras", base: "arroz-feijao", legumes: "abobrinha" },
  104: { proteina: "moida", base: "integral-feijao", legumes: "mix" },
  105: { proteina: "frango", base: "batata-doce", legumes: "mix" },
  106: { proteina: "frango", base: "arroz-feijao", legumes: "couve" }
};

const RICE_GRAINS = Array.from({ length: 44 }, (_, index) => ({
  x: 372 + ((index * 37 + 13) % 165),
  y: 82 + ((index * 23 + Math.floor(index / 4) * 7) % 92),
  rotation: (index * 29) % 180,
  shade: index % 4
}));

function MarmitaImagem({ marmita }) {
  const visual = VISUAIS_MARMITAS[marmita.id];
  const id = `marmita-${marmita.id}`;
  const temArroz = visual.base.includes("arroz");
  const temFeijao = visual.base.includes("feijao");
  const temPure = ["arroz-pure", "batata-doce-pure", "mandioca"].includes(visual.base);
  const tipoPure = visual.base === "batata-doce-pure" || visual.base === "batata-doce"
    ? "sweet-potato"
    : visual.base === "mandioca" ? "cassava" : "potato";

  return (
    <svg
      className="meal-tray-illustration"
      viewBox="0 0 640 420"
      role="img"
      aria-label={`${marmita.nome} em marmita retangular transparente com divisórias`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-background`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4f0e5" />
          <stop offset="1" stopColor="#e9e5d8" />
        </linearGradient>
        <linearGradient id={`${id}-tray`} x1="0" y1="0" x2="0.9" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".84" />
          <stop offset=".48" stopColor="#edf4ef" stopOpacity=".58" />
          <stop offset="1" stopColor="#d7e3db" stopOpacity=".82" />
        </linearGradient>
        <linearGradient id={`${id}-chicken`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efbd70" />
          <stop offset=".55" stopColor="#c97b39" />
          <stop offset="1" stopColor="#95502c" />
        </linearGradient>
        <linearGradient id={`${id}-meat`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a55e34" />
          <stop offset="1" stopColor="#683922" />
        </linearGradient>
        <linearGradient id={`${id}-pure`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={tipoPure === "sweet-potato" ? "#f6ca83" : "#f4e3b8"} />
          <stop offset="1" stopColor={tipoPure === "sweet-potato" ? "#dc9651" : "#d8c38f"} />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="13" stdDeviation="13" floodColor="#4a493b" floodOpacity=".2" />
        </filter>
        <clipPath id={`${id}-main-clip`}>
          <rect x="91" y="74" width="247" height="274" rx="24" />
        </clipPath>
        <clipPath id={`${id}-rice-clip`}>
          <rect x="354" y="74" width="193" height="125" rx="19" />
        </clipPath>
        <clipPath id={`${id}-side-clip`}>
          <rect x="354" y="211" width="193" height="137" rx="19" />
        </clipPath>
      </defs>

      <rect width="640" height="420" fill={`url(#${id}-background)`} />
      <ellipse cx="321" cy="370" rx="242" ry="25" fill="#6d6a5a" opacity=".12" />

      <g filter={`url(#${id}-shadow)`}>
        <rect x="67" y="38" width="506" height="344" rx="39" fill={`url(#${id}-tray)`} stroke="#ffffff" strokeWidth="8" />
        <rect x="74" y="45" width="492" height="330" rx="34" fill="none" stroke="#b8c8bd" strokeWidth="3" opacity=".92" />
        <rect x="84" y="56" width="462" height="312" rx="28" fill="#ffffff" fillOpacity=".31" stroke="#ffffff" strokeWidth="3" />

        <g clipPath={`url(#${id}-main-clip)`}>
          <rect x="91" y="74" width="247" height="274" fill="#f3ead4" />
          {visual.proteina === "lasanha" ? (
            <g>
              <rect x="94" y="78" width="241" height="267" rx="19" fill="#bf542e" />
              <path d="M108 119 Q158 98 210 119 T325 119 L325 143 Q269 163 217 142 T108 145Z" fill="#e1a653" />
              <path d="M105 185 Q159 162 215 183 T329 183 L329 210 Q270 231 214 210 T105 213Z" fill="#ead18d" />
              <path d="M103 252 Q160 228 214 250 T328 250 L328 278 Q267 299 213 277 T103 281Z" fill="#df9f4b" />
              <g fill="#f0ddaa">
                <circle cx="140" cy="103" r="7" /><circle cx="206" cy="105" r="6" /><circle cx="272" cy="102" r="7" />
                <circle cx="169" cy="166" r="6" /><circle cx="248" cy="169" r="7" /><circle cx="301" cy="164" r="5" />
                <circle cx="132" cy="235" r="6" /><circle cx="194" cy="232" r="7" /><circle cx="279" cy="238" r="6" />
                <circle cx="160" cy="310" r="6" /><circle cx="232" cy="306" r="7" /><circle cx="298" cy="309" r="6" />
              </g>
            </g>
          ) : visual.proteina === "escondidinho" ? (
            <g>
              <rect x="94" y="77" width="241" height="269" rx="19" fill={`url(#${id}-pure)`} />
              <path d="M100 121 Q158 104 215 121 T330 119 M99 183 Q157 166 214 184 T330 182 M100 250 Q157 233 215 250 T331 249 M100 315 Q157 297 215 315 T331 313" fill="none" stroke="#f8edcf" strokeWidth="10" strokeLinecap="round" opacity=".75" />
              <path d="M132 147 C164 126 186 139 209 154 C230 168 251 149 274 154 C294 160 296 183 275 193 C251 204 226 185 206 197 C184 210 165 205 146 193 C128 181 119 161 132 147Z" fill={`url(#${id}-meat)`} />
              <path d="M147 157 Q173 147 191 166 M206 161 Q231 151 249 169 M164 186 Q190 176 211 192 M231 184 Q251 175 269 185" fill="none" stroke="#e1a65f" strokeWidth="5" strokeLinecap="round" />
              <g fill="#f0ddaa"><circle cx="133" cy="132" r="6" /><circle cx="286" cy="133" r="7" /><circle cx="120" cy="220" r="6" /><circle cx="302" cy="220" r="6" /><circle cx="144" cy="283" r="7" /><circle cx="270" cy="283" r="6" /></g>
            </g>
          ) : visual.proteina === "moida" ? (
            <g>
              <rect x="94" y="77" width="241" height="269" rx="19" fill="#b98453" />
              {Array.from({ length: 75 }, (_, index) => (
                <ellipse key={index} cx={110 + ((index * 43 + 17) % 207)} cy={92 + ((index * 31 + Math.floor(index / 7) * 9) % 238)} rx={4 + index % 4} ry={3 + index % 3} transform={`rotate(${(index * 37) % 160} ${110 + ((index * 43 + 17) % 207)} ${92 + ((index * 31 + Math.floor(index / 7) * 9) % 238)})`} fill={["#75422c", "#965636", "#bc7547", "#d39159"][index % 4]} />
              ))}
            </g>
          ) : (
            <g>
              <rect x="94" y="77" width="241" height="269" rx="19" fill="#d9c39d" />
              {Array.from({ length: visual.proteina === "carne-seca" || visual.proteina === "frango-desfiado" ? 22 : 8 }, (_, index) => {
                const x = 119 + ((index * 67 + 13) % 192);
                const y = 105 + ((index * 53 + Math.floor(index / 3) * 11) % 211);
                const isChicken = visual.proteina === "frango" || visual.proteina === "frango-desfiado" || visual.proteina === "strogonoff";
                return (
                  <g key={index} transform={`rotate(${(index * 31) % 70 - 35} ${x} ${y})`}>
                    <ellipse cx={x} cy={y} rx={visual.proteina === "carne-tiras" ? 39 : 30 + index % 9} ry={visual.proteina === "carne-tiras" ? 16 : 20 + index % 5} fill={visual.proteina === "strogonoff" ? "#f2dfbe" : isChicken ? `url(#${id}-chicken)` : `url(#${id}-meat)`} />
                    <path d={`M${x - 16} ${y - 5} Q${x} ${y - 13} ${x + 16} ${y - 3}`} fill="none" stroke={visual.proteina === "strogonoff" ? "#dba96c" : "#774625"} strokeWidth="4" strokeLinecap="round" opacity=".7" />
                    {isChicken && <path d={`M${x - 10} ${y + 6} Q${x} ${y + 2} ${x + 11} ${y + 7}`} fill="none" stroke="#f7d793" strokeWidth="3" strokeLinecap="round" opacity=".8" />}
                  </g>
                );
              })}
              {visual.proteina === "strogonoff" && <g fill="#b85438"><circle cx="143" cy="140" r="8" /><circle cx="241" cy="220" r="9" /><circle cx="189" cy="286" r="7" /></g>}
              <g fill="#55713d"><circle cx="121" cy="119" r="4" /><circle cx="282" cy="185" r="4" /><circle cx="174" cy="302" r="4" /><circle cx="302" cy="269" r="4" /></g>
            </g>
          )}
        </g>

        <g clipPath={`url(#${id}-rice-clip)`}>
          <rect x="354" y="74" width="193" height="125" fill={temPure ? `url(#${id}-pure)` : temArroz ? "#f2ead8" : "#eadfc8"} />
          {temPure && (
            <g>
              <path d="M362 112 Q397 94 433 111 T541 110 M361 157 Q401 138 440 156 T542 155" fill="none" stroke="#fff1d2" strokeWidth="12" strokeLinecap="round" opacity=".82" />
              <path d="M373 129 C406 113 431 124 453 139 C471 151 507 132 528 140" fill="none" stroke={tipoPure === "sweet-potato" ? "#c47a3c" : "#c5a873"} strokeWidth="6" strokeLinecap="round" opacity=".55" />
            </g>
          )}
          {visual.base === "molho" && <g><rect x="354" y="74" width="193" height="125" fill="#c74f30" /><path d="M364 110 Q405 93 447 111 T540 108 M364 158 Q411 140 451 157 T541 154" fill="none" stroke="#e99555" strokeWidth="10" strokeLinecap="round" /><g fill="#f4dfa5"><circle cx="390" cy="95" r="5" /><circle cx="475" cy="132" r="6" /><circle cx="514" cy="174" r="5" /></g></g>}
          {temArroz && (
            <g>
              {RICE_GRAINS.map((grain, index) => (
                <ellipse key={index} cx={grain.x} cy={grain.y} rx="7.5" ry="3.1" transform={`rotate(${grain.rotation} ${grain.x} ${grain.y})`} fill={visual.base.includes("integral") ? ["#b99163", "#d0ad7b", "#e0c596", "#c5a071"][grain.shade] : ["#fffaf0", "#f7eedc", "#e8dbc1", "#ffffff"][grain.shade]} />
              ))}
            </g>
          )}
          {!temArroz && !temPure && visual.base !== "molho" && (
            <g>
              <path d="M364 126 Q405 109 448 126 T538 124 M364 166 Q405 150 448 166 T538 164" fill="none" stroke="#f7eccd" strokeWidth="12" strokeLinecap="round" />
              <g fill="#a96c3e"><circle cx="393" cy="110" r="9" /><circle cx="429" cy="149" r="10" /><circle cx="479" cy="113" r="8" /><circle cx="519" cy="157" r="10" /></g>
            </g>
          )}
          {temFeijao && (
            <g fill="#74442b">
              <ellipse cx="394" cy="119" rx="9" ry="6" /><ellipse cx="422" cy="142" rx="10" ry="6" /><ellipse cx="456" cy="119" rx="8" ry="6" /><ellipse cx="489" cy="148" rx="10" ry="6" /><ellipse cx="521" cy="120" rx="8" ry="6" />
            </g>
          )}
        </g>

        <g clipPath={`url(#${id}-side-clip)`}>
          <rect x="354" y="211" width="193" height="137" fill={visual.legumes === "queijo" ? "#f0e1bb" : "#dfe6ce"} />
          {visual.legumes === "brocolis" ? (
            <g>
              {[[390, 249], [431, 276], [389, 314], [435, 327], [492, 250], [510, 304]].map(([x, y], index) => (
                <g key={index}>
                  <path d={`M${x} ${y + 11} l-5 24 11 0 -3-24`} fill="#719344" />
                  <circle cx={x} cy={y} r="16" fill={index % 2 ? "#417542" : "#4d8346"} />
                  <circle cx={x - 7} cy={y + 1} r="8" fill="#65984d" />
                  <circle cx={x + 6} cy={y - 6} r="8" fill="#578749" />
                </g>
              ))}
              <g fill="#d6b66e"><circle cx="478" cy="330" r="5" /><circle cx="468" cy="320" r="4" /><circle cx="493" cy="317" r="4" /></g>
            </g>
          ) : visual.legumes === "cenoura" ? (
            <g>
              {[[380, 237], [421, 265], [383, 300], [425, 326], [492, 241], [510, 289], [482, 324]].map(([x, y], index) => (
                <g key={index} transform={`rotate(${index * 23 - 28} ${x} ${y})`}>
                  <rect x={x - 19} y={y - 9} width="38" height="18" rx="9" fill={index % 2 ? "#e78d43" : "#f0a24f"} />
                  <path d={`M${x - 7} ${y - 5} l-3 10 M${x + 4} ${y - 5} l-3 10`} stroke="#d57736" strokeWidth="2" opacity=".65" />
                </g>
              ))}
            </g>
          ) : visual.legumes === "abobrinha" ? (
            <g>
              {[[385, 248], [432, 280], [388, 318], [492, 245], [505, 306]].map(([x, y], index) => (
                <g key={index}>
                  <circle cx={x} cy={y} r="24" fill={index % 2 ? "#64864d" : "#77985a"} />
                  <circle cx={x} cy={y} r="17" fill="#c5d18e" />
                  <circle cx={x - 6} cy={y - 2} r="3" fill="#f1e4a6" /><circle cx={x + 6} cy={y + 5} r="3" fill="#f1e4a6" />
                </g>
              ))}
              <g fill="#d29355"><circle cx="462" cy="320" r="7" /><circle cx="474" cy="331" r="6" /><circle cx="457" cy="338" r="5" /></g>
            </g>
          ) : visual.legumes === "couve" ? (
            <g>
              {Array.from({ length: 15 }, (_, index) => (
                <path key={index} d={`M${367 + ((index * 37) % 166)} ${230 + ((index * 23) % 101)} q15 -9 27 0 q-12 6 -27 0`} fill={["#446a39", "#557d43", "#719249"][index % 3]} />
              ))}
              <g fill="#b88c57"><circle cx="485" cy="245" r="8" /><circle cx="510" cy="284" r="7" /><circle cx="476" cy="329" r="8" /></g>
            </g>
          ) : visual.legumes === "queijo" ? (
            <g>
              {Array.from({ length: 8 }, (_, index) => (
                <path key={index} d={`M${371 + (index % 4) * 42} ${235 + Math.floor(index / 4) * 55} l26 -6 -4 20 -22 5Z`} fill={index % 2 ? "#f0d788" : "#e4c66e"} />
              ))}
              <g fill="#a95734"><circle cx="397" cy="326" r="6" /><circle cx="470" cy="318" r="5" /></g>
            </g>
          ) : visual.legumes === "batata" ? (
            <g>
              {[[384, 247], [428, 270], [384, 316], [490, 247], [510, 306]].map(([x, y], index) => (
                <rect key={index} x={x - 18} y={y - 14} width="36" height="28" rx="8" transform={`rotate(${index * 13 - 20} ${x} ${y})`} fill={index % 2 ? "#d9a64d" : "#edc16e"} />
              ))}
              <g fill="#9d6841"><circle cx="472" cy="325" r="5" /><circle cx="485" cy="332" r="4" /></g>
            </g>
          ) : (
            <g>
              {[[380, 241], [419, 267], [379, 310], [426, 326], [492, 240], [510, 289], [478, 328]].map(([x, y], index) => (
                <g key={index}>
                  <rect x={x - 14} y={y - 12} width="28" height="24" rx="6" transform={`rotate(${index * 19 - 22} ${x} ${y})`} fill={["#df914d", "#73a05a", "#e9c673", "#8ba961"][index % 4]} />
                  <circle cx={x - 5} cy={y - 3} r="2" fill="#f6d590" />
                </g>
              ))}
            </g>
          )}
        </g>

        <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".95">
          <path d="M103 63 H243" />
          <path d="M361 63 H492" />
          <path d="M78 83 Q78 59 103 59" />
          <path d="M510 58 Q558 59 558 103" />
        </g>
        <g fill="none" stroke="#9eb1a4" strokeWidth="3">
          <rect x="85" y="67" width="259" height="289" rx="28" />
          <rect x="348" y="67" width="204" height="139" rx="23" />
          <rect x="348" y="204" width="204" height="151" rx="23" />
        </g>
      </g>
    </svg>
  );
}

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

  // CÁLCULO DE PREÇO E MACROS EM TEMPO REAL
  const calculoCustomizacao = useMemo(() => {
    let preco = customizacao.tamanho ? customizacao.tamanho.preco : 21.90;
    let nutri = { cal: 0, prot: 0, carb: 0, gord: 0, fibra: 0 };
    const fator = customizacao.tamanho ? customizacao.tamanho.fatorNutri : 1.0;

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

    (customizacao.legumes || []).forEach(legId => {
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

  // TOTAIS DO CARRINHO E REGRA DE 15 UNIDADES
  const totalMarmitas = carrinho.reduce((acc, item) => acc + (item.qtd || 1), 0);
  const subtotalCarrinho = carrinho.reduce((acc, item) => acc + (item.precoUnitario * item.qtd), 0);
  
  const atingiuMinimo = totalMarmitas >= PEDIDO_MINIMO_MARMITAS;
  const marmitasFaltando = Math.max(0, PEDIDO_MINIMO_MARMITAS - totalMarmitas);
  
  // DESCONTO DE COMBO / KIT (5% A PARTIR DE 15 UNIDADES)
  const valorDescontoKit = atingiuMinimo ? (subtotalCarrinho * PERCENTUAL_DESCONTO_KIT) : 0;
  const totalComDesconto = subtotalCarrinho - valorDescontoKit;

  // AÇÕES
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

  const adicionarPratoDireto = (marmita) => {
    const itemExistenteIndex = carrinho.findIndex(item => item.idPratoOriginal === marmita.id);

    if (itemExistenteIndex > -1) {
      const novoCarrinho = [...carrinho];
      novoCarrinho[itemExistenteIndex].qtd += 1;
      setCarrinho(novoCarrinho);
    } else {
      const novoItem = {
        cartId: Date.now() + Math.random(),
        idPratoOriginal: marmita.id,
        nome: marmita.nome,
        tipo: "Prato Pronto",
        tamanho: marmita.pesoEmbalagem,
        proteina: marmita.composicaoPadrao.proteina,
        base: marmita.composicaoPadrao.base,
        legumes: marmita.composicaoPadrao.legumes || [],
        remocoes: [],
        adicionais: [],
        obsItem: "",
        precoUnitario: marmita.preco,
        qtd: 1,
        nutri: marmita.nutri
      };
      setCarrinho(prev => [...prev, novoItem]);
    }

    setCarrinhoAberto(true);
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
      const existe = (prev.legumes || []).includes(id);
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
      const existe = (prev.remocoes || []).includes(ingrediente);
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
      legumes: (customizacao.legumes || []).map(lid => OPCOES_MONTAGEM.legumes.find(l => l.id === lid)?.nome),
      remocoes: customizacao.remocoes || [],
      adicionais: listaAdicionais,
      obsItem: customizacao.obsItem,
      precoUnitario: calculoCustomizacao.precoFinal,
      qtd: 1,
      nutri: calculoCustomizacao.nutri
    };

    setCarrinho(prev => [...prev, novoItem]);
    setModalCustomizar(false);
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

  // CHECKOUT WHATSAPP FORMATADO
  const finalizarPedidoWhatsApp = () => {
    if (!atingiuMinimo) {
      return alert(`O pedido mínimo para entrega de congelados na Grande BH é de ${PEDIDO_MINIMO_MARMITAS} unidades. Faltam ${marmitasFaltando} marmitas.`);
    }

    if (!cliente.nome.trim() || !cliente.endereco.trim() || !cliente.bairro.trim()) {
      return alert("Por favor, preencha seu nome, endereço e bairro para calcularmos a rota de entrega na RMBH!");
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
      msg += `   ▫️ *Composição:* ${item.proteina} + ${item.base} + ${(item.legumes || []).join(', ')}\n`;

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
    msg += `🛵 _Taxa de entrega combinada para rota em Belo Horizonte / Contagem / Betim / Nova Lima._\n`;

    const url = `https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const marmitasFiltradas = filtroCategoria === "Todas"
    ? [...MARMITAS_PRONTAS, ...MARMITAS_SAUDAVEIS]
    : [...MARMITAS_PRONTAS, ...MARMITAS_SAUDAVEIS].filter(
      marmita => marmita.categoria.toLowerCase() === filtroCategoria.toLowerCase()
    );

  const secoesCardapio = filtroCategoria === "Todas"
    ? [
      {
        id: "classicas",
        titulo: "Comida caseira, do jeito que a gente gosta",
        descricao: "Receitas queridas, porções generosas e sabor de almoço feito em casa.",
        marmitas: marmitasFiltradas.filter(marmita => marmita.categoria !== "Marmitas Saudáveis")
      },
      {
        id: "saudaveis",
        titulo: "Marmitas Saudáveis",
        descricao: "Combinações equilibradas com ingredientes do dia a dia, sem abrir mão do sabor.",
        marmitas: marmitasFiltradas.filter(marmita => marmita.categoria === "Marmitas Saudáveis")
      }
    ]
    : [{
      id: filtroCategoria,
      titulo: filtroCategoria,
      descricao: filtroCategoria === "Marmitas Saudáveis"
        ? "Refeições equilibradas, com comida brasileira e ingredientes que você conhece."
        : "Receitas caseiras preparadas para deixar seu almoço da semana mais gostoso.",
      marmitas: marmitasFiltradas
    }];

  return (
    <div className="app-container">
      {/* AVISO DO TOPO */}
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
          <div className="hero-tag">COMIDA CASEIRA CONGELADA • GRANDE BH</div>
          <h2 className="hero-title">Almoço de verdade, pronto para a sua semana.</h2>
          <p className="hero-desc">
            Marmitas caprichadas, com ingredientes do dia a dia e aquele sabor de comida feita em casa. Escolha suas favoritas e receba em casa.
          </p>
          <div className="hero-actions">
            <button onClick={() => abrirMontador(null)} className="btn-primary">
              Montar minha marmita
            </button>
            <a href="#cardapio" className="btn-secondary">
              Explorar cardápio
            </a>
          </div>
          <div className="hero-highlights" aria-label="Vantagens">
            <span>Feita com carinho</span>
            <span>Porção generosa</span>
            <span>Pronta para aquecer</span>
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORIA */}
      <nav className="categories-nav" id="cardapio">
        {["Todas", "Mais Vendida", "Clássica", "Tradicional", "Linha Fit", "Equilíbrio", "Mineira", "Marmitas Saudáveis"].map(cat => (
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
        {secoesCardapio.map(secao => (
          <section key={secao.id} className={`menu-section ${secao.id === "saudaveis" || secao.id === "Marmitas Saudáveis" ? "healthy-section" : ""}`}>
            <div className="section-heading">
              <div>
                <span className="section-kicker">{secao.id === "saudaveis" || secao.id === "Marmitas Saudáveis" ? "EQUILÍBRIO COM SABOR" : "CARDÁPIO DA CASA"}</span>
                <h2>{secao.titulo}</h2>
                <p>{secao.descricao}</p>
              </div>
              <span className="section-count">{secao.marmitas.length} opções</span>
            </div>
            <div className="dishes-grid">
              {secao.marmitas.map((marmita) => (
            <div key={marmita.id} className="dish-card pote-comercial-card">
              <span className={`card-badge ${marmita.badgeClasse}`}>
                {marmita.categoria}
              </span>

              <div className="card-media">
                {marmita.imagem ? (
                  <img
                    src={marmita.imagem}
                    alt={marmita.nome}
                    className="card-img"
                    loading="lazy"
                  />
                ) : (
                  <MarmitaImagem marmita={marmita} />
                )}

                <div className="pote-rotulo-overlay">
                  <span>EMBALAGEM INDIVIDUAL • DELIVERY</span>
                </div>

                <span className="badge-pote-volume">{marmita.pesoEmbalagem}</span>
                <button
                  type="button"
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
                      type="button"
                      onClick={() => abrirMontador(marmita)}
                      className="btn-outline"
                    >
                      ⚙️ Ajustar
                    </button>
                    <button
                      type="button"
                      onClick={() => adicionarPratoDireto(marmita)}
                      className="btn-add"
                    >
                      + Adicionar ao kit
                    </button>
                  </div>
                </div>
              </div>
            </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* MODAL: PERSONALIZAÇÃO / MONTE SUA MARMITA */}
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
                    className={`chip-card ${customizacao.tamanho && customizacao.tamanho.id === tam.id ? 'active' : ''}`}
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
                    className={`list-row ${customizacao.proteina && customizacao.proteina.id === prot.id ? 'active' : ''}`}
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

            {/* 3. Base */}
            <div className="config-step">
              <label className="step-title">3. Selecione a Base de Carboidrato</label>
              <div className="list-options">
                {OPCOES_MONTAGEM.bases.map(base => (
                  <div
                    key={base.id}
                    onClick={() => setCustomizacao({ ...customizacao, base: base })}
                    className={`list-row ${customizacao.base && customizacao.base.id === base.id ? 'active' : ''}`}
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
                  const sel = (customizacao.legumes || []).includes(leg.id);
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

            {/* 5. Adicionais com Preço */}
            <div className="config-step">
              <label className="step-title">5. Adicionais Turbinados no Pote (Opcional)</label>
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
                  const sel = (customizacao.remocoes || []).includes(ing);
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

      {/* OFFCANVAS DO CARRINHO INTELIGENTE */}
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
                      <div><strong>Legumes:</strong> {(item.legumes || []).join(', ')}</div>
                      {(item.remocoes || []).length > 0 && (
                        <div className="text-danger">
                          <strong>Sem:</strong> {item.remocoes.join(', ')}
                        </div>
                      )}
                      {(item.adicionais || []).length > 0 && (
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

      {/* MODAL: CHECKOUT RMBH */}
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

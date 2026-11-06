// ==========================================
// 1. Carrossel Principal (.carrossel)
// ==========================================
function iniciarCarrossel(carrossel) {
  const slides = carrossel.querySelectorAll(".slide");
  const bolinhas = carrossel.querySelector(".bolinhas");
  const esquerda = carrossel.querySelector(".seta.esquerda");
  const direita = carrossel.querySelector(".seta.direita");
  
  if (!slides.length || !bolinhas) return; // Segurança caso falte HTML

  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer;

  function mostrar(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("ativo", n === index));
    if (bolinhas) {
      [...bolinhas.children].forEach((b, n) => b.classList.toggle("ativa", n === index));
    }
  }

  slides.forEach((_, i) => {
    const b = document.createElement("span");
    b.addEventListener("click", () => mostrar(i));
    bolinhas.appendChild(b);
  });

  if (esquerda) esquerda.addEventListener("click", () => mostrar(index - 1));
  if (direita) direita.addEventListener("click", () => mostrar(index + 1));

  function iniciar() { 
    if (!reduzir) timer = setInterval(() => mostrar(index + 1), 6000); 
  }
  function parar() { 
    clearInterval(timer); 
  }

  carrossel.addEventListener("mouseenter", parar);
  carrossel.addEventListener("mouseleave", iniciar);

  mostrar(0);
  iniciar();
}

document.querySelectorAll(".carrossel").forEach(iniciarCarrossel);


// ==========================================
// 2. "Aberto agora"
// ==========================================
const horarios = {
  0: null,
  1: [9, 18],
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 20],
  6: [10, 16],
};

function atualizarStatus() {
  const el = document.getElementById("status-loja");
  if (!el) return;

  const agora = new Date();
  const hoje = horarios[agora.getDay()];
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const aberto = hoje !== null && hora >= hoje[0] && hora < hoje[1];

  el.textContent = aberto ? `Aberto agora – fecha às ${hoje[1]}h` : "Fechado agora";
  el.classList.toggle("aberto", aberto);
  el.classList.toggle("fechado", !aberto);
}

atualizarStatus();
setInterval(atualizarStatus, 60000);


// ==========================================
// 3. Carrossel "Mais pedidos"
// ==========================================
const maisPedidos = [
  { nome: "Trufa de maracujá", desc: "Ganache de maracujá com licor, envolta em chocolate branco", foto: "trufamaracuja.png" },
  { nome: "Trufa de cereja", desc: "Chocolate ao leite com licor de cereja e cereja glaceada", foto: "trufacereja.webp" },
  { nome: "Trufa de menta", desc: "Chocolate meio amargo com licor de menta e hortelã", foto: "trufamenta.jpg" },
  { nome: "Trufa de laranja", desc: "Ganache aromatizada com licor de laranja", foto: "trufalaraja.jpg" },
  { nome: "Choco Martini", desc: "Vodka, licor de cacau e chocolate amargo artesanal", preco: "R$ 26,00", foto: "bebidas2.png" },
  { nome: "Trufa + Choco Martini", desc: "Uma trufa à escolha + nosso coquetel assinatura", preco: "R$ 28,00", foto: "bebidas3.png" },
];

const trilho = document.getElementById("mp-trilho");

if (trilho) {
  trilho.innerHTML = maisPedidos.map(p => `
    <article class="mp-card">
      <img src="imagens/${p.foto}" alt="${p.nome}" loading="lazy">
      <div>
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
        ${p.preco ? `<span class="preco">${p.preco}</span>` : ""}
      </div>
    </article>`).join("");

  // Função passo() movida para dentro ou ajustada para escopo seguro
  const passo = () => {
    const primeiroCard = trilho.querySelector(".mp-card");
    return primeiroCard ? primeiroCard.offsetWidth + 14 : 200;
  };

  const btnProximo = document.getElementById("mp-proximo");
  const btnAnterior = document.getElementById("mp-anterior");

  if (btnProximo) btnProximo.addEventListener("click", () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
  if (btnAnterior) btnAnterior.addEventListener("click", () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));

  function proximo() {
    const noFim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 5;
    if (noFim) {
      trilho.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      trilho.scrollBy({ left: passo(), behavior: 'smooth' });
    }
  }

  let auto = setInterval(proximo, 4000);

  const pausar = () => clearInterval(auto);
  const retomar = () => { 
    pausar(); 
    auto = setInterval(proximo, 4000); 
  };

  trilho.addEventListener("mouseenter", pausar);
  trilho.addEventListener("mouseleave", retomar);
  trilho.addEventListener("touchstart", pausar, { passive: true });
  trilho.addEventListener("touchend", retomar);
}
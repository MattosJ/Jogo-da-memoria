// Array com todas as imagens das cartas (duplicada, pois representam os pares)
const cartas = [
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png',
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png'
];

// Estado do jogo para controlar as cartas viradas e pares encontrados
const estadoJogo = {
  cartasViradas: [],
  podeVirar: true,
  paresEncontrados: 0,
  totalPares: 15, // 30 cartas / 2
  tentativas:0
};
// função acima é infucional pois o estados dos itens seram modificáveis. ex: tentativas será incrementado e decrementado durante a execução do jogo.


// Implementação do algoritmo Fisher-Yates
const embaralharCartas = (array) => {
  // Cria uma cópia do array para evitar mutação do original
  const copiaArray = [...array];
  
  // Função recursiva interna para realizar o embaralhamento
  const embaralharRecursivo = (arr, indice) => {
    // Caso base: quando chegamos ao início do array
    if (indice === 0) return arr;
    
    // Gera um índice aleatório de 0 até o índice atual
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
    
    // Cria um novo array com os elementos trocados
    const novoArray = [...arr];
    
    // Troca os elementos
    [novoArray[indice], novoArray[indiceAleatorio]] = 
      [novoArray[indiceAleatorio], novoArray[indice]];
    
    // Chama recursivamente para o próximo índice
    return embaralharRecursivo(novoArray, indice - 1);
  };
  
  // Inicia a recursão a partir do último elemento
  return embaralharRecursivo(copiaArray, copiaArray.length - 1);
};

// Função para gerar o placar
const gerarPlacar = (tentativas, pares) => ({
  movimentos: tentativas,
  pares: pares
});

// Função para atualizar o placar no HTML
const renderizarPlacar = ({ movimentos, pares }) => {
  const elMov = document.getElementById('movimentos');
  const elPares = document.getElementById('pares');
  if (elMov && elPares) {
    elMov.textContent = movimentos;
    elPares.textContent = pares;
  }
};

// Função para atualizar o placar
const atualizarPlacar = () => {
  const dados = gerarPlacar(estadoJogo.tentativas, estadoJogo.paresEncontrados);
  renderizarPlacar(dados);
};

// Função para virar carta (versão atualizada)
const virarCarta = (carta) => {
  // Verifica se a carta pode ser virada
  if (!estadoJogo.podeVirar || 
      carta.classList.contains('encontrada') || 
      (carta.classList.contains('virou') && estadoJogo.cartasViradas.includes(carta)) ||
      estadoJogo.cartasViradas.length >= 2) {
    return;
  }
  
  // Virar a carta
  carta.classList.add('virou');
  
  // Adicionar à lista de cartas viradas
  estadoJogo.cartasViradas.push(carta);
  // não é funcional pois adiciona elementos ao registro original.
  
  // Verificar se duas cartas foram viradas
  if (estadoJogo.cartasViradas.length === 2) {
    estadoJogo.podeVirar = false; // // mais um exemplo do porque o estado do jogo não é uma função pura.
    estadoJogo.tentativas ++; // mais um exemplo do porque o estado do jogo não é uma função pura.
    setTimeout(() => verificarPar(), 1000);
  }
};

// Função para verificar se as cartas formam um par
const verificarPar = () => {
  const [carta1, carta2] = estadoJogo.cartasViradas;
  const img1 = carta1.querySelector('img').src;
  const img2 = carta2.querySelector('img').src;
  
  // Compara as imagens das cartas
  if (img1 === img2) {
    // É um par!
    marcarComoEncontradas();
  } else {
    // Não é um par
    desvirarCartas();
  }
  atualizarPlacar();
};

// Função para marcar cartas como encontradas - usando map em vez de forEach
const marcarComoEncontradas = () => {
  // Usa map para aplicar a operação em todas as cartas
  estadoJogo.cartasViradas.map(carta => {
    carta.classList.add('encontrada');
    return carta; // Retorno explícito para map
  });
  
  // Incrementa o contador de pares e limpa o estado
  estadoJogo.paresEncontrados++; // não é puro.
  estadoJogo.cartasViradas = []; // não é puro.
  estadoJogo.podeVirar = true; // não é puro. motivos iguais aos acima.
  
  // Verifica se o jogo acabou
  if (estadoJogo.paresEncontrados === estadoJogo.totalPares) {
    setTimeout(() => {
      alert("Parabéns! Você completou o jogo!");
    }, 500);
  }
};

// Função para desvirar cartas que não formam par
const desvirarCartas = () => {
  // Usa map para aplicar a operação em todas as cartas
  estadoJogo.cartasViradas.map(carta => {
    carta.classList.remove('virou');
    return carta; // Retorno explícito para map
  });
  
  // Limpa o estado
  estadoJogo.cartasViradas = [];
  estadoJogo.podeVirar = true;
};

// Função para distribuir as cartas no tabuleiro
const distribuirCartas = () => {
  // Obtém as cartas embaralhadas
  const cartasEmbaralhadas = embaralharCartas(cartas);
  
  // Seleciona todos os elementos de carta no HTML
  const elementosCartas = document.querySelectorAll('.card');
  
  // Cria um array de elementos para poder usar map
  const arrayElementos = Array.from(elementosCartas);
  
  // Aplica as imagens às cartas
  arrayElementos.map((carta, index) => {
    // Remove classes anteriores que possam ter ficado
    carta.classList.remove('virou', 'encontrada');
    
    const imagem = carta.querySelector('img');
    imagem.src = cartasEmbaralhadas[index];
    imagem.alt = cartasEmbaralhadas[index].split('/').pop().split('.')[0];
    
    // Remove listeners antigos para evitar duplicação
    const novoElemento = carta.cloneNode(true);
    carta.replaceWith(novoElemento);
    
    // Adiciona o listener
    novoElemento.addEventListener('click', () => virarCarta(novoElemento));
    
    return novoElemento;
  });
  
  // Reset do estado do jogo
  estadoJogo.cartasViradas = [];
  estadoJogo.podeVirar = true;
  estadoJogo.paresEncontrados = 0;
};

// Fecha as cartas, removendo a classe 'virou' 
const fecharTodasCartas = () => {
  const cartas = document.querySelectorAll('.card');
  
  // Converte NodeList para Array
  Array.from(cartas).map(carta => {
    carta.classList.remove('virou');
    carta.classList.remove('encontrada');
    return carta;
  });
};

// Função para reiniciar o jogo
const reiniciarJogo = () => {
  // Reset do estado do jogo
  estadoJogo.cartasViradas = [];
  estadoJogo.podeVirar = true;
  estadoJogo.paresEncontrados = 0;
  estadoJogo.tentativas = 0;
  fecharTodasCartas();
  distribuirCartas();
  atualizarPlacar();
};

// Adiciona o evento para o botão de reiniciar
document.querySelector('.btn-reiniciar').addEventListener('click', reiniciarJogo);

// Executa a distribuição de cartas quando a página carrega
document.addEventListener('DOMContentLoaded', reiniciarJogo);

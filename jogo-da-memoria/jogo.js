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
    const novoArray = arr.slice(0);
    
    // Troca os elementos
    [novoArray[indice], novoArray[indiceAleatorio]] = 
      [novoArray[indiceAleatorio], novoArray[indice]];
    
    // Chama recursivamente para o próximo índice
    return embaralharRecursivo(novoArray, indice - 1);
  };
  
  // Inicia a recursão a partir do último elemento
  return embaralharRecursivo(copiaArray, copiaArray.length - 1);
};

// Função para distribuir as cartas no tabuleiro
const distribuirCartas = () => {
  document.getElementById('rodadas').textContent = 'Rodadas: 0';
  document.getElementById('movimentos').textContent = 'Movimentos: 0';
  document.getElementById('pares').textContent = 'Pares: 0';
  const cartasEmbaralhadas = embaralharCartas(cartas);
  
  // Seleciona todos os elementos de carta no HTML
  const elementosCartas = document.querySelectorAll('.card');
  
  // Cria um array de elementos para poder usar map
  const arrayElementos = Array.from(elementosCartas);
  
  // Aplica as imagens às cartas 
  // O map retorna um novo array com os elementos modificados
  arrayElementos.map((carta, index) => {
    const imagem = carta.querySelector('img');
    imagem.src = cartasEmbaralhadas[index];
    imagem.alt = cartasEmbaralhadas[index].split('/').pop().split('.')[0];
    carta.addEventListener('click', () => virarCarta(carta))
    return carta; // Retorna o elemento modificado
  });
}

// Adiciona o evento para o botão de reiniciar
document.querySelector('.btn-reiniciar').addEventListener('click', distribuirCartas);

// Executa a distribuição de cartas quando a página carrega
document.addEventListener('DOMContentLoaded', distribuirCartas);

function myFunction() {
  var element = document.getElementById("myDIV");
  element.classList.toggle("mystyle");
}

const virarCarta = (carta) => {
  const img = carta.querySelector('img')
  
  if (img.style.opacity === '1') {
    (img.style.opacity = '0')
  } else {
    img.style.opacity = '1'
  }


  return carta
}
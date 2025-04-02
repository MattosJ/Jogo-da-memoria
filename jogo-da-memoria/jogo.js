// Array com todas as imagens das cartas (duplicada, pois representam os pares)
const cartas = [
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png',
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png'
];

// Implementação  do algoritmo Fisher-Yates
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

// Função para distribuir as cartas no tabuleiro
const distribuirCartas = () => {
  // Obtém as cartas embaralhadas
  const cartasEmbaralhadas = embaralharCartas(cartas);
  
  // Seleciona todos os elementos de carta no HTML
  const elementosCartas = document.querySelectorAll('.card');
  
  // Cria um array de elementos para poder usar map
  const arrayElementos = Array.from(elementosCartas);
  const novasCartas = arrayElementos.map((carta, index) => { 
  // Clona o elemento da carta
    const novaCarta = carta.cloneNode(true); 
    // Adiciona a classe 'virou' para mostrar a imagem
    carta.replaceWith(novaCarta);
    const imagem = novaCarta.querySelector('img');
    imagem.src = cartasEmbaralhadas[index];
    imagem.alt = cartasEmbaralhadas[index].split('/').pop().split('.')[0];
    
    // Adiciona o listener apenas uma vez
    novaCarta.addEventListener('click', () => virarCarta(novaCarta));
    return novaCarta; // Retorna o elemento clonado
  });


  // Aplica as imagens às cartas 
  // O map retorna um novo array com os elementos modificados
  arrayElementos.map((carta, index) => {
    const imagem = carta.querySelector('img');
    imagem.src = cartasEmbaralhadas[index];
    imagem.alt = cartasEmbaralhadas[index].split('/').pop().split('.')[0];
    //testa de clique na carta
    carta.addEventListener('click', () => virarCarta(carta))
    return carta; // Retorna o elemento modificado
  });
}

// Fecha as cartas, removendo a classe 'virou'
const fecharTodasCartas = () => {
  const cartas = document.querySelectorAll('.card');
  cartas.forEach(carta => {
    carta.classList.remove('virou');
  });
};

const reiniciarJogo = () => {
  fecharTodasCartas();
  distribuirCartas();
};

// Adiciona o evento para o botão de reiniciar
document.querySelector('.btn-reiniciar').addEventListener('click', reiniciarJogo);

// Executa a distribuição de cartas quando a página carrega
document.addEventListener('DOMContentLoaded', reiniciarJogo);

function myFunction() {
  var element = document.getElementById("myDIV");
  element.classList.toggle("mystyle");
}

//teste de virada de carta
function virarCarta(carta) {
  const novaCarta = carta.cloneNode(true);
  carta.classList.toggle('virou');
  
}